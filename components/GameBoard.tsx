
import React from 'react';
import { GameState, Artist } from '../types';
import { ARTISTS_ORDER, ARTIST_COLORS } from '../constants';

interface GameBoardProps {
    gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
    const { playedCardsThisRound, artistValues, round } = gameState;

    const getArtistPlayedCount = (artist: Artist) => {
        return playedCardsThisRound.filter(c => c.artist === artist).length;
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl flex-grow">
            <div className="grid grid-cols-5 gap-4 h-full">
                {ARTISTS_ORDER.map(artist => (
                    <div key={artist} className="bg-gray-900/50 rounded-lg p-3 flex flex-col">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-8 h-8 rounded-full ${ARTIST_COLORS[artist]}`}></div>
                            <h2 className="font-bold text-sm flex-1">{artist}</h2>
                        </div>
                        <div className="flex-grow space-y-2">
                            {artistValues[artist].map((value, index) => (
                                <div
                                    key={index}
                                    className={`h-10 flex items-center justify-center rounded-md font-bold text-lg transition-all duration-300
                                    ${index === round - 1 ? 'border-2 border-yellow-400/50' : 'border-2 border-gray-700'}
                                    ${value !== null ? 'bg-green-500 text-white' : 'bg-gray-700/50 text-gray-500'}`}
                                >
                                    {value !== null ? `${value}k` : '?'}
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 bg-gray-800 rounded-md p-2 text-center">
                            <p className="text-xs text-gray-400">Played this Round</p>
                            <p className="text-2xl font-black">{getArtistPlayedCount(artist)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
