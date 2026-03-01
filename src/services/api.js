// src/services/api.js
const API_BASE_URL = "http://localhost:8000/api/game";

export async function createGame(config = {}) {
  // Merge the defaults with any overrides passed into the function
  const payload = { ...config };

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

export async function createActor(gameId, actorPayload) {
  const res = await fetch(`${API_BASE_URL}/${gameId}/actor/actor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actorPayload),
  });
  if (!res.ok) throw new Error("Failed to create player");
  return res.json();
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
