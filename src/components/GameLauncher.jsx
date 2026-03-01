import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";

const defaults = {
  name: "Ashfall Keep",
  owner: "DeepKing",
  aiPrompt:
    "You are the Dungeon Master of a Dungeons & Dragons game. Lead the game, narrate scenes, control pacing, and guide players through decisions and outcomes. Dont take decisions or actions for them; react to what they do. Be concise but creative, answer in human tone, make the atmosphere interesting. You can access tools to inspect and update game state; use those tools when needed to keep the game state accurate.",
  environment: "Ash is drifting across Blackridge. The keep bells are silent.",
  chapters:
    "Chapter 1: Smoke Over Blackridge\nChapter 2: The Broken Gate\nChapter 3: Crown of Cinders",
  currentChapters: "Chapter 1: Smoke Over Blackridge",
};

const serializeList = (value = "") =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export default function GameLauncher() {
  const { createGame, joinGame, isLoading, error, gameId } = useGame();
  const [formData, setFormData] = useState(defaults);
  const [joinId, setJoinId] = useState("");

  const handleFormChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const payload = {
      name: formData.name,
      owner_user: formData.owner,
      ai_initial_prompt: formData.aiPrompt,
      initial_state: {
        environment_description: formData.environment,
        live_actors: [],
      },
    };

    const chapters = serializeList(formData.chapters);
    if (chapters.length) payload.chapters = chapters;

    const currentChapters = serializeList(formData.currentChapters);
    if (currentChapters.length) payload.current_chapters = currentChapters;

    await createGame(payload);
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    if (!joinId.trim()) return;
    await joinGame(joinId.trim());
  };

  const disabled = isLoading;

  return (
    /* FIX: Removed w-screen and items-center. 
      Using min-h-screen with items-start ensures that if the content is taller 
      than the screen, it starts at the top and scrolls naturally.
    */
    <div className="min-h-screen w-full bg-slate-950 text-amber-50 flex justify-center items-start overflow-y-auto py-12 px-4">
      {/* FIX: my-auto allows the content to center itself vertically IF there is extra space,
        but it won't push the top of the form off-screen if the form is tall.
      */}
      <div className="w-full max-w-5xl space-y-8 my-auto">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-400">
            Adventure Lobby
          </p>
          <h1 className="text-4xl font-serif-dm tracking-tight text-white">
            Create or join a campaign
          </h1>
          <p className="text-base text-slate-300">
            Start fresh with your own narrative or tap into an existing table.
          </p>
        </div>

        {error && !isLoading && !gameId && (
          <div className="rounded border border-rose-500/60 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* CREATE SECTION */}
          <section className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 shadow-[0_0_60px_rgba(250,204,21,0.08)]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                New Game
              </h2>
              <span className="text-sm text-amber-300 font-serif-dm italic">
                World Building
              </span>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col text-sm text-slate-200">
                  <span className="text-xs uppercase tracking-widest text-amber-300">
                    Game Name
                  </span>
                  <input
                    className="mt-2 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    value={formData.name}
                    onChange={handleFormChange("name")}
                    disabled={disabled}
                  />
                </label>
                <label className="flex flex-col text-sm text-slate-200">
                  <span className="text-xs uppercase tracking-widest text-amber-300">
                    Owner
                  </span>
                  <input
                    className="mt-2 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    value={formData.owner}
                    onChange={handleFormChange("owner")}
                    disabled={disabled}
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  AI DM prompt
                </span>
                <textarea
                  rows={3}
                  className="mt-2 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  value={formData.aiPrompt}
                  onChange={handleFormChange("aiPrompt")}
                  disabled={disabled}
                />
              </label>

              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  Environment
                </span>
                <textarea
                  rows={2}
                  className="mt-2 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  value={formData.environment}
                  onChange={handleFormChange("environment")}
                  disabled={disabled}
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col text-sm text-slate-200">
                  <span className="text-xs uppercase tracking-widest text-amber-300">
                    Chapters
                  </span>
                  <textarea
                    rows={3}
                    className="mt-2 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    value={formData.chapters}
                    onChange={handleFormChange("chapters")}
                    disabled={disabled}
                  />
                </label>
                <label className="flex flex-col text-sm text-slate-200">
                  <span className="text-xs uppercase tracking-widest text-amber-300">
                    Current Progress
                  </span>
                  <textarea
                    rows={3}
                    className="mt-2 rounded bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    value={formData.currentChapters}
                    onChange={handleFormChange("currentChapters")}
                    disabled={disabled}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 py-3 mt-4 text-base font-bold uppercase tracking-widest text-slate-950 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? "Preparing adventure…" : "Create game"}
              </button>
            </form>
          </section>

          {/* JOIN SECTION */}
          {/* Added lg:sticky so it stays visible while scrolling the long form next to it */}
          <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-[0_0_60px_rgba(56,189,248,0.08)] lg:sticky lg:top-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Join a game
              </h2>
              <span className="text-sm text-sky-300 font-serif-dm italic">
                Existing World
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Enter the Game ID provided by your DM.
            </p>
            <form className="mt-6 space-y-3" onSubmit={handleJoin}>
              <input
                placeholder="Paste Game ID..."
                className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-3 text-lg text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                value={joinId}
                onChange={(event) => setJoinId(event.target.value)}
                disabled={disabled}
              />
              <button
                type="submit"
                disabled={disabled || !joinId.trim()}
                className="w-full rounded-full border border-sky-500/60 bg-slate-900/70 py-3 text-base font-semibold tracking-widest text-sky-200 transition hover:bg-sky-500/10 hover:text-white disabled:opacity-50"
              >
                {isLoading ? "Resolving game…" : "Join game"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
