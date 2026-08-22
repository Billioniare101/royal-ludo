import type { ClientMessage, ServerMessage } from '@royal-ludo/shared';
import type { IncomingMessage } from 'node:http';
import { WebSocket, type RawData, type WebSocketServer } from 'ws';
import { verifyToken } from '../lib/jwt.js';
import { roomManager } from '../rooms/manager.js';

interface ClientContext {
  playerId?: string;
  username?: string;
  roomCode?: string;
}

const roomClients = new Map<string, Set<WebSocket>>();
const clientContexts = new WeakMap<WebSocket, ClientContext>();

function sendMessage(socket: WebSocket, message: ServerMessage): void {
  socket.send(JSON.stringify(message));
}

function broadcast(roomCode: string, message: ServerMessage): void {
  for (const socket of roomClients.get(roomCode) ?? []) {
    if (socket.readyState === WebSocket.OPEN) {
      sendMessage(socket, message);
    }
  }
}

function joinSocketRoom(socket: WebSocket, roomCode: string): void {
  const members = roomClients.get(roomCode) ?? new Set<WebSocket>();
  members.add(socket);
  roomClients.set(roomCode, members);
}

function leaveSocketRoom(socket: WebSocket, roomCode?: string): void {
  if (!roomCode) {
    return;
  }

  const members = roomClients.get(roomCode);
  if (!members) {
    return;
  }

  members.delete(socket);
  if (members.size === 0) {
    roomClients.delete(roomCode);
  }
}

export function attachWebSocketHandler(wss: WebSocketServer): void {
  wss.on('connection', (socket: WebSocket, _request: IncomingMessage) => {
    sendMessage(socket, { type: 'connected', playerId: 'pending' });
    clientContexts.set(socket, {});

    socket.on('message', (rawData: RawData) => {
      try {
        const message = JSON.parse(rawData.toString()) as ClientMessage;
        const context = clientContexts.get(socket) ?? {};

        switch (message.type) {
          case 'ping': {
            sendMessage(socket, { type: 'pong' });
            break;
          }
          case 'join_room': {
            const payload = verifyToken(message.token);
            const existingRoom = roomManager.getRoom(message.roomCode);
            if (!existingRoom) {
              sendMessage(socket, { type: 'error', message: 'Room not found' });
              return;
            }

            const wasAlreadyInRoom = existingRoom.game.players.some((player) => player.id === payload.userId);
            const room = wasAlreadyInRoom
              ? existingRoom
              : roomManager.joinRoom(message.roomCode, { id: payload.userId, username: payload.username });

            joinSocketRoom(socket, message.roomCode);
            clientContexts.set(socket, {
              playerId: payload.userId,
              username: payload.username,
              roomCode: message.roomCode,
            });

            sendMessage(socket, { type: 'connected', playerId: payload.userId });
            sendMessage(socket, { type: 'room_joined', game: room.game });
            if (!wasAlreadyInRoom) {
              broadcast(message.roomCode, {
                type: 'player_joined',
                playerId: payload.userId,
                username: payload.username,
              });
              broadcast(message.roomCode, { type: 'game_state_update', game: room.game });
            }
            break;
          }
          case 'leave_room': {
            const room = roomManager.removePlayer(message.roomCode, context.playerId ?? '');
            leaveSocketRoom(socket, message.roomCode);
            sendMessage(socket, { type: 'room_left', roomCode: message.roomCode });
            if (context.playerId) {
              broadcast(message.roomCode, { type: 'player_left', playerId: context.playerId });
            }
            if (room) {
              broadcast(message.roomCode, { type: 'game_state_update', game: room.game });
            }
            clientContexts.set(socket, {});
            break;
          }
          case 'player_ready': {
            if (!context.playerId) {
              sendMessage(socket, { type: 'error', message: 'Unauthorized' });
              return;
            }

            const room = roomManager.setPlayerReady(message.roomCode, context.playerId);
            const everyoneReady = room.game.players.length >= 2 && room.game.players.every((player) => player.isReady);
            const activeRoom = everyoneReady ? roomManager.startGame(message.roomCode) : room;

            broadcast(message.roomCode, {
              type: everyoneReady ? 'game_started' : 'game_state_update',
              game: activeRoom.game,
            });
            if (!everyoneReady) {
              broadcast(message.roomCode, { type: 'game_state_update', game: activeRoom.game });
            }
            break;
          }
          case 'roll_dice': {
            if (!context.playerId) {
              sendMessage(socket, { type: 'error', message: 'Unauthorized' });
              return;
            }

            const room = roomManager.rollDice(message.roomCode, context.playerId);
            const diceValue = room.game.diceValue;
            if (diceValue === null) {
              sendMessage(socket, { type: 'error', message: 'Dice roll failed' });
              return;
            }

            broadcast(message.roomCode, {
              type: 'dice_rolled',
              playerId: context.playerId,
              value: diceValue,
            });
            broadcast(message.roomCode, { type: 'game_state_update', game: room.game });
            break;
          }
          case 'move_piece': {
            if (!context.playerId) {
              sendMessage(socket, { type: 'error', message: 'Unauthorized' });
              return;
            }

            const roomBeforeMove = roomManager.getRoom(message.roomCode);
            const movingPiece =
              roomBeforeMove?.game.players
                .find((player) => player.id === context.playerId)
                ?.pieces.find((piece) => piece.id === message.pieceId) ?? null;

            const room = roomManager.movePiece(message.roomCode, context.playerId, message.pieceId);
            const updatedPiece =
              room.game.players
                .find((player) => player.id === context.playerId)
                ?.pieces.find((piece) => piece.id === message.pieceId) ?? null;

            broadcast(message.roomCode, {
              type: 'piece_moved',
              playerId: context.playerId,
              pieceId: message.pieceId,
              from: movingPiece?.position ?? -1,
              to: updatedPiece?.position ?? -1,
            });
            broadcast(message.roomCode, { type: 'game_state_update', game: room.game });
            if (room.game.winner) {
              broadcast(message.roomCode, { type: 'game_over', winner: room.game.winner });
            }
            break;
          }
          default: {
            sendMessage(socket, { type: 'error', message: 'Unsupported message' });
          }
        }
      } catch (error) {
        sendMessage(socket, {
          type: 'error',
          message: error instanceof Error ? error.message : 'Unexpected websocket error',
        });
      }
    });

    socket.on('close', () => {
      const context = clientContexts.get(socket);
      leaveSocketRoom(socket, context?.roomCode);

      if (context?.roomCode && context.playerId) {
        const room = roomManager.removePlayer(context.roomCode, context.playerId);
        broadcast(context.roomCode, { type: 'player_left', playerId: context.playerId });
        if (room) {
          broadcast(context.roomCode, { type: 'game_state_update', game: room.game });
        }
      }
    });
  });
}
