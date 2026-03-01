// src/services/api.js
const API_BASE_URL = "http://localhost:8000/api/game";

export async function createGame(config = {}) {
  // Define the complex default structure based on your Ashfall Keep example
  const defaultData = {
    name: "Ashfall Keep",
    owner_user: "manual-tui",
    ai_initial_prompt:
      "You are the Dungeon Master of a Dungeons & Dragons game. " +
      "Lead the game, narrate scenes, control pacing, and guide players through " +
      "decisions and outcomes. Don't take decisions or actions for them, react to what they do. " +
      "Be concise but creative, answer in human tone, make the atmosphere interesting, " +
      "if asked say, but don't say too much. " +
      "You can access tools to inspect and update game state; use those tools when " +
      "needed to keep the game state accurate. " +
      "Answer directly, you are the narrator voice, you don't need introductions",
    chapters: [
      "Chapter 1: Smoke Over Blackridge",
      "Chapter 2: The Broken Gate",
      "Chapter 3: Crown of Cinders",
    ],
    current_chapters: ["Chapter 1: Smoke Over Blackridge"],
    initial_state: {
      environment_description:
        "Ash is drifting across Blackridge. The keep bells are silent.",
      live_actors: [],
    },
  };

  // Merge the defaults with any overrides passed into the function
  const payload = { ...defaultData, ...config };

  const res = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create game");
  return res.json();
}

export async function getGame(gameId) {
  const res = await fetch(`${API_BASE_URL}/${gameId}`);
  if (!res.ok) throw new Error("Failed to fetch game");
  return res.json();
}

export async function getGameState(gameId) {
  const res = await fetch(`${API_BASE_URL}/${gameId}/state`);
  if (!res.ok) throw new Error("Failed to fetch game state");
  return res.json();
}

export async function getChatMessages(gameId) {
  const res = await fetch(`${API_BASE_URL}/${gameId}/messages`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendChatMessage(gameId, content, role = "user") {
  const res = await fetch(`${API_BASE_URL}/${gameId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        role: role,
        content: content,
      },
    }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

// Helper to initiate the AI DM turn via SSE
// We use EventSource or streamed fetch for this. We will use a raw streaming fetch.
export async function runAIResponse(gameId, onChunk) {
  const res = await fetch(`${API_BASE_URL}/${gameId}/run-ai`, {
    method: "POST",
    headers: { Accept: "text/plain" },
  });

  if (!res.ok) throw new Error("Failed to run AI");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let fullText = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      if (onChunk) onChunk(chunk, fullText);
    }
  }
  return fullText;
}

export async function attackLiveActor(
  gameId,
  liveActorId,
  attackBonus,
  damageNumDice,
  damageDiceFaces,
  damageBonus,
) {
  const res = await fetch(`${API_BASE_URL}/${gameId}/attack-live-actor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      live_actor_id: liveActorId,
      attack_bonus: attackBonus,
      damage_num_dice: damageNumDice,
      damage_dice_faces: damageDiceFaces,
      damage_bonus: damageBonus,
    }),
  });
  if (!res.ok) throw new Error("Attack failed");
  return res.json();
}
