
import React from 'react';
import { GameState, GamePhase, PaintingCard } from '../types';
import GameBoard from './GameBoard';
import PlayerView, { Card } from './PlayerView';
import AuctionView from './AuctionView';
import EndRoundSummary from './EndRoundSummary';
import { useGameActions } from '../contexts/GameActionsContext';

interface GameProps {
    gameState: GameState;
    myPlayerId: string;
}

const Game: React.FC<GameProps> = ({ gameState, myPlayerId }) => {
    const { players, currentAuctioneerId, currentPlayerId, phase, auctionState, round, actionLog } = gameState;
    const { startAuction } = useGameActions();
    
    const me = players.find(p => p.id === myPlayerId)!;
    const canIPlayCard = phase === GamePhase.AUCTION_START && me.id === currentAuctioneerId;

    const handleCardClick = (card: PaintingCard) => {
        if (canIPlayCard) {
            startAuction(card);
        } else {
            console.log("Cannot play card now.");
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 space-y-4">
            {phase === GamePhase.SCORING && <EndRoundSummary gameState={gameState} myPlayerId={myPlayerId} />}
            {phase === GamePhase.GAME_OVER && <EndRoundSummary gameState={gameState} myPlayerId={myPlayerId} />}
            {auctionState && phase === GamePhase.AUCTION_BIDDING && <AuctionView gameState={gameState} myPlayerId={myPlayerId} />}

            <header className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <h1 className="text-3xl font-black">MODERN ART</h1>
                <div className="text-right">
                    <p className="font-bold text-xl">Round {round} / 4</p>
                    <p className="text-sm text-gray-400">{phase.replace(/_/g, ' ')}</p>
                </div>
            </header>

            <main className="flex-grow flex space-x-4 h-[calc(100vh-250px)]">
                <div className="w-1/4 flex flex-col space-y-4">
                    {players.map(p => (
                        <PlayerView 
                            key={p.id} 
                            player={p} 
                            isCurrentAuctioneer={p.id === currentAuctioneerId} 
                            isCurrentPlayer={p.id === currentPlayerId}
                        />
                    ))}
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex-grow overflow-hidden">
                        <h4 className="font-bold mb-2 text-yellow-400">Action Log</h4>
                        <div className="space-y-1 text-xs text-gray-300 h-full overflow-y-auto pr-2">
                           {actionLog.map((log, i) => <p key={i} className="leading-snug">{log}</p>)}
                        </div>
                    </div>
                </div>
                <div className="w-3/4">
                    <GameBoard gameState={gameState} />
                </div>
            </main>

            <footer className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-lg mb-2">Your Hand ({me.name})</h3>
                {me.hand.length > 0 ? (
                     <div className="flex space-x-3 overflow-x-auto pb-2">
                        {me.hand.map(card => (
                            <div key={card.id} onClick={() => handleCardClick(card)} className={`transition-transform duration-200 ${canIPlayCard ? 'cursor-pointer hover:-translate-y-2' : 'opacity-50 cursor-not-allowed'}`}>
                                <Card card={card} />
                            </div>
                        ))}
                    </div>
                ): (
                    <p className="text-gray-500 italic">You have no cards to auction.</p>
                )}
            </footer>
        </div>
    );
};

export default Game;
