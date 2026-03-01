import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createGame as createGameApi,
  createActor,
  getGameState,
} from "../services/api";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playerError, setPlayerError] = useState(null);
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false);
  const [playerActor, setPlayerActor] = useState(null);

  const playerId = useMemo(
    () => playerActor?.id ?? playerActor?.actor_id ?? null,
    [playerActor],
  );

  const handleError = (setter) => (err) => {
    console.error("GameContext error:", err);
    setter(err?.message || "Something went wrong");
  };

  const storageKey = (id) => `dndyo-player-${id}`;

  useEffect(() => {
    if (!gameId) {
      setPlayerActor(null);
      return;
    }
    if (typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem(storageKey(gameId));
      if (saved) {
        setPlayerActor(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [gameId]);

  useEffect(() => {
    if (!gameId || !playerActor || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey(gameId),
        JSON.stringify(playerActor),
      );
    } catch {
      // ignore
    }
  }, [gameId, playerActor]);

  const loadGameState = async (id) => {
    const state = await getGameState(id);
    setGameState(state);
    const player = state?.live_actors?.find((actor) => actor.role === "Player");
    if (player) {
      setPlayerActor(player);
    }
    return state;
  };

  const createGame = async (config) => {
    setIsLoading(true);
    setError(null);
    try {
      const game = await createGameApi(config);
      setGameId(game.id);
      await loadGameState(game.id);
    } catch (err) {
      handleError(setError)(err);
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
      handleError(setError)(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlayer = async (actorPayload) => {
    if (!gameId) {
      setPlayerError("Game not ready yet");
      return;
    }
    setIsCreatingPlayer(true);
    setPlayerError(null);
    try {
      const created = await createActor(gameId, actorPayload);
      setPlayerActor(created);
      await loadGameState(gameId);
    } catch (err) {
      handleError(setPlayerError)(err);
    } finally {
      setIsCreatingPlayer(false);
    }
  };

  const fetchState = async () => {
    if (!gameId) return;
    await loadGameState(gameId);
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
        createPlayer,
        isCreatingPlayer,
        playerError,
        playerActor,
        playerId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
