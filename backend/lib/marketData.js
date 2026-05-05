const { buildTechnicals } = require("./technicals");

function round(value, digits = 2) {
  return Number(Number(value).toFixed(digits));
}

function formatIndianNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}

function getSeed(symbol) {
  return String(symbol || "")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function makeQuote(instrument) {
  const base = Number(instrument.price || 100);
  const seed = getSeed(instrument.ticker_symbol);

  const change = round(((seed % 25) - 8) * 0.91);
  const prevClose = round(base - change);
  const changePct = prevClose !== 0 ? round((change / prevClose) * 100) : 0;

  return {
    last_price: round(base),
    change,
    change_pct: changePct,
    prev_close: prevClose,
  };
}

function makeHistory(instrument, range = "1y", interval = "1d") {
  const base = Number(instrument.price || 100);
  const seed = getSeed(instrument.ticker_symbol);

  let points = 60;

  if (range === "1d") points = 30;
  if (range === "5d") points = 40;
  if (range === "1mo") points = 30;
  if (range === "3mo") points = 60;
  if (range === "6mo") points = 90;
  if (range === "1y") points = 120;
  if (range === "5y") points = 180;
  if (range === "max") points = 220;
  if (range === "ytd") points = 100;

  const now = Date.now();
  const candles = [];

  for (let i = 0; i < points; i += 1) {
    const progress = i / Math.max(points - 1, 1);
    const wave = Math.sin((i + seed) / 8) * base * 0.025;
    const trend = (progress - 0.5) * base * 0.08;
    const open = base + trend + wave;
    const close = open + Math.cos((i + seed) / 5) * base * 0.012;
    const high = Math.max(open, close) + base * 0.01;
    const low = Math.min(open, close) - base * 0.01;

    candles.push({
      time: new Date(now - (points - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      interval,
    });
  }

  return candles;
}

function makeOverview(instrument, quote, candles) {
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const lastCandle = candles[candles.length - 1];
  const seed = getSeed(instrument.ticker_symbol);

  return {
    today_low: round(lastCandle?.low ?? instrument.price * 0.98),
    today_high: round(lastCandle?.high ?? instrument.price * 1.02),
    week52_low: round(Math.min(...lows)),
    week52_high: round(Math.max(...highs)),
    open: round(lastCandle?.open ?? quote.prev_close),
    prev_close: quote.prev_close,
    volume: 2500000 + seed * 124,
    last_price: quote.last_price,
  };
}

function makeFundamentals(instrument) {
  const seed = getSeed(instrument.ticker_symbol);

  return {
    market_cap: `₹${formatIndianNumber(20000 + seed * 13)}Cr`,
    pe_ratio: round(10 + (seed % 20) * 0.42),
    pb_ratio: round(1 + (seed % 12) * 0.18),
    roe: `${round(6 + (seed % 10) * 0.44)}%`,
    eps: round(8 + (seed % 15) * 0.67),
    book_value: round(40 + (seed % 18) * 3.11),
  };
}

function makeMarketDepth(instrument, quote) {
  const seed = getSeed(instrument.ticker_symbol);
  const base = quote.last_price;

  return {
    bids: [
      { price: round(base - 0.21), qty: 100 + (seed % 500) },
      { price: round(base - 0.22), qty: 150 + (seed % 350) },
    ],
    asks: [
      { price: round(base + 0.19), qty: 120 + (seed % 250) },
      { price: round(base + 0.2), qty: 160 + (seed % 400) },
    ],
  };
}

function makeEvents(instrument) {
  const companyName = instrument.company_name;

  return [
    `11 Mar – ${companyName} dividend ₹4`,
    `03 Mar – ${companyName} board meeting update`,
    `15 Jan – ${companyName} quarterly results`,
  ];
}

function makeNews(instrument) {
  return [
    {
      title: `${instrument.company_name} sees renewed investor interest`,
      source: "Batua Markets",
      time: "2h ago",
    },
    {
      title: `${instrument.company_name} trends higher amid sector momentum`,
      source: "Batua Desk",
      time: "5h ago",
    },
    {
      title: `What traders are watching in ${instrument.company_name}`,
      source: "Batua Insights",
      time: "1d ago",
    },
  ];
}

function buildStockDetails(instrument) {
  try {
    const quote = makeQuote(instrument);
    const candles = makeHistory(instrument, "1y", "1d");
    const overview = makeOverview(instrument, quote, candles);
    const fundamentals = makeFundamentals(instrument);
    const market_depth = makeMarketDepth(instrument, quote);

    let technicals = {
      summary: "Neutral",
      rsi: 50,
      macd: 0,
      beta: 1,
    };

    try {
      technicals = buildTechnicals(candles, instrument.ticker_symbol);
    } catch (err) {
      console.error("Technicals error:", err);
    }

    const events = makeEvents(instrument);
    const news = makeNews(instrument);

    return {
      symbol: instrument.ticker_symbol,
      ticker_symbol: instrument.ticker_symbol,
      company_name: instrument.company_name,
      exchange: instrument.exchange,
      country: instrument.country,
      currency: instrument.currency,
      type: instrument.type,
      logo_url: instrument.logo_url || "",
      quote,
      overview,
      fundamentals,
      technicals,
      market_depth,
      events,
      news,

      last_price: quote.last_price,
      change: quote.change,
      change_pct: quote.change_pct,
      prev_close: quote.prev_close,
      open: overview.open,
      high: overview.today_high,
      low: overview.today_low,
      volume: overview.volume,
      market_cap: fundamentals.market_cap,
      pe_ratio: fundamentals.pe_ratio,
    };
  } catch (err) {
    console.error("buildStockDetails failed:", err);
    throw err;
  }
}

module.exports = {
  makeHistory,
  buildStockDetails,
};