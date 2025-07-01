
import React, { useState } from 'react';
import { GameState, AuctionType } from '../types';
import { AuctionTypeIcon, GavelIcon } from './Icons';
import { useGameActions } from '../contexts/GameActionsContext';

interface AuctionViewProps {
    gameState: GameState;
    myPlayerId: string;
}

const Typewriter: React.FC<{text: string}> = ({text}) => {
    const [displayedText, setDisplayedText] = useState('');
    
    React.useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, 20);
        return () => clearInterval(intervalId);
    }, [text]);

    return <p className="text-gray-300 italic">{displayedText}</p>;
};

const AuctionView: React.FC<AuctionViewProps> = ({ gameState, myPlayerId }) => {
    const { auctionState, players, currentPlayerId } = gameState;
    const { placeBid, resolveAuction } = useGameActions();
    const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);

    if (!auctionState) return null;
    
    const { cards, type, highBid, highBidderId, auctioneerId, aiDescription, isLoadingDescription } = auctionState;
    const auctioneer = players.find(p => p.id === auctioneerId)!;
    const highBidder = players.find(p => p.id === highBidderId);
    const me = players.find(p => p.id === myPlayerId)!;
    const isMyTurn = myPlayerId === currentPlayerId;

    const handleBidSubmit = () => {
        if (bidAmount === undefined) return;
        if (bidAmount > me.money) {
            alert("You cannot bid more money than you have.");
            return;
        }
        if (bidAmount <= highBid) {
            alert("Your bid must be higher than the current high bid.");
            return;
        }
        placeBid(bidAmount);
        setBidAmount(undefined);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl border-2 border-gray-700 p-8 flex space-x-8">
                <div className="w-1/3 flex flex-col items-center justify-center space-y-4">
                    {cards.map(card => (
                         <div key={card.id} className="bg-gray-900 p-2 rounded-lg shadow-lg w-full">
                            <img src={card.imageUrl} alt={card.id} className="w-full h-auto rounded-md object-cover" />
                             <div className="p-2">
                                <p className="font-bold text-sm truncate">{card.id}</p>
                                <p className="text-xs text-gray-400">{card.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-wider">{type} Auction</h2>
                            <p className="text-gray-400">Auctioneer: {auctioneer.name}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-lg">
                           <AuctionTypeIcon type={type} className="w-6 h-6 text-yellow-400"/>
                           <span className="font-bold">{type}</span>
                        </div>
                    </div>

                     <div className="bg-gray-900/50 p-4 rounded-lg mb-4 min-h-[6rem]">
                        {isLoadingDescription && <p className="text-gray-400 italic animate-pulse">The critic is contemplating the piece...</p>}
                        {aiDescription && <Typewriter text={aiDescription} />}
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-400">Current High Bid:</p>
                        <p className="text-4xl font-bold text-yellow-400">{highBid}k</p>
                        <p className="text-sm text-gray-300">By: {highBidder?.name || 'No bids yet'}</p>
                    </div>

                    <div className="flex-grow" />
                    
                    <div className="space-y-4">
                        <p className="text-center font-bold text-lg">
                            {isMyTurn ? "It's your turn to act." : `Waiting for ${players.find(p=>p.id===currentPlayerId)?.name || '...'}`}
                        </p>
                        <div className="flex space-x-2">
                             <input 
                                type="number"
                                value={bidAmount || ''}
                                onChange={e => setBidAmount(Number(e.target.value))}
                                placeholder="Enter your bid"
                                disabled={!isMyTurn}
                                className="flex-grow bg-gray-600 border-2 border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                            />
                            <button onClick={handleBidSubmit} disabled={!isMyTurn || bidAmount === undefined} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Bid</button>
                        </div>
                       
                        <div className="flex space-x-2">
                             <button onClick={() => {}} disabled={!isMyTurn} className="flex-grow bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Pass</button>
                             {/* Resolve should be more complex, but for now, anyone can end it */}
                             <button onClick={resolveAuction} disabled={myPlayerId !== auctioneerId} className="flex-grow bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                <GavelIcon className="w-5 h-5"/>
                                <span>End Auction</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionView;
