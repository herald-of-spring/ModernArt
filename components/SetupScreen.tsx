
import React from 'react';
import { GameState } from '../types';
import { useGameActions } from '../contexts/GameActionsContext';

interface SetupScreenProps {
    gameState: GameState;
    myPlayerId: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ gameState, myPlayerId }) => {
    const { startGame } = useGameActions();
    const { roomId, players, hostId } = gameState;
    const isHost = myPlayerId === hostId;
    const canStart = players.length >= 3 && players.length <= 5;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl text-center">
                <h1 className="text-4xl font-black text-center mb-2">WAITING ROOM</h1>
                <p className="text-gray-400 mb-6">Share the code below to invite others.</p>
                
                <div className="mb-8">
                    <label className="text-sm font-bold text-gray-300 mb-2 block">ROOM CODE</label>
                    <div className="bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg p-4 text-5xl font-extrabold tracking-widest text-yellow-400">
                        {roomId}
                    </div>
                </div>

                <div className="mb-8">
                     <h2 className="font-bold text-xl mb-4">Players Joined ({players.length}/5)</h2>
                     <div className="space-y-3">
                        {players.map(player => (
                             <div key={player.id} className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white text-left flex items-center justify-between">
                                <span className="font-semibold text-lg">{player.name}</span>
                                {player.id === hostId && <span className="text-xs font-bold bg-yellow-500 text-gray-900 px-2 py-1 rounded-full">HOST</span>}
                            </div>
                        ))}
                     </div>
                </div>

                {isHost ? (
                    <>
                        <button
                            onClick={startGame}
                            disabled={!canStart}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-4 rounded-lg text-lg uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Start Game
                        </button>
                        <p className="text-gray-500 mt-4 text-sm">
                            {canStart ? "Ready to start!" : "Waiting for 3 to 5 players to join."}
                        </p>
                    </>
                ) : (
                    <p className="text-yellow-400 font-bold text-lg animate-pulse">Waiting for the host to start the game...</p>
                )}
            </div>
        </div>
    );
};

export default SetupScreen;
