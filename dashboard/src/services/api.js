const BASE = "https://voice-queue-system.onrender.com";

export const getAllTokens = async () => {
  const res = await fetch(`${BASE}/token/all`);
  if (!res.ok) throw new Error("Failed to fetch tokens");
  return res.json();
};

export const updateTokenStatus = async (id, status) => {
  const res = await fetch(`${BASE}/token/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update token");
  return res.json();
};