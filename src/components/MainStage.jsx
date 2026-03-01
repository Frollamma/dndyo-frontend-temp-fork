import React, { useState, useEffect, useRef } from "react";
import { Dice5, Skull, Target, Swords } from "lucide-react";
import { character } from "../data/mockData";
import { useGame } from "../contexts/GameContext";

/*  Walkable Areas (Static map collision)  */
const walkableAreas = [
    // Main 3x3 Rooms Grid
    { xMin: 30, xMax: 70, yMin: 25, yMax: 65 }, // Center
    { xMin: 35, xMax: 65, yMin: 4, yMax: 26 }, // North
    { xMin: 40, xMax: 60, yMin: 64, yMax: 96 }, // South
    { xMin: 4, xMax: 30, yMin: 35, yMax: 55 }, // West
    { xMin: 70, xMax: 96, yMin: 35, yMax: 55 }, // East
    { xMin: 4, xMax: 30, yMin: 4, yMax: 30 }, // NW
    { xMin: 70, xMax: 96, yMin: 4, yMax: 30 }, // NE
    { xMin: 4, xMax: 30, yMin: 70, yMax: 96 }, // SW
    { xMin: 70, xMax: 96, yMin: 70, yMax: 96 }, // SE

    // Connecting doorways (very generous overlaps)
    { xMin: 20, xMax: 40, yMin: 15, yMax: 25 }, // NW <-> North
    { xMin: 15, xMax: 25, yMin: 20, yMax: 40 }, // NW <-> West
    { xMin: 60, xMax: 80, yMin: 15, yMax: 25 }, // North <-> NE
    { xMin: 75, xMax: 85, yMin: 20, yMax: 40 }, // NE <-> East
    { xMin: 15, xMax: 25, yMin: 50, yMax: 75 }, // West <-> SW
    { xMin: 20, xMax: 45, yMin: 75, yMax: 85 }, // SW <-> South
    { xMin: 55, xMax: 80, yMin: 75, yMax: 85 }, // South <-> SE
    { xMin: 75, xMax: 85, yMin: 50, yMax: 75 }, // East <-> SE

    // Core connections to center
    { xMin: 40, xMax: 60, yMin: 20, yMax: 30 }, // North <-> Center
    { xMin: 40, xMax: 60, yMin: 60, yMax: 70 }, // South <-> Center
    { xMin: 25, xMax: 35, yMin: 40, yMax: 50 }, // West <-> Center
    { xMin: 65, xMax: 75, yMin: 40, yMax: 50 }, // East <-> Center
];

const isValidMove = (x, y) => {
    return walkableAreas.some(area =>
        x >= area.xMin && x <= area.xMax &&
        y >= area.yMin && y <= area.yMax
    );
};

export default function MainStage() {
    const { gameState, fetchState } = useGame();
    const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
    const [enemies, setEnemies] = useState([]);

    // Auto-refresh state periodically to catch AI updates (poor man's SSE for state)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchState();
        }, 3000);
        return () => clearInterval(interval);
    }, [fetchState]);

    // Reconcile backend live actors with frontend positions
    useEffect(() => {
        if (!gameState?.live_actors) return;

        // Simple deterministic spawn points for the hackathon Demo
        const spawnPoints = [
            { x: 38, y: 45 },
            { x: 62, y: 38 },
            { x: 50, y: 22 },
            { x: 15, y: 15 },
            { x: 80, y: 80 }
        ];

        setEnemies(prev => {
            return gameState.live_actors.filter(la => la.role === "Enemy").map((liveActor, index) => {
                const existing = prev.find(e => e.id === liveActor.actor_id);
                return {
                    id: liveActor.actor_id,
                    name: `Monster ${liveActor.actor_id}`, // Fallback name
                    hp: liveActor.current_hp,
                    maxHp: 20, // Fallback max HP
                    pos: existing ? existing.pos : spawnPoints[index % spawnPoints.length]
                };
            });
        });
    }, [gameState]);

    // Dice States
    const [showDiceOverlay, setShowDiceOverlay] = useState(false);
    const [rollResult, setRollResult] = useState(null);
    const [rolling, setRolling] = useState(false);

    const handleMapClick = (e) => {
        // Prevent moving if they click a button or overlay
        if (e.target.closest("button") || showDiceOverlay) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (isValidMove(x, y)) {
            setPlayerPos({ x, y });
        }
    };

    // Keyboard Movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only move if we aren't rolling dice or focused on an input
            if (showDiceOverlay || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            const STEP = 2; // Movement speed
            let newX = playerPos.x;
            let newY = playerPos.y;
            let moved = false;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    newY -= STEP; moved = true; break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    newY += STEP; moved = true; break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    newX -= STEP; moved = true; break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    newX += STEP; moved = true; break;
                default:
                    return;
            }

            if (moved) {
                if (isValidMove(newX, newY)) {
                    setPlayerPos({ x: newX, y: newY });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPos, showDiceOverlay]);

    const handleRoll = () => {
        setRolling(true);
        setRollResult(null);
        setTimeout(() => {
            setRollResult(Math.floor(Math.random() * 20) + 1);
            setRolling(false);

            // Auto close after 3 seconds showing result
            setTimeout(() => {
                setShowDiceOverlay(false);
                setRollResult(null);
            }, 3000);
        }, 800);
    };

    return (
        <div
            className="relative h-full w-full overflow-hidden bg-cover bg-center cursor-crosshair border-x border-amber-500/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"
            style={{ backgroundImage: "url('/map.png')" }}
            onClick={handleMapClick}
        >
            {/* ── Scene Title Overlay ──────────────────── */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent p-6 pb-12 z-20 pointer-events-none">
                <h1 className="font-serif-dm text-2xl font-semibold text-amber-400/90 glow-gold-text tracking-wide drop-shadow-lg">
                    Hollowfang Caves
                </h1>
                <p className="font-serif-dm text-[11px] text-slate-300 drop-shadow-md mt-1.5 tracking-[0.15em] uppercase">
                    Chapter II — Descent into darkness
                </p>
            </div>

            {/* ── Virtual Tabletop Tokens ──────────────── */}

            {/* Player Token */}
            <div
                className="absolute w-10 h-10 rounded-full border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] flex items-center justify-center transition-all duration-300 ease-out z-10 pointer-events-none bg-slate-900 overflow-hidden"
                style={{
                    left: `${playerPos.x}%`,
                    top: `${playerPos.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {character?.avatar ? (
                    <img src={character.avatar} className="w-full h-full object-cover" alt="Player" />
                ) : (
                    <Swords className="w-5 h-5 text-amber-400 drop-shadow-md" />
                )}
            </div>

            {/* Enemy Tokens */}
            {enemies.map(enemy => (
                <div
                    key={enemy.id}
                    className="absolute flex flex-col items-center z-10 pointer-events-none transition-all duration-300"
                    style={{
                        left: `${enemy.pos.x}%`,
                        top: `${enemy.pos.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Floating Info */}
                    <div className="absolute bottom-[110%] flex flex-col items-center mb-1 drop-shadow-lg">
                        <span className="text-[9px] font-serif-dm font-bold tracking-wider text-red-100 bg-slate-950/80 px-1.5 py-0.5 rounded-sm mb-1 whitespace-nowrap border border-red-500/30">
                            {enemy.name}
                        </span>
                        <div className="w-10 h-1.5 bg-slate-950/90 rounded-full border border-slate-700/80 overflow-hidden shadow-inner flex">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-800 to-red-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Enemy Circle */}
                    <div className="w-10 h-10 rounded-full border-2 border-red-600 bg-slate-900/90 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)] backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-900/20"></div>
                        <Target className="w-5 h-5 text-red-500 drop-shadow-md" />
                    </div>
                </div>
            ))}

            {/* ── UI Controls ─────────────────────────── */}

            {/* Open Dice Roller Button */}
            {!showDiceOverlay && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowDiceOverlay(true); }}
                    className="absolute bottom-6 right-6 px-4 py-2.5 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-400 font-serif-dm text-sm tracking-widest uppercase hover:bg-slate-800 hover:border-amber-400 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 transition-all z-20 group"
                >
                    <Dice5 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Roll Check
                </button>
            )}

            {/* ── D20 Skill Check Overlay ─────────────── */}
            {showDiceOverlay && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-slate-950/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    {/* Close Area */}
                    <div className="absolute inset-0 pointer-events-none" onClick={() => !rolling && setShowDiceOverlay(false)}></div>

                    <div className="flex flex-col items-center gap-4 relative z-40 bg-slate-900/80 p-12 rounded-2xl border border-amber-500/20 shadow-2xl">

                        <button
                            onClick={() => !rolling && setShowDiceOverlay(false)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-amber-400 transition-colors"
                        >
                            ✕
                        </button>

                        <h3 className="font-serif-dm text-lg text-amber-500/80 uppercase tracking-[0.2em] mb-2">Skill Check</h3>

                        {/* D20 Button */}
                        <button
                            onClick={handleRoll}
                            disabled={rolling || rollResult !== null}
                            className={`d20-hover d20-shake group relative w-32 h-32 rounded-2xl ${rollResult !== null ? 'bg-slate-800/90 border-amber-500/50' : 'bg-slate-900/90 border-amber-500/30'
                                } border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-400 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.1)]`}
                        >
                            {rollResult ? (
                                <span className="font-serif-dm text-5xl font-bold text-amber-400 glow-gold-text animate-in zoom-in duration-300">
                                    {rollResult}
                                </span>
                            ) : (
                                <>
                                    <Dice5
                                        className={`w-12 h-12 text-amber-500/80 transition-transform duration-300 ${rolling ? "animate-spin scale-110" : "group-hover:scale-110"}`}
                                    />
                                    <span className="font-serif-dm text-[11px] tracking-[0.2em] text-amber-400/60">
                                        {rolling ? "Rolling..." : "Roll D20"}
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Roll result flavor text */}
                        <div className="h-6 flex items-center justify-center mt-2">
                            {rollResult ? (
                                <span
                                    className={`font-serif-dm text-sm tracking-widest uppercase animate-in slide-in-from-bottom-2 ${rollResult === 20 ? "text-amber-400 glow-gold-text font-bold"
                                        : rollResult === 1 ? "text-red-500 font-bold drop-shadow-md"
                                            : rollResult >= 15 ? "text-green-400"
                                                : rollResult >= 10 ? "text-slate-200"
                                                    : "text-orange-500"
                                        }`}
                                >
                                    {rollResult === 20 ? "Critical Success"
                                        : rollResult === 1 ? "Critical Failure"
                                            : rollResult >= 15 ? "Strong success"
                                                : rollResult >= 10 ? "Moderate success"
                                                    : "Failure"}
                                </span>
                            ) : (
                                <span className="font-serif-dm text-xs text-amber-300/30 tracking-widest italic">
                                    Click the die to roll
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
