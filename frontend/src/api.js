// Dynamic API Base: Uses VITE_API_URL if set, falls back to localhost:8000 in dev, or relative /api in production
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/api`
  : (typeof window !== "undefined" && window.location.port === "5173"
      ? "http://127.0.0.1:8000/api"
      : "/api");

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}

export async function fetchMatches() {
  const res = await fetch(`${API_BASE}/matches`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function fetchMatchDetail(id) {
  const res = await fetch(`${API_BASE}/matches/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match detail");
  return res.json();
}

export async function predictMatch(params) {
  const res = await fetch(`${API_BASE}/predict/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}

export async function fetchPlayers() {
  const res = await fetch(`${API_BASE}/players`);
  if (!res.ok) throw new Error("Failed to fetch players");
  return res.json();
}

export async function fetchPlayerDetail(id) {
  const res = await fetch(`${API_BASE}/players/${id}`);
  if (!res.ok) throw new Error("Failed to fetch player detail");
  return res.json();
}

export async function estimateInjuryRisk(params) {
  const res = await fetch(`${API_BASE}/injury/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Injury estimation failed");
  return res.json();
}

export async function fetchCVScenarios() {
  const res = await fetch(`${API_BASE}/cv/scenarios`);
  if (!res.ok) throw new Error("Failed to fetch CV scenarios");
  return res.json();
}

export async function runCVDetection(scenario = "counter_attack", file = null) {
  const formData = new FormData();
  formData.append("scenario", scenario);
  if (file) {
    formData.append("file", file);
  }
  const res = await fetch(`${API_BASE}/cv/detect`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Computer Vision detection failed");
  return res.json();
}

export async function fetchTactics() {
  const res = await fetch(`${API_BASE}/tactics`);
  if (!res.ok) throw new Error("Failed to fetch tactics");
  return res.json();
}

export async function fetchEthicalAudits() {
  const res = await fetch(`${API_BASE}/ethics/audits`);
  if (!res.ok) throw new Error("Failed to fetch ethical audits");
  return res.json();
}

export async function simulateBias(debiasing_enabled) {
  const res = await fetch(`${API_BASE}/ethics/simulate-bias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ debiasing_enabled }),
  });
  if (!res.ok) throw new Error("Bias simulation failed");
  return res.json();
}

export async function simulateGovernance(levers) {
  const res = await fetch(`${API_BASE}/ethics/simulate-governance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(levers),
  });
  if (!res.ok) throw new Error("Governance simulation failed");
  return res.json();
}

export async function fetchResearchPaper() {
  const res = await fetch(`${API_BASE}/research/paper`);
  if (!res.ok) throw new Error("Failed to fetch research paper");
  return res.json();
}
