import { WebSocket } from 'ws';
import { GameMessage } from '@royal-ludo/shared';
import { GameState, PlayerColor } from '@royal-ludo/game-engine';
import {
  createInitialState,
  startGame,
  rollDice,
  applyMove,
} from '@royal-ludo/game-engine';

interface Room {
  id: string;
  code: string;
  players: Map<string, { ws: WebSocket; color: PlayerColor }>;
  maxPlayers: number;
  gameState: GameState | null;
}

export class GameRoomManager {
  private rooms = new Map<string, Room>();
  private playerRoom = new Map<string, string>(); // playerId -> roomCode

  handleMessage(ws: WebSocket, playerId: string, msg: GameMessage): void {
    switch (msg.type) {
      case 'CREATE_ROOM':
        this.createRoom(ws, playerId, parseInt(msg.playerCount) as 2 | 4);
        break;
      case 'JOIN_ROOM':
        this.joinRoom(ws, playerId, msg.roomCode);
        break;
      case 'ROLL_DICE':
        this.handleRollDice(playerId, msg.matchId);
        break;
      case 'MOVE_PIECE':
        this.handleMovePiece(playerId, msg.matchId, msg.pieceId);
        break;
    }
  }

  removePlayer(playerId: string): void {
    const roomCode = this.playerRoom.get(playerId);
    if (roomCode) {
      const room = this.rooms.get(roomCode);
      if (room) {
        room.players.delete(playerId);
        if (room.players.size === 0) {
          this.rooms.delete(roomCode);
        } else {
          this.broadcast(room, { type: 'PLAYER_LEFT', playerId });
        }
      }
      this.playerRoom.delete(playerId);
    }
  }

  private createRoom(ws: WebSocket, playerId: string, maxPlayers: 2 | 4): void {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const colors: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];
    const room: Room = {
      id: code,
      code,
      players: new Map([[playerId, { ws, color: colors[0] }]]),
      maxPlayers,
      gameState: null,
    };
    this.rooms.set(code, room);
    this.playerRoom.set(playerId, code);
    ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomCode: code, color: colors[0] }));
  }

  private joinRoom(ws: WebSocket, playerId: string, roomCode: string): void {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Room not found' }));
      return;
    }
    if (room.players.size >= room.maxPlayers) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Room full' }));
      return;
    }
    const colors: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];
    const usedColors = new Set([...room.players.values()].map(p => p.color));
    const color = colors.find(c => !usedColors.has(c))!;
    room.players.set(playerId, { ws, color });
    this.playerRoom.set(playerId, roomCode);
    this.broadcast(room, { type: 'PLAYER_JOINED', playerId, color });

    if (room.players.size === room.maxPlayers) {
      this.startGame(room);
    }
  }

  private startGame(room: Room): void {
    const players = [...room.players.values()].map(p => p.color);
    const count = room.maxPlayers as 2 | 4;
    room.gameState = startGame(createInitialState(players, count));
    this.broadcast(room, {
      type: 'GAME_STARTED',
      gameState: room.gameState,
    });
  }

  private handleRollDice(playerId: string, _matchId: string): void {
    const room = this.getPlayerRoom(playerId);
    if (!room?.gameState) return;
    const playerInfo = room.players.get(playerId);
    if (!playerInfo) return;
    if (room.gameState.currentTurn?.playerColor !== playerInfo.color) {
      playerInfo.ws.send(JSON.stringify({ type: 'ERROR', error: 'Not your turn' }));
      return;
    }
    const dice = Math.floor(Math.random() * 6) + 1;
    room.gameState = rollDice(room.gameState, dice);
    this.broadcast(room, { type: 'DICE_ROLLED', dice, gameState: room.gameState });
  }

  private handleMovePiece(playerId: string, _matchId: string, pieceId: string): void {
    const room = this.getPlayerRoom(playerId);
    if (!room?.gameState) return;
    const playerInfo = room.players.get(playerId);
    if (!playerInfo) return;
    if (room.gameState.currentTurn?.playerColor !== playerInfo.color) {
      playerInfo.ws.send(JSON.stringify({ type: 'ERROR', error: 'Not your turn' }));
      return;
    }
    room.gameState = applyMove(room.gameState, pieceId);
    this.broadcast(room, { type: 'MOVE_APPLIED', pieceId, gameState: room.gameState });

    if (room.gameState.status === 'finished') {
      this.broadcast(room, { type: 'GAME_OVER', winner: room.gameState.winner });
    }
  }

  private getPlayerRoom(playerId: string): Room | undefined {
    const code = this.playerRoom.get(playerId);
    return code ? this.rooms.get(code) : undefined;
  }

  private broadcast(room: Room, data: unknown): void {
    const msg = JSON.stringify(data);
    for (const { ws } of room.players.values()) {
      if (ws.readyState === ws.OPEN) {
        ws.send(msg);
      }
    }
  }
}
