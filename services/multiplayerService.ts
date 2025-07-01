
import { GameState, Player, GamePhase, Artist } from '../types';
import { INITIAL_DECK, ARTISTS_ORDER, INITIAL_MONEY, generateRoomCode } from '../constants';

const ROOM_PREFIX = 'modern-art-room-';
let channel: BroadcastChannel | null = null;

const getRoomKey = (roomCode: string): string => `${ROOM_PREFIX}${roomCode.toUpperCase()}`;

export const multiplayerService = {
  async createRoom(hostPlayerName: string): Promise<{ roomCode: string; playerId: string }> {
    const roomCode = generateRoomCode();
    const playerId = crypto.randomUUID();
    const hostPlayer: Player = {
      id: playerId,
      name: hostPlayerName,
      money: INITIAL_MONEY,
      hand: [],
      purchasedPaintings: [],
    };

    const initialState: GameState = {
      roomId: roomCode,
      hostId: playerId,
      players: [hostPlayer],
      round: 1,
      phase: GamePhase.SETUP,
      deck: [],
      playedCardsThisRound: [],
      artistValues: ARTISTS_ORDER.reduce((acc, artist) => ({ ...acc, [artist]: [null, null, null, null] }), {} as Record<Artist, (number|null)[]>),
      turnOrder: [],
      currentAuctioneerId: playerId,
      currentPlayerId: playerId,
      auctionState: null,
      actionLog: [`Room created by ${hostPlayerName}. Waiting for players...`],
    };

    localStorage.setItem(getRoomKey(roomCode), JSON.stringify(initialState));
    return { roomCode, playerId };
  },

  async joinRoom(roomCode: string, playerName: string): Promise<{ gameState: GameState | null; playerId: string }> {
    const roomKey = getRoomKey(roomCode);
    const existingStateJSON = localStorage.getItem(roomKey);
    if (!existingStateJSON) {
      return { gameState: null, playerId: '' };
    }

    const gameState: GameState = JSON.parse(existingStateJSON);
    if (gameState.players.length >= 5) {
      throw new Error("Room is full.");
    }
     if (gameState.phase !== GamePhase.SETUP) {
      throw new Error("Game has already started.");
    }

    const playerId = crypto.randomUUID();
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      money: INITIAL_MONEY,
      hand: [],
      purchasedPaintings: [],
    };

    gameState.players.push(newPlayer);
    gameState.actionLog = [`${playerName} has joined the room.`, ...gameState.actionLog];
    
    localStorage.setItem(roomKey, JSON.stringify(gameState));
    this.broadcastStateChange(roomCode, gameState);

    return { gameState, playerId };
  },

  async getGameState(roomCode: string): Promise<GameState | null> {
    const stateJSON = localStorage.getItem(getRoomKey(roomCode));
    return stateJSON ? JSON.parse(stateJSON) : null;
  },
  
  async updateGameState(roomCode: string, newState: GameState): Promise<void> {
    localStorage.setItem(getRoomKey(roomCode), JSON.stringify(newState));
    this.broadcastStateChange(roomCode, newState);
  },

  subscribe(roomCode: string, callback: (state: GameState) => void) {
    if (channel) {
      channel.close();
    }
    channel = new BroadcastChannel(getRoomKey(roomCode));
    channel.onmessage = (event) => {
      callback(event.data);
    };

    // Also listen to storage changes for cross-window sync
    const storageListener = (event: StorageEvent) => {
        if (event.key === getRoomKey(roomCode) && event.newValue) {
            callback(JSON.parse(event.newValue));
        }
    };
    window.addEventListener('storage', storageListener);

    return () => {
      if (channel) {
        channel.close();
        channel = null;
      }
      window.removeEventListener('storage', storageListener);
    };
  },

  broadcastStateChange(roomCode: string, newState: GameState) {
    if (channel && channel.name === getRoomKey(roomCode)) {
      channel.postMessage(newState);
    }
  },
};
