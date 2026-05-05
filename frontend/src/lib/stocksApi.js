const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export async function fetchStockDetails(symbol, exchange = "") {
  const res = await fetch(
    `${API_BASE}/api/stocks/details?symbol=${encodeURIComponent(symbol)}&exchange=${encodeURIComponent(exchange)}`
  );
  if (!res.ok) throw new Error("Failed to fetch stock details");
  return res.json();
}

export async function fetchStockHistory(symbol, exchange = "", range = "1y") {
  const res = await fetch(
    `${API_BASE}/api/stocks/history?symbol=${encodeURIComponent(symbol)}&exchange=${encodeURIComponent(exchange)}&range=${encodeURIComponent(range)}`
  );
  if (!res.ok) throw new Error("Failed to fetch stock history");
  return res.json();
}

export async function fetchStockRecommendation(symbol, exchange = "") {
  const res = await fetch(
    `${API_BASE}/api/stocks/recommendation?symbol=${encodeURIComponent(symbol)}&exchange=${encodeURIComponent(exchange)}`
  );
  if (!res.ok) throw new Error("Failed to fetch recommendation");
  return res.json();
}