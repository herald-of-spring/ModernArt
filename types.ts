
export enum Artist {
  MANUEL_CARVALHO = 'Manuel Carvalho',
  SIGRID_THALER = 'Sigrid Thaler',
  DANIEL_MELIM = 'Daniel Melim',
  RAMON_MARTINS = 'Ramon Martins',
  RAFAEL_SILVEIRA = 'Rafael Silveira',
}

export enum AuctionType {
  OPEN = 'Open',
  ONE_OFFER = 'One Offer',
  HIDDEN = 'Hidden',
  FIXED_PRICE = 'Fixed Price',
  DOUBLE = 'Double',
}

export interface PaintingCard {
  id: string;
  artist: Artist;
  auctionType: AuctionType;
  imageUrl: string;
}

export interface Player {
  id: string;
  name: string;
  money: number;
  hand: PaintingCard[];
  purchasedPaintings: PaintingCard[];
  hasBidOrPassed?: boolean;
}

export enum GamePhase {
  SETUP = 'SETUP', // Waiting for players in the lobby
  AUCTION_START = 'AUCTION_START',
  AUCTION_BIDDING = 'AUCTION_BIDDING',
  AUCTION_RESOLVE = 'AUCTION_RESOLVE',
  SCORING = 'SCORING',
  GAME_OVER = 'GAME_OVER',
}

export type HiddenBid = {
  playerId: string;
  amount: number;
};

export type AuctionState = {
  cards: PaintingCard[];
  auctioneerId: string;
  type: AuctionType;
  highBid: number;
  highBidderId: string | null;
  bids: { playerId: string; amount: number; passed: boolean }[];
  fixedPrice?: number;
  hiddenBids?: HiddenBid[];
  isRevealed?: boolean;
  secondCardPlayerId?: string;
  aiDescription?: string;
  isLoadingDescription?: boolean;
};

export interface GameState {
  roomId: string;
  hostId: string;
  players: Player[];
  round: number; // 1-4
  phase: GamePhase;
  deck: PaintingCard[];
  playedCardsThisRound: { artist: Artist; card: PaintingCard }[];
  artistValues: Record<Artist, (number | null)[]>;
  turnOrder: string[];
  currentAuctioneerId: string;
  currentPlayerId: string; // The player whose action is awaited
  auctionState: AuctionState | null;
  actionLog: string[];
  roundEndTriggerCard?: PaintingCard;
}
