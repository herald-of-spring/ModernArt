
import React, { useState } from 'react';
import { generateRoomCode } from '../constants';

interface LobbyProps {
    onCreateRoom: (playerName: string) => void;
    onJoinRoom: (playerName: string, roomCode: string) => void;
    error?: string;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateRoom, onJoinRoom, error }) => {
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    const handleCreate = () => {
        onCreateRoom(playerName);
    };

    const handleJoin = () => {
        onJoinRoom(playerName, roomCode);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-5xl font-black text-center mb-2">MODERN ART</h1>
                <h2 className="text-xl text-center text-gray-400 mb-8">AI Multiplayer Edition</h2>

                {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}

                <div className="space-y-4 mb-8">
                    <div>
                        <label htmlFor="player-name" className="block text-sm font-bold text-gray-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="player-name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>
                     <div>
                        <label htmlFor="room-code" className="block text-sm font-bold text-gray-300 mb-2">
                            Room Code (to join)
                        </label>
                        <input
                            type="text"
                            id="room-code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            placeholder="Enter 4-letter code"
                            maxLength={4}
                        />
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleJoin}
                        disabled={!playerName || !roomCode || roomCode.length !== 4}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-lg uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Join Room
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!playerName}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Create Room
                    </button>
                </div>
            </div>
             <p className="text-center text-gray-500 mt-8">A game by Reiner Knizia</p>
        </div>
    );
};

export default Lobby;
