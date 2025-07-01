
import React from 'react';
import { GameState, Artist } from '../types';
import { ARTISTS_ORDER, ARTIST_COLORS } from '../constants';
import { useGameActions } from '../contexts/GameActionsContext';

interface EndRoundSummaryProps {
    gameState: GameState;
    myPlayerId: string;
}

const EndRoundSummary: React.FC<EndRoundSummaryProps> = ({ gameState, myPlayerId }) => {
    const { startNextRound } = useGameActions();
    const { round, artistValues, players, hostId } = gameState;
    const isGameOver = round === 4 && gameState.phase === 'GAME_OVER';
    const isHost = myPlayerId === hostId;

    const getArtistTotalValue = (artist: Artist) => {
        return artistValues[artist].reduce((sum: number, val) => sum + (val || 0), 0);
    }

    const sortedPlayers = [...players].sort((a, b) => b.money - a.money);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-yellow-500 p-8 text-center">
                <h1 className="text-4xl font-black uppercase tracking-wider mb-2">
                    {isGameOver ? "Final Results" : `End of Round ${round}`}
                </h1>
                <p className="text-gray-400 mb-6">{isGameOver ? "The auctions are over. Here's who came out on top!" : "Paintings have been sold. Here are the results."}</p>

                <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                    <h2 className="font-bold text-xl mb-4 text-yellow-400">Artist Valuations</h2>
                    <div className="grid grid-cols-5 gap-4 text-center">
                        {ARTISTS_ORDER.map(artist => (
                            <div key={artist}>
                                <div className={`w-12 h-12 ${ARTIST_COLORS[artist]} mx-auto rounded-full mb-2 border-2 border-gray-600`}></div>
                                <p className="text-xs font-semibold truncate">{artist}</p>
                                <p className="font-bold text-lg">{getArtistTotalValue(artist)}k</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg mb-8">
                    <h2 className="font-bold text-xl mb-4 text-yellow-400">Player Standings</h2>
                    <div className="space-y-2">
                        {sortedPlayers.map((player, index) => (
                             <div key={player.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className={`font-bold text-lg w-6 text-center ${index === 0 ? 'text-yellow-400' : ''}`}>{index + 1}</span>
                                    <span className="font-semibold">{player.name}</span>
                                </div>
                                <span className="font-bold text-lg text-green-400">{player.money}k</span>
                            </div>
                        ))}
                    </div>
                </div>

                {isHost && !isGameOver && (
                    <button
                        onClick={startNextRound}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-4 rounded-lg text-lg uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all"
                    >
                        {`Start Round ${round + 1}`}
                    </button>
                )}
                 {!isHost && !isGameOver && (
                    <p className="text-yellow-400 font-bold text-lg animate-pulse">Waiting for the host to start the next round...</p>
                 )}
                 {isGameOver && (
                     <p className="text-green-400 font-bold text-lg">Congratulations to the winner!</p>
                 )}
            </div>
        </div>
    );
};

export default EndRoundSummary;
