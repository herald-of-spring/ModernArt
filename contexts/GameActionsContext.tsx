
import React from 'react';
import { PaintingCard } from '../types';

export interface GameActions {
  startGame: () => void;
  startAuction: (card: PaintingCard) => Promise<void>;
  addSecondDoubleCard: (card: PaintingCard) => Promise<void>;
  passOnDouble: () => Promise<void>;
  setFixedPrice: (price: number) => Promise<void>;
  acceptFixedPrice: () => Promise<void>;
  passFixedPrice: () => Promise<void>;
  placeBid: (amount: number) => Promise<void>;
  passBid: () => Promise<void>;
  placeHiddenBid: (amount: number) => Promise<void>;
  revealHiddenBids: () => Promise<void>;
  resolveAuction: () => Promise<void>;
  startNextRound: () => Promise<void>;
}

export const GameActionsContext = React.createContext<GameActions | null>(null);

export const useGameActions = (): GameActions => {
  const context = React.useContext(GameActionsContext);
  if (!context) {
    throw new Error('useGameActions must be used within a GameActionsContext.Provider');
  }
  return context;
};
