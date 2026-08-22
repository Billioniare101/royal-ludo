import { createInitialGameState, processMovePiece, processRollDice } from '@royal-ludo/game-engine';
import type { Color, GameState, Player, Room } from '@royal-ludo/shared';
import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

const createCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
const COLORS: Color[] = ['red', 'green', 'blue', 'yellow'];

function createPlayer(id: string, username: string, color: Color, isReady = false): Player {
  return {
    id,
    username,
    color,
    isReady,
    pieces: [0, 1, 2, 3].map((index) => ({
      id: `${color}-${index}`,
      color,
      state: 'home' as const,
      position: -1,
    })),
  };
}

function createWaitingGameState(roomCode: string, players: Player[]): GameState {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    roomCode,
    status: 'waiting',
    players,
    currentPlayerIndex: 0,
    diceValue: null,
    diceRolled: false,
    winner: null,
    createdAt: now,
    updatedAt: now,
  };
}

export class RoomManager {
  private readonly rooms = new Map<string, Room>();

  createRoom(hostId: string, maxPlayers: number, hostUsername: string): Room {
    const code = createCode();
    const hostPlayer = createPlayer(hostId, hostUsername, 'red');
    const room: Room = {
      code,
      hostId,
      maxPlayers,
      game: createWaitingGameState(code, [hostPlayer]),
    };

    this.rooms.set(code, room);
    return room;
  }

  joinRoom(code: string, player: { id: string; username: string }): Room {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    const existingPlayer = room.game.players.find((candidate) => candidate.id === player.id);
    if (existingPlayer) {
      return room;
    }

    if (room.game.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    const color = COLORS.find((candidate) => !room.game.players.some((playerInRoom) => playerInRoom.color === candidate));
    if (!color) {
      throw new Error('No available colors');
    }

    room.game = {
      ...room.game,
      players: [...room.game.players, createPlayer(player.id, player.username, color)],
      updatedAt: new Date().toISOString(),
    };

    return room;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  setPlayerReady(code: string, playerId: string): Room {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    room.game = {
      ...room.game,
      players: room.game.players.map((player) =>
        player.id === playerId ? { ...player, isReady: true } : player,
      ),
      updatedAt: new Date().toISOString(),
    };

    return room;
  }

  startGame(code: string): Room {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.game.players.length < 2) {
      throw new Error('Need at least two players to start');
    }

    room.game = createInitialGameState(
      room.game.id,
      code,
      room.game.players.map((player) => ({
        id: player.id,
        username: player.username,
        color: player.color,
      })),
    );

    return room;
  }

  rollDice(code: string, playerId: string): Room {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    room.game = processRollDice(room.game, playerId);
    return room;
  }

  movePiece(code: string, playerId: string, pieceId: string): Room {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    room.game = processMovePiece(room.game, playerId, pieceId);
    return room;
  }

  removePlayer(code: string, playerId: string): Room | undefined {
    const room = this.rooms.get(code);
    if (!room) {
      return undefined;
    }

    const remainingPlayers = room.game.players.filter((player) => player.id !== playerId);
    if (remainingPlayers.length === 0) {
      this.rooms.delete(code);
      return undefined;
    }

    room.game = {
      ...room.game,
      players: remainingPlayers,
      currentPlayerIndex: Math.min(room.game.currentPlayerIndex, remainingPlayers.length - 1),
      updatedAt: new Date().toISOString(),
    };

    if (room.hostId === playerId) {
      room.hostId = remainingPlayers[0].id;
    }

    return room;
  }
}

export const roomManager = new RoomManager();
