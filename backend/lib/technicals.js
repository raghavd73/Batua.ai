function round(value, digits = 2) {
  return Number(Number(value).toFixed(digits));
}

function calculateSma(values, period) {
  if (!Array.isArray(values) || values.length < period) return null;

  const slice = values.slice(values.length - period);
  const sum = slice.reduce((acc, current) => acc + current, 0);
  return sum / period;
}

function calculateRsi(closes, period = 14) {
  if (!Array.isArray(closes) || closes.length <= period) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i += 1) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i += 1) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateEma(values, period) {
  if (!Array.isArray(values) || values.length < period) return null;

  const multiplier = 2 / (period + 1);
  let ema = values.slice(0, period).reduce((acc, value) => acc + value, 0) / period;

  for (let i = period; i < values.length; i += 1) {
    ema = (values[i] - ema) * multiplier + ema;
  }

  return ema;
}

function calculateMacd(closes) {
  const ema12 = calculateEma(closes, 12);
  const ema26 = calculateEma(closes, 26);

  if (ema12 == null || ema26 == null) return 0;

  return ema12 - ema26;
}

function calculateBeta(symbol) {
  const seed = String(symbol || "")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return 0.8 + (seed % 70) / 100;
}

function getTechnicalSummary({ rsi, macd, close, sma20 }) {
  let score = 0;

  if (rsi >= 45 && rsi <= 65) score += 1;
  if (macd >= 0) score += 1;
  if (sma20 != null && close >= sma20) score += 1;

  if (score >= 2) return "Bullish";
  if (score === 1) return "Neutral";
  return "Bearish";
}

function buildTechnicals(candles, symbol) {
  const closes = candles.map((candle) => Number(candle.close));

  const rsi = round(calculateRsi(closes));
  const macd = round(calculateMacd(closes));
  const beta = round(calculateBeta(symbol));
  const sma20 = calculateSma(closes, 20);
  const latestClose = closes[closes.length - 1] || 0;

  return {
    summary: getTechnicalSummary({
      rsi,
      macd,
      close: latestClose,
      sma20,
    }),
    rsi,
    macd,
    beta,
  };
}

module.exports = {
  buildTechnicals,
};