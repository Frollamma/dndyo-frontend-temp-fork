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
  const { createGame, joinGame, isLoading, error } = useGame();
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
    <div className="min-h-screen w-screen bg-slate-950 text-amber-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-400">
            Adventure Lobby
          </p>
          <h1 className="text-4xl font-serif-dm tracking-tight text-white">
            Create or join a campaign
          </h1>
          <p className="text-base text-slate-300">
            Start fresh with your own narrative or tap into an existing table
            using its game ID.
          </p>
        </div>

        {error && !isLoading && (
          <div className="rounded border border-rose-500/60 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 shadow-[0_0_60px_rgba(250,204,21,0.08)]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                Create a new game
              </h2>
              <span className="text-sm text-amber-300">Fresh world</span>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  Game name
                </span>
                <input
                  className="mt-2 rounded bg-slate-800 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
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
                  className="mt-2 rounded bg-slate-800 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  value={formData.owner}
                  onChange={handleFormChange("owner")}
                  disabled={disabled}
                />
              </label>
              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  AI DM prompt
                </span>
                <textarea
                  rows={3}
                  className="mt-2 rounded bg-slate-800 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  value={formData.aiPrompt}
                  onChange={handleFormChange("aiPrompt")}
                  disabled={disabled}
                />
              </label>
              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  Environment description
                </span>
                <textarea
                  rows={2}
                  className="mt-2 rounded bg-slate-800 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  value={formData.environment}
                  onChange={handleFormChange("environment")}
                  disabled={disabled}
                />
              </label>
              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  Chapters (one per line)
                </span>
                <textarea
                  rows={3}
                  className="mt-2 rounded bg-slate-800 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  value={formData.chapters}
                  onChange={handleFormChange("chapters")}
                  disabled={disabled}
                />
              </label>
              <label className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  Current chapters (optional)
                </span>
                <textarea
                  rows={2}
                  className="mt-2 rounded bg-slate-800 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  value={formData.currentChapters}
                  onChange={handleFormChange("currentChapters")}
                  disabled={disabled}
                />
              </label>
              <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-base font-semibold uppercase tracking-widest text-slate-950 transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? "Preparing adventure…" : "Create game"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-[0_0_60px_rgba(56,189,248,0.08)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Join a game
              </h2>
              <span className="text-sm text-sky-300">Use a game ID</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Paste a game ID provided by another player or the DM and dive in.
            </p>
            <form className="mt-6 space-y-3" onSubmit={handleJoin}>
              <input
                placeholder="Game ID"
                className="w-full rounded bg-slate-800 px-3 py-3 text-lg text-white placeholder:text-slate-500 focus:outline-2 focus:outline-sky-500"
                value={joinId}
                onChange={(event) => setJoinId(event.target.value)}
                disabled={disabled}
              />
              <button
                type="submit"
                disabled={disabled || !joinId.trim()}
                className="w-full rounded-full border border-sky-500/60 bg-slate-900/70 py-3 text-base font-semibold tracking-widest text-sky-200 transition hover:border-sky-400 hover:text-white disabled:cursor-wait disabled:opacity-60"
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
