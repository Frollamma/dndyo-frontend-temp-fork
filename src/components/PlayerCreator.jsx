import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

const initialForm = {
  name: 'New Hero',
  level: '1',
  armor_class: '12',
  hit_points: '10',
  speed: '30',
  strength: '10',
  dexterity: '10',
  constitution: '10',
  intelligence: '10',
  wisdom: '10',
  charisma: '10',
  proficiency_bonus: '2',
  size: 'Medium',
  alignment: 'Neutral',
  image_id: '0',
  ability_name: 'Strike',
  ability_description: 'A steady melee attack',
  ability_type: 'attack',
  controlled_by_user: true,
  can_fight: true,
};

export default function PlayerCreator() {
  const {
    gameId,
    createPlayer,
    isCreatingPlayer,
    playerError,
    playerActor,
  } = useGame();

  if (!gameId || playerActor) return null;

  const [form, setForm] = useState(initialForm);

  const handleChange = (key) => (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      level: Number(form.level) || 1,
      armor_class: Number(form.armor_class) || 10,
      hit_points: Number(form.hit_points) || 1,
      speed: Number(form.speed) || 30,
      strength: Number(form.strength) || 10,
      dexterity: Number(form.dexterity) || 10,
      constitution: Number(form.constitution) || 10,
      intelligence: Number(form.intelligence) || 10,
      wisdom: Number(form.wisdom) || 10,
      charisma: Number(form.charisma) || 10,
      proficiency_bonus: Number(form.proficiency_bonus) || 2,
      size: form.size || 'Medium',
      alignment: form.alignment || 'Neutral',
      controlled_by_user: form.controlled_by_user,
      can_fight: form.can_fight,
      image_id: Number(form.image_id) || 0,
      abilities: [
        {
          name: form.ability_name || 'Strike',
          description: form.ability_description || 'A solid melee attack.',
          ability_type: form.ability_type || 'attack',
        },
      ],
    };

    await createPlayer(payload);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl border border-amber-500/30 bg-slate-900/80 p-8 shadow-[0_0_50px_rgba(250,204,21,0.25)] backdrop-blur">
        <header className="mb-6 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Character Workshop</p>
          <h1 className="text-3xl font-serif-dm font-semibold text-white">Create your player</h1>
          <p className="text-sm text-slate-300">
            Every adventurer starts with a name and stats. Fill out the basics and send it to the table.
          </p>
        </header>

        {playerError && (
          <div className="mb-4 rounded border border-rose-500/70 bg-rose-500/10 p-3 text-sm text-rose-200">
            {playerError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Name</span>
              <input
                value={form.name}
                onChange={handleChange('name')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Level</span>
              <input
                type="number"
                min="1"
                value={form.level}
                onChange={handleChange('level')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {['armor_class', 'hit_points', 'speed'].map((field) => (
              <label key={field} className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-300">
                  {field.replace('_', ' ')}
                </span>
                <input
                  type="number"
                  min="0"
                  value={form[field]}
                  onChange={handleChange(field)}
                  className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  disabled={isCreatingPlayer}
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {['strength', 'dexterity', 'constitution'].map((field) => (
              <label key={field} className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-300">{field}</span>
                <input
                  type="number"
                  min="1"
                  value={form[field]}
                  onChange={handleChange(field)}
                  className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  disabled={isCreatingPlayer}
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {['intelligence', 'wisdom', 'charisma'].map((field) => (
              <label key={field} className="flex flex-col text-sm text-slate-200">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-300">{field}</span>
                <input
                  type="number"
                  min="1"
                  value={form[field]}
                  onChange={handleChange(field)}
                  className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                  disabled={isCreatingPlayer}
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Proficiency bonus</span>
              <input
                type="number"
                min="1"
                value={form.proficiency_bonus}
                onChange={handleChange('proficiency_bonus')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Size</span>
              <input
                value={form.size}
                onChange={handleChange('size')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Alignment</span>
              <input
                value={form.alignment}
                onChange={handleChange('alignment')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.controlled_by_user}
                onChange={handleChange('controlled_by_user')}
                disabled={isCreatingPlayer}
              />
              Controlled by player
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.can_fight}
                onChange={handleChange('can_fight')}
                disabled={isCreatingPlayer}
              />
              Can fight
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Avatar (image ID)</span>
              <input
                type="number"
                min="0"
                value={form.image_id}
                onChange={handleChange('image_id')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Ability type</span>
              <select
                value={form.ability_type}
                onChange={handleChange('ability_type')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              >
                <option value="attack">Attack</option>
                <option value="utility">Utility</option>
                <option value="support">Support</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Ability name</span>
              <input
                value={form.ability_name}
                onChange={handleChange('ability_name')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
            <label className="flex flex-col text-sm text-slate-200">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-300">Ability description</span>
              <textarea
                rows={2}
                value={form.ability_description}
                onChange={handleChange('ability_description')}
                className="mt-2 rounded bg-slate-900 px-3 py-2 text-base text-white focus:outline-2 focus:outline-amber-500"
                disabled={isCreatingPlayer}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isCreatingPlayer}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-base font-semibold uppercase tracking-widest text-slate-950 transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {isCreatingPlayer ? 'Saving your hero…' : 'Create player'}
          </button>
        </form>
      </div>
    </div>
  );
}
