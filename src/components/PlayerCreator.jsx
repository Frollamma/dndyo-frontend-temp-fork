import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";

// Helper to generate a random stat (standard 3d6 or 1d10+7 range)
const rollStat = (min = 8, max = 18) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const initialForm = {
  name: "Gandalf",
  size: "Medium",
  alignment: "Neutral",
  concept: "A mysterious wanderer", // Used for the "Ability Description"
};

export default function PlayerCreator() {
  const { gameId, createPlayer, isCreatingPlayer, playerError, playerActor } =
    useGame();
  const [form, setForm] = useState(initialForm);

  if (!gameId || playerActor) return null;

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Generate random values on submission
    const payload = {
      name: form.name || "Nameless Hero",
      level: 1,
      armor_class: rollStat(10, 15),
      hit_points: rollStat(10, 20),
      speed: 30,
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat(),
      proficiency_bonus: 2,
      size: form.size,
      alignment: form.alignment,
      controlled_by_user: true,
      can_fight: true,
      image_id: Math.floor(Math.random() * 10), // Random avatar
      abilities: [
        {
          name: "Signature Move",
          description: form.concept,
          ability_type: "attack",
        },
      ],
    };

    await createPlayer(payload);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900/80 p-8 shadow-[0_0_50px_rgba(250,204,21,0.25)] backdrop-blur">
        <header className="mb-8 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">
            Quick Start
          </p>
          <h1 className="text-3xl font-serif-dm font-semibold text-white">
            Forge Your Hero
          </h1>
          <p className="text-sm text-slate-400">
            Tell us who you are. We'll roll the dice for your stats.
          </p>
        </header>

        {playerError && (
          <div className="mb-4 rounded border border-rose-500/70 bg-rose-500/10 p-3 text-sm text-rose-200">
            {playerError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-amber-300">
              Character Name
            </label>
            <input
              required
              placeholder="e.g. Valerius the Bold"
              value={form.name}
              onChange={handleChange("name")}
              className="rounded bg-slate-950 border border-slate-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
              disabled={isCreatingPlayer}
            />
          </div>

          {/* Character Concept / Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-amber-300">
              Your Concept
            </label>
            <textarea
              rows={3}
              placeholder="Describe your character's vibe or main ability..."
              value={form.concept}
              onChange={handleChange("concept")}
              className="rounded bg-slate-950 border border-slate-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
              disabled={isCreatingPlayer}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Size Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Size
              </label>
              <select
                value={form.size}
                onChange={handleChange("size")}
                className="rounded bg-slate-950 border border-slate-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                disabled={isCreatingPlayer}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            {/* Alignment Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Alignment
              </label>
              <select
                value={form.alignment}
                onChange={handleChange("alignment")}
                className="rounded bg-slate-950 border border-slate-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                disabled={isCreatingPlayer}
              >
                <option value="Lawful Good">Lawful Good</option>
                <option value="Neutral">Neutral</option>
                <option value="Chaotic Evil">Chaotic Evil</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreatingPlayer}
            className="w-full mt-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-4 text-sm font-bold uppercase tracking-widest text-slate-950 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isCreatingPlayer ? "Rolling Stats..." : "Generate Hero & Join"}
          </button>
        </form>
      </div>
    </div>
  );
}
