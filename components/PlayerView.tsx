
import React from 'react';
import { Player, PaintingCard, GameState } from '../types';
import { MoneyIcon, GavelIcon } from './Icons';
import { AuctionTypeIcon } from './Icons';

interface PlayerViewProps {
    player: Player;
    isCurrentAuctioneer: boolean;
    isCurrentPlayer: boolean;
}

export const Card: React.FC<{ card: PaintingCard, small?: boolean }> = ({ card, small }) => (
    <div className={`bg-gray-800 rounded-md shadow-lg overflow-hidden border-2 border-gray-700 ${small ? 'w-16' : 'w-24'}`}>
        <img src={card.imageUrl} alt={card.id} className={`w-full ${small ? 'h-20' : 'h-32'} object-cover`} />
        <div className="p-1 bg-gray-900">
            <div className="flex justify-between items-center">
                <p className={`font-bold truncate ${small ? 'text-[10px]' : 'text-xs'}`}>{card.id.split('-').slice(0,2).join('-')}</p>
                <AuctionTypeIcon type={card.auctionType} className="w-3 h-3 text-gray-400" />
            </div>
        </div>
    </div>
);

const PlayerView: React.FC<PlayerViewProps> = ({ player, isCurrentAuctioneer, isCurrentPlayer }) => {
    return (
        <div className={`bg-gray-800/50 p-3 rounded-lg border-2 transition-all duration-300 ${isCurrentPlayer ? 'border-yellow-400 shadow-yellow-500/20 shadow-lg' : 'border-gray-700'}`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg truncate">{player.name}</h3>
                <div className="flex items-center space-x-3">
                    {isCurrentAuctioneer && <GavelIcon className="w-5 h-5 text-yellow-400" />}
                    <div className="flex items-center space-x-1 bg-green-900/50 text-green-300 px-2 py-1 rounded-md">
                        <MoneyIcon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{player.money}k</span>
                    </div>
                </div>
            </div>
            
            <div>
                <p className="text-xs text-gray-400 mb-1">Purchased Art:</p>
                {player.purchasedPaintings.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {player.purchasedPaintings.map(card => <Card key={card.id} card={card} small />)}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 italic">No art purchased this round.</p>
                )}
            </div>
        </div>
    );
};

export default PlayerView;
