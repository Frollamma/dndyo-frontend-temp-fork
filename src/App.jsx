import React from "react";
import CharacterSheet from "./components/CharacterSheet";
import MainStage from "./components/MainStage";
import DMConsole from "./components/DMConsole";
import GameLauncher from "./components/GameLauncher";
import PlayerCreator from "./components/PlayerCreator";
import { GameProvider, useGame } from "./contexts/GameContext";

function MainApp() {
  const { isLoading, gameId } = useGame();

  if (!gameId) {
    if (isLoading) {
      return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500 font-serif-dm">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl tracking-widest uppercase glow-gold-text">Forging the world...</h2>
        </div>
      );
    }
    return <GameLauncher />;
  }

  return (
    <>
      <div className="h-screen w-screen overflow-hidden grid grid-cols-[1fr_3fr_1fr] bg-slate-950">
        <CharacterSheet />
        <MainStage />
        <DMConsole />
      </div>
      <PlayerCreator />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
