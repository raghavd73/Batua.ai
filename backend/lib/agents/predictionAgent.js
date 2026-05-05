function round(value, digits = 2) {
  return Number(Number(value).toFixed(digits));
}

function sma(values, period) {
  if (!Array.isArray(values) || values.length < period) return null;
  const slice = values.slice(values.length - period);
  return slice.reduce((sum, v) => sum + v, 0) / period;
}

function percentageChange(from, to) {
  if (!from || from === 0) return 0;
  return ((to - from) / from) * 100;
}

/**
 * Starter heuristic predictor.
 * This is NOT a real ML forecast.
 * It gives a directional bias using recent price behavior.
 */
function getStockPredictionAgent({ candles = [] }) {
  if (!Array.isArray(candles) || candles.length < 25) {
    return {
      direction: "neutral",
      confidence: 0.2,
      summary: "Not enough history to form a view.",
      signals: [],
    };
  }

  const closes = candles.map((c) => Number(c.close)).filter(Number.isFinite);
  const latest = closes[closes.length - 1];
  const sma10 = sma(closes, 10);
  const sma20 = sma(closes, 20);
  const momentum5 = percentageChange(closes[closes.length - 6], latest);
  const momentum20 = percentageChange(closes[closes.length - 21], latest);

  const signals = [];

  if (sma10 != null && latest > sma10) signals.push("price_above_sma10");
  if (sma20 != null && latest > sma20) signals.push("price_above_sma20");
  if (momentum5 > 0) signals.push("positive_5_day_momentum");
  if (momentum20 > 0) signals.push("positive_20_day_momentum");

  let score = 0;
  if (sma10 != null && latest > sma10) score += 1;
  if (sma20 != null && latest > sma20) score += 1;
  if (momentum5 > 0) score += 1;
  if (momentum20 > 0) score += 1;

  let direction = "neutral";
  if (score >= 3) direction = "up";
  else if (score <= 1) direction = "down";

  const confidence = round(Math.min(0.85, 0.25 + score * 0.15));

  const summary =
    direction === "up"
      ? "Recent trend and moving averages lean bullish."
      : direction === "down"
      ? "Recent trend is weak and leaning bearish."
      : "Signals are mixed.";

  return {
    direction,
    confidence,
    summary,
    signals,
    metrics: {
      latest: round(latest),
      sma10: sma10 != null ? round(sma10) : null,
      sma20: sma20 != null ? round(sma20) : null,
      momentum5: round(momentum5),
      momentum20: round(momentum20),
    },
  };
}

module.exports = {
  getStockPredictionAgent,
};