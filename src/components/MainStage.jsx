import React, { useState, useEffect } from "react";
import { Dice5, Skull, Target, Swords, XCircle } from "lucide-react";
import { character } from "../data/mockData";

/*  Walkable Areas (Static map collision)  */
const walkableAreas = [
    // Central Room (With Padding)
    { xMin: 31, xMax: 69, yMin: 27, yMax: 63 },
    // South Corridor
    { xMin: 44, xMax: 56, yMin: 63, yMax: 93 },
    // North Fireplace Room
    { xMin: 37, xMax: 63, yMin: 20, yMax: 25 },
    // West Corridor
    { xMin: 22, xMax: 28, yMin: 42, yMax: 56 },
    // East Corridor
    { xMin: 72, xMax: 78, yMin: 42, yMax: 56 },
    // NW Room
    { xMin: 6, xMax: 26, yMin: 6, yMax: 28 },
    // NE Room
    { xMin: 74, xMax: 94, yMin: 6, yMax: 28 },
    // SW Room
    { xMin: 6, xMax: 28, yMin: 70, yMax: 94 },
    // SE Room
    { xMin: 72, xMax: 95, yMin: 70, yMax: 94 },
    // Vertical Corridors connecting corner rooms
    { xMin: 12, xMax: 18, yMin: 28, yMax: 70 }, // West interconnect
    { xMin: 82, xMax: 88, yMin: 28, yMax: 70 }, // East interconnect
    // Horizontal Corridors connecting corner rooms to center
    { xMin: 26, xMax: 44, yMin: 12, yMax: 18 }, // NW to North
    { xMin: 56, xMax: 74, yMin: 12, yMax: 18 }, // NE to North
    { xMin: 26, xMax: 44, yMin: 82, yMax: 88 }, // SW to South
    { xMin: 56, xMax: 74, yMin: 82, yMax: 88 }, // SE to South
];

const isValidMove = (x, y) => {
    return walkableAreas.some(area =>
        x >= area.xMin && x <= area.xMax &&
        y >= area.yMin && y <= area.yMax
    );
};

export default function MainStage() {
    const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
    const [invalidMoveMarker, setInvalidMoveMarker] = useState(null);
    const [enemies] = useState([
        { id: 1, name: "Goblin Raider", hp: 12, maxHp: 15, pos: { x: 38, y: 45 } },
        { id: 2, name: "Dire Wolf", hp: 20, maxHp: 20, pos: { x: 62, y: 38 } },
        { id: 3, name: "Cultist", hp: 5, maxHp: 10, pos: { x: 50, y: 22 } },
    ]);

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
        } else {
            setInvalidMoveMarker({ x, y, id: Date.now() });
        }
    };

    // Auto-clear invalid move marker
    useEffect(() => {
        if (invalidMoveMarker) {
            const timer = setTimeout(() => setInvalidMoveMarker(null), 600);
            return () => clearTimeout(timer);
        }
    }, [invalidMoveMarker]);

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
                className="absolute w-10 h-10 rounded-full border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] flex items-center justify-center transition-all duration-500 ease-in-out z-10 pointer-events-none bg-slate-900 overflow-hidden"
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

            {/* Invalid Move Visual Feedback */}
            {invalidMoveMarker && (
                <div
                    key={invalidMoveMarker.id}
                    className="absolute flex items-center justify-center animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300 pointer-events-none z-20"
                    style={{
                        left: `${invalidMoveMarker.x}%`,
                        top: `${invalidMoveMarker.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <XCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                </div>
            )}

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
