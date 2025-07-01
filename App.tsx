
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, GamePhase, Player, PaintingCard, Artist, AuctionType, AuctionState } from './types';
import { INITIAL_DECK, DEAL_RULES, ARTISTS_ORDER, ROUND_VALUE_BONUS, ROUND_END_PAINTING_COUNT } from './constants';
import { multiplayerService } from './services/multiplayerService';
import { generateArtDescription } from './services/geminiService';
import { GameActionsContext, GameActions } from './contexts/GameActionsContext';
import Lobby from './components/Lobby';
import SetupScreen from './components/SetupScreen';
import Game from './components/Game';

const App: React.FC = () => {
    const [session, setSession] = useState<{ roomCode: string | null; playerId: string | null; error?: string }>({ roomCode: null, playerId: null });
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        if (!session.roomCode) return;

        const unsubscribe = multiplayerService.subscribe(session.roomCode, (newState) => {
            setGameState(newState);
        });

        // Initial fetch
        multiplayerService.getGameState(session.roomCode).then(setGameState);

        return unsubscribe;
    }, [session.roomCode]);

    const logAction = useCallback(async (message: string, state: GameState): Promise<GameState> => {
        const newState = { ...state, actionLog: [message, ...state.actionLog].slice(0, 20) };
        return newState;
    }, []);

    const actions: GameActions = useMemo(() => {
        
        const performStateUpdate = async (updater: (currentState: GameState) => Promise<GameState> | GameState) => {
            if (!session.roomCode) throw new Error("Not in a room.");
            const current = await multiplayerService.getGameState(session.roomCode);
            if (!current) throw new Error("Game state not found.");
            const next = await updater(current);
            await multiplayerService.updateGameState(session.roomCode, next);
        };

        return {
            startGame: async () => {
                await performStateUpdate(state => {
                    const players = state.players.sort(() => Math.random() - 0.5);
                    let deck = [...INITIAL_DECK].sort(() => Math.random() - 0.5);
                    const cardsToDeal = DEAL_RULES[players.length].rounds[0];
                    
                    players.forEach(player => {
                        player.hand = deck.splice(0, cardsToDeal);
                    });

                    const turnOrder = players.map(p => p.id);
                    const currentAuctioneerId = turnOrder[0];

                    return {
                        ...state,
                        players,
                        deck,
                        turnOrder,
                        currentAuctioneerId,
                        currentPlayerId: currentAuctioneerId,
                        phase: GamePhase.AUCTION_START,
                        actionLog: [`Game started with ${players.length} players. Round 1 begins.`, `It's ${players.find(p => p.id === currentAuctioneerId)!.name}'s turn to auction.`, ...state.actionLog],
                    };
                });
            },
            startAuction: async (card: PaintingCard) => {
                let description = '';
                await performStateUpdate(async state => {
                    const auctioneer = state.players.find(p => p.id === state.currentAuctioneerId)!;
                    const newHand = auctioneer.hand.filter(c => c.id !== card.id);
                    const newPlayers = state.players.map(p => p.id === auctioneer.id ? { ...p, hand: newHand } : p);

                    const auctionState: AuctionState = {
                        cards: [card],
                        auctioneerId: auctioneer.id,
                        type: card.auctionType,
                        highBid: 0,
                        highBidderId: null,
                        bids: state.players.map(p => ({ playerId: p.id, amount: 0, passed: false })),
                        isLoadingDescription: true,
                    };
                    
                    const logMsg = `${auctioneer.name} puts "${card.id}" by ${card.artist} up for auction.`;
                    const newState = { ...state, players: newPlayers, phase: GamePhase.AUCTION_BIDDING, auctionState };
                    
                    return await logAction(logMsg, newState);
                });
                
                description = await generateArtDescription(card.artist, card.id);

                await performStateUpdate(state => {
                    if (!state.auctionState) return state;
                    return { ...state, auctionState: { ...state.auctionState, aiDescription: description, isLoadingDescription: false } };
                });
            },
            resolveAuction: async () => {
                 await performStateUpdate(async state => {
                    if (!state.auctionState) return state;
                    const { cards, auctioneerId, highBid, highBidderId } = state.auctionState;
                    const winnerId = highBidderId || auctioneerId; // If no bids, auctioneer wins for free
                    const price = highBidderId ? highBid : 0;
                    
                    const winner = state.players.find(p => p.id === winnerId)!;
                    const auctioneer = state.players.find(p => p.id === auctioneerId)!;

                    let logMsg = '';
                    let winnerNewMoney = winner.money;
                    let auctioneerNewMoney = auctioneer.money;

                    if (winnerId === auctioneerId) {
                        winnerNewMoney -= price;
                        logMsg = `${winner.name} wins the auction for ${price}k, paying the bank.`;
                    } else {
                        winnerNewMoney -= price;
                        auctioneerNewMoney += price;
                        logMsg = `${winner.name} wins the auction, paying ${price}k to ${auctioneer.name}.`;
                    }
                    
                    const newPlayers = state.players.map(p => {
                        if (p.id === winnerId) return { ...p, money: winnerNewMoney, purchasedPaintings: [...p.purchasedPaintings, ...cards] };
                        if (p.id === auctioneerId && p.id !== winnerId) return { ...p, money: auctioneerNewMoney };
                        return p;
                    });

                    let newState = await logAction(logMsg, { ...state, players: newPlayers });
                    const newPlayedCards = [...newState.playedCardsThisRound, ...cards.map(card => ({ artist: card.artist, card }))];
                    newState.playedCardsThisRound = newPlayedCards;
                    
                    const artistCounts = newPlayedCards.reduce((acc, { artist }) => {
                        acc[artist] = (acc[artist] || 0) + 1;
                        return acc;
                    }, {} as Record<Artist, number>);

                    const roundEndingArtist = Object.entries(artistCounts).find(([, count]) => count >= ROUND_END_PAINTING_COUNT);

                    if (roundEndingArtist) {
                        newState = await logAction(`The 5th painting by ${roundEndingArtist[0]} has been played! The round ends.`, newState);
                        newState.phase = GamePhase.SCORING;
                        return newState;
                    }

                    const lastAuctioneerIndex = newState.turnOrder.indexOf(newState.currentAuctioneerId);
                    const nextAuctioneerIndex = (lastAuctioneerIndex + 1) % newState.turnOrder.length;
                    const nextAuctioneerId = newState.turnOrder[nextAuctioneerIndex];
                    const nextAuctioneer = newState.players.find(p => p.id === nextAuctioneerId)!;

                    newState = await logAction(`Play passes to ${nextAuctioneer.name}.`, newState);
                    newState.phase = GamePhase.AUCTION_START;
                    newState.auctionState = null;
                    newState.currentAuctioneerId = nextAuctioneerId;
                    newState.currentPlayerId = nextAuctioneerId;
                    return newState;
                });
            },
            startNextRound: async () => {
                await performStateUpdate(async state => {
                    let s = state;
                    const artistCounts = s.playedCardsThisRound.reduce((acc, { artist }) => {
                        acc[artist] = (acc[artist] || 0) + 1;
                        return acc;
                    }, {} as Record<Artist, number>);

                    const rankedArtists = [...ARTISTS_ORDER]
                        .filter(artist => artistCounts[artist] > 0)
                        .sort((a, b) => (artistCounts[b] || 0) - (artistCounts[a] || 0) || ARTISTS_ORDER.indexOf(a) - ARTISTS_ORDER.indexOf(b));
                    
                    s = await logAction(`End of Round ${s.round} Rankings: 1st: ${rankedArtists[0] || 'N/A'}, 2nd: ${rankedArtists[1] || 'N/A'}, 3rd: ${rankedArtists[2] || 'N/A'}`, s);

                    const newArtistValues = JSON.parse(JSON.stringify(s.artistValues));
                    rankedArtists.slice(0, 3).forEach((artist, index) => {
                        newArtistValues[artist][s.round - 1] = ROUND_VALUE_BONUS[index];
                    });
                    
                    let playersWithNewMoney = [...s.players];
                    for (const player of playersWithNewMoney) {
                        let earnings = 0;
                        for (const painting of player.purchasedPaintings) {
                            const artistRankIndex = rankedArtists.indexOf(painting.artist);
                            if (artistRankIndex !== -1 && artistRankIndex < 3) {
                                const value = newArtistValues[painting.artist].reduce((sum: number, val: number | null) => sum + (val || 0), 0);
                                earnings += value;
                                s = await logAction(`${player.name} sells a ${painting.artist} painting for ${value}k.`, s);
                            } else {
                                s = await logAction(`${player.name}'s ${painting.artist} painting is worthless this round.`, s);
                            }
                        }
                        player.money += earnings;
                        player.purchasedPaintings = [];
                    }
                    s.players = playersWithNewMoney;
                    s.artistValues = newArtistValues;

                    if (s.round === 4) {
                         s = await logAction("Game Over! Final scores revealed.", s);
                         s.phase = GamePhase.GAME_OVER;
                         return s;
                    }
                    
                    const nextRound = s.round + 1;
                    let deck = s.deck;
                    const cardsToDeal = DEAL_RULES[s.players.length].rounds[nextRound - 1];
                    if (cardsToDeal > 0) {
                        s.players.forEach((player) => {
                            player.hand.push(...deck.splice(0, cardsToDeal));
                        });
                    }

                    s = await logAction(`Round ${nextRound} begins.`, s);

                    return { ...s, round: nextRound, phase: GamePhase.AUCTION_START, deck, playedCardsThisRound: [] };
                });
            },
            // Stubs for other actions
            addSecondDoubleCard: async (card) => console.log('Action not implemented'),
            passOnDouble: async () => console.log('Action not implemented'),
            setFixedPrice: async (price) => console.log('Action not implemented'),
            acceptFixedPrice: async () => console.log('Action not implemented'),
            passFixedPrice: async () => console.log('Action not implemented'),
            placeBid: async (amount) => {
                 await performStateUpdate(async state => {
                    if (!state.auctionState) return state;
                    const bidder = state.players.find(p => p.id === session.playerId!)!;
                    let s = await logAction(`${bidder.name} bids ${amount}k.`, state);
                    s.auctionState!.highBid = amount;
                    s.auctionState!.highBidderId = bidder.id;
                    
                    // Simple logic for Open auction, needs more for others
                    const currentIndex = s.turnOrder.indexOf(s.currentPlayerId);
                    s.currentPlayerId = s.turnOrder[(currentIndex + 1) % s.turnOrder.length];
                    
                    return s;
                });
            },
            passBid: async () => console.log('Action not implemented'),
            placeHiddenBid: async (amount) => console.log('Action not implemented'),
            revealHiddenBids: async () => console.log('Action not implemented'),
        };
    }, [session.roomCode, session.playerId, logAction]);
    
    const handleCreateRoom = async (playerName: string) => {
        if (!playerName.trim()) {
            setSession({ ...session, error: "Please enter a name." });
            return;
        }
        const { roomCode, playerId } = await multiplayerService.createRoom(playerName);
        setSession({ roomCode, playerId });
    };

    const handleJoinRoom = async (playerName: string, roomCode: string) => {
        if (!playerName.trim() || !roomCode.trim()) {
            setSession({ ...session, error: "Please enter a name and room code." });
            return;
        }
        try {
            const { gameState, playerId } = await multiplayerService.joinRoom(roomCode, playerName);
            if (!gameState) {
                setSession({ ...session, error: `Room ${roomCode} not found.`});
            } else {
                setSession({ roomCode, playerId });
            }
        } catch(e: any) {
             setSession({ ...session, error: e.message });
        }
    };

    if (!session.roomCode || !session.playerId) {
        return <Lobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={session.error} />;
    }

    if (!gameState) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p className="text-xl animate-pulse">Loading Game...</p></div>;
    }

    return (
        <GameActionsContext.Provider value={actions}>
            {gameState.phase === GamePhase.SETUP && <SetupScreen gameState={gameState} myPlayerId={session.playerId} />}
            {gameState.phase !== GamePhase.SETUP && <Game gameState={gameState} myPlayerId={session.playerId} />}
        </GameActionsContext.Provider>
    );
};

export default App;
