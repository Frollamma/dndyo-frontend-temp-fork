import React, { createContext, useContext, useState, useEffect } from 'react';
import { createGame, getGameState } from '../services/api';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [gameId, setGameId] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initializeGame() {
            try {
                // For hackathon, just create a new game every time we reload
                const game = await createGame("Forge & Fable");
                setGameId(game.id);

                // Fetch initial state
                const state = await getGameState(game.id);
                setGameState(state);
            } catch (error) {
                console.error("Failed to initialize game:", error);
            } finally {
                setIsLoading(false);
            }
        }
        initializeGame();
    }, []);

    const fetchState = async () => {
        if (!gameId) return;
        const state = await getGameState(gameId);
        setGameState(state);
    };

    return (
        <GameContext.Provider value={{ gameId, gameState, fetchState, isLoading }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
