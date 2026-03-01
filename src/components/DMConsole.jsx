import React, { useState, useRef, useEffect } from "react";
import { Send, Volume2 } from "lucide-react";
import { useGame } from "../contexts/GameContext";
import { getChatMessages, sendChatMessage, runAIResponse } from "../services/api";

/* ── Audio Waveform Indicator ─────────────────── */
function AudioIndicator() {
    const bars = [0, 1, 2, 3, 4, 5, 6];
    return (
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800/40">
            <Volume2 className="w-3.5 h-3.5 text-amber-500/60" />
            <span className="font-serif-dm text-[10px] tracking-[0.15em] text-amber-400/50 italic">
                AI Dungeon Master is Speaking
            </span>
            <div className="flex items-center gap-[2px] ml-auto h-4">
                {bars.map((i) => (
                    <span
                        key={i}
                        className="wave-bar inline-block w-[2px] rounded-full bg-amber-500/50"
                        style={{
                            height: "12px",
                            animationDelay: `${i * 0.15}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ── Chat Message ─────────────────────────────── */
function ChatMessage({ msg }) {
    const isDM = msg.sender === "dm";

    if (isDM) {
        return (
            <div className="mb-5">
                <p className="font-serif-dm text-[14.5px] leading-[1.75] text-amber-100/75">
                    {msg.text}
                </p>
            </div>
        );
    }

    return (
        <div className="mb-5 flex justify-end">
            <div className="max-w-[85%] rounded-xl rounded-br-sm bg-slate-800/50 border border-slate-700/25 px-3.5 py-2.5">
                <p className="font-serif-dm text-[13px] leading-relaxed text-slate-300/90">
                    {msg.text}
                </p>
            </div>
        </div>
    );
}

/* ── DM Console (Right Panel) ─────────────────── */
export default function DMConsole() {
    const { gameId } = useGame();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    // Initial load of messages
    useEffect(() => {
        if (!gameId) return;
        getChatMessages(gameId).then(data => {
            // Map the API schema to our UI schema
            const history = data.map(msg => ({
                id: msg.id,
                sender: msg.message.role === 'user' ? 'player' : 'dm',
                text: msg.message.content
            }));
            setMessages(history);
        }).catch(err => console.error("Failed to load history", err));
    }, [gameId]);

    /* Auto-scroll to bottom on new messages */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isThinking || !gameId) return;
        const userText = input.trim();
        setInput("");

        // Optimistic UI update for user message
        const optimisticUserMsg = { id: Date.now(), sender: "player", text: userText };
        setMessages((prev) => [...prev, optimisticUserMsg]);

        try {
            await sendChatMessage(gameId, userText);

            // Prepare a placeholder for the streaming DM response
            setIsThinking(true);
            const aiMsgId = Date.now() + 1;
            setMessages((prev) => [...prev, { id: aiMsgId, sender: "dm", text: "" }]);

            // Stream AI Response
            await runAIResponse(gameId, (chunk, fullText) => {
                setMessages((prev) =>
                    prev.map(msg => msg.id === aiMsgId ? { ...msg, text: fullText } : msg)
                );
            });
        } catch (error) {
            console.error("Failed to fetch AI response", error);
            setMessages((prev) => [...prev, { id: Date.now(), sender: "dm", text: "_[The DM is temporarily unreachable...]_" }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 panel-border-l overflow-hidden">
            {/* ── Audio indicator (Only animate when thinking) ───────── */}
            <div className={`transition-opacity duration-300 ${isThinking ? 'opacity-100' : 'opacity-30'}`}>
                <AudioIndicator />
            </div>

            {/* ── Chat log ─────────────────────────────── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
            >
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} msg={msg} />
                ))}
            </div>

            {/* ── Input area ───────────────────────────── */}
            <div className="p-3 border-t border-slate-800/40">
                <div className="flex items-center gap-2 rounded-xl bg-slate-800/30 border border-slate-700/25 focus-within:border-amber-500/30 transition-colors px-3 py-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What do you do?..."
                        className="flex-1 bg-transparent font-serif-dm text-[13px] text-slate-300 placeholder:text-slate-600 outline-none py-1.5"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 rounded-lg hover:bg-amber-500/5 text-amber-500/50 hover:text-amber-400/70 transition-colors cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
