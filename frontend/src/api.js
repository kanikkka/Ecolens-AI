const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function scanProduct({ sampleKey, file }) {
  const formData = new FormData();
  if (sampleKey) formData.append("sample_key", sampleKey);
  if (file) formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Scan failed");
  return res.json();
}

export async function verifyAction({ passportId, destinationId, qrToken }) {
  const res = await fetch(`${API_BASE}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      passport_id: passportId,
      destination_id: destinationId,
      qr_token: qrToken,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Verification failed");
  return data;
}

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  return res.json();
}

export async function fetchMissions() {
  const res = await fetch(`${API_BASE}/api/missions`);
  return res.json();
}

export async function fetchGovAnalytics() {
  const res = await fetch(`${API_BASE}/api/gov-analytics`);
  return res.json();
}
