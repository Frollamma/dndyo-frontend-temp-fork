import React, { createContext, useContext, useState } from 'react';
import { createGame as createGameApi, getGameState } from '../services/api';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    console.error('GameContext error:', err);
    setError(err?.message || 'Something went wrong');
  };

  const loadGameState = async (id) => {
    const state = await getGameState(id);
    setGameState(state);
  };

  const createGame = async (config) => {
    setIsLoading(true);
    setError(null);
    try {
      const game = await createGameApi(config);
      setGameId(game.id);
      await loadGameState(game.id);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await loadGameState(id);
      setGameId(id);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchState = async () => {
    if (!gameId) return;
    const state = await getGameState(gameId);
    setGameState(state);
  };

  return (
    <GameContext.Provider
      value={{
        gameId,
        gameState,
        fetchState,
        isLoading,
        error,
        createGame,
        joinGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
