const express = require("express");
const axios = require("axios");
const { searchInstruments, findInstrument } = require("../lib/instruments");
const { makeHistory } = require("../lib/marketData");
const { buildNormalizedStockDetails } = require("../lib/stockDetailsBuilder");
const { getStockRecommendationBundle } = require("../lib/agents/recommendationOrchestrator");

const router = express.Router();

const TD_BASE_URL = "https://api.twelvedata.com";
const TD_API_KEY = process.env.TWELVE_DATA_API_KEY;

function normalizeSearchResult(item) {
  return {
    ticker_symbol: item.symbol || item.ticker || "",
    company_name: item.instrument_name || item.name || item.symbol || "",
    exchange: item.exchange || item.mic_code || "",
    country: item.country || "",
    currency: item.currency || "",
    type: item.type || item.instrument_type || "Stock",
    price: item.close ? Number(item.close) : null,
    logo_url: "",
  };
}

async function searchWithTwelveData(query) {
  if (!TD_API_KEY) return [];
  try {
    const response = await axios.get(`${TD_BASE_URL}/symbol_search`, {
      params: {
        symbol: query,
        apikey: TD_API_KEY,
      },
      timeout: 8000,
    });

    const raw = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];

    return raw
      .map(normalizeSearchResult)
      .filter((item) => item.ticker_symbol && item.company_name)
      .slice(0, 12);
  } catch (error) {
    console.error("Twelve Data symbol_search failed:", error.response?.data || error.message);
    return [];
  }
}

async function fetchQuoteFromTwelveData(symbol, exchange) {
  if (!TD_API_KEY) return null;
  try {
    const response = await axios.get(`${TD_BASE_URL}/quote`, {
      params: {
        symbol,
        exchange: exchange || undefined,
        apikey: TD_API_KEY,
      },
      timeout: 8000,
    });

    const data = response.data;
    if (data?.status === "error" || data?.code) {
      return null;
    }

    return {
      symbol: data.symbol,
      company_name: data.name || symbol,
      exchange: data.exchange || exchange || "",
      currency: data.currency || "USD",
      last_price: data.close != null ? Number(data.close) : null,
      change: data.change != null ? Number(data.change) : null,
      change_pct: data.percent_change != null ? Number(data.percent_change) : null,
      prev_close: data.previous_close != null ? Number(data.previous_close) : null,
      open: data.open != null ? Number(data.open) : null,
      high: data.high != null ? Number(data.high) : null,
      low: data.low != null ? Number(data.low) : null,
      volume: data.volume != null ? Number(data.volume) : null,
      week52_low: data.fifty_two_week?.low != null ? Number(data.fifty_two_week.low) : null,
      week52_high: data.fifty_two_week?.high != null ? Number(data.fifty_two_week.high) : null,
    };
  } catch (error) {
    console.error("Twelve Data quote failed:", error.response?.data || error.message);
    return null;
  }
}

async function fetchHistoryFromTwelveData(symbol, exchange, range = "1y", interval = "1day") {
  if (!TD_API_KEY) return null;

  const outputsizeMap = {
    "1d": 30,
    "5d": 40,
    "1mo": 30,
    "3mo": 60,
    "6mo": 90,
    "1y": 120,
    "5y": 240,
    max: 500,
    ytd: 100,
  };

  try {
    const response = await axios.get(`${TD_BASE_URL}/time_series`, {
      params: {
        symbol,
        exchange: exchange || undefined,
        interval,
        outputsize: outputsizeMap[range] || 120,
        order: "ASC",
        apikey: TD_API_KEY,
      },
      timeout: 10000,
    });

    const values = Array.isArray(response.data?.values) ? response.data.values : [];
    if (!values.length) return null;

    return values.map((item) => ({
      time: item.datetime?.slice(0, 10) || item.datetime,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      interval,
    }));
  } catch (error) {
    console.error("Twelve Data time_series failed:", error.response?.data || error.message);
    return null;
  }
}

router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);

  const apiResults = await searchWithTwelveData(q);
  if (apiResults.length > 0) {
    return res.json(apiResults);
  }

  const localResults = searchInstruments(q).map((instrument) => ({
    ticker_symbol: instrument.ticker_symbol,
    company_name: instrument.company_name,
    exchange: instrument.exchange,
    country: instrument.country,
    currency: instrument.currency,
    type: instrument.type,
    price: instrument.price,
    logo_url: instrument.logo_url || "",
  }));

  return res.json(localResults);
});

router.get("/details", async (req, res) => {
  const symbol = String(req.query.symbol || "").trim();
  const exchange = String(req.query.exchange || "").trim();

  if (!symbol) {
    return res.status(400).json({ message: "symbol is required" });
  }

  const instrument = findInstrument(symbol, exchange);
  const liveQuote = await fetchQuoteFromTwelveData(symbol, exchange);

  if (liveQuote) {
    const fallbackInstrument =
      instrument ||
      {
        ticker_symbol: symbol,
        company_name: liveQuote.company_name || symbol,
        exchange: liveQuote.exchange || exchange || "",
        country: "Unknown",
        currency: liveQuote.currency || "USD",
        type: "Stock",
        logo_url: "",
        price: liveQuote.last_price || 100,
      };

    const details = buildNormalizedStockDetails(fallbackInstrument);

    return res.json({
      ...details,
      company_name: liveQuote.company_name || details.company_name,
      exchange: liveQuote.exchange || details.exchange,
      currency: liveQuote.currency || details.currency,
      quote: {
        ...details.quote,
        last_price: liveQuote.last_price ?? details.quote.last_price,
        change: liveQuote.change ?? details.quote.change,
        change_pct: liveQuote.change_pct ?? details.quote.change_pct,
        prev_close: liveQuote.prev_close ?? details.quote.prev_close,
      },
      overview: {
        ...details.overview,
        today_low: liveQuote.low ?? details.overview.today_low,
        today_high: liveQuote.high ?? details.overview.today_high,
        week52_low: liveQuote.week52_low ?? details.overview.week52_low,
        week52_high: liveQuote.week52_high ?? details.overview.week52_high,
        open: liveQuote.open ?? details.overview.open,
        prev_close: liveQuote.prev_close ?? details.overview.prev_close,
        volume: liveQuote.volume ?? details.overview.volume,
      },
      last_price: liveQuote.last_price ?? details.last_price,
      change: liveQuote.change ?? details.change,
      change_pct: liveQuote.change_pct ?? details.change_pct,
      prev_close: liveQuote.prev_close ?? details.prev_close,
      open: liveQuote.open ?? details.open,
      high: liveQuote.high ?? details.high,
      low: liveQuote.low ?? details.low,
      volume: liveQuote.volume ?? details.volume,
    });
  }

  if (!instrument) {
  const fallbackInstrument = {
    ticker_symbol: symbol,
    company_name: symbol,
    exchange: exchange || "",
    country: "Unknown",
    currency: "INR",
    type: "Stock",
    logo_url: "",
    price: 100,
  };

  return res.json(buildNormalizedStockDetails(fallbackInstrument));
}

return res.json(buildNormalizedStockDetails(instrument));
});
router.get("/history", async (req, res) => {
  const symbol = String(req.query.symbol || "").trim();
  const exchange = String(req.query.exchange || "").trim();
  const range = String(req.query.range || "1y").trim();

  const intervalMap = {
    "1d": "5min",
    "5d": "15min",
    "1mo": "1h",
    "3mo": "1day",
    "6mo": "1day",
    "1y": "1day",
    "5y": "1week",
    max: "1month",
    ytd: "1day",
  };

  if (!symbol) {
    return res.status(400).json({ message: "symbol is required" });
  }

  const apiHistory = await fetchHistoryFromTwelveData(
    symbol,
    exchange,
    range,
    intervalMap[range] || "1day"
  );

  if (apiHistory && apiHistory.length > 0) {
    return res.json(apiHistory);
  }

 let instrument = findInstrument(symbol, exchange);

if (!instrument) {
  instrument = {
    ticker_symbol: symbol,
    company_name: symbol,
    exchange: exchange || "",
    country: "Unknown",
    currency: "INR",
    type: "Stock",
    logo_url: "",
    price: 100,
  };
}

return res.json(makeHistory(instrument, range, intervalMap[range] || "1day"));
});

router.get("/recommendation", async (req, res) => {
  const symbol = String(req.query.symbol || "").trim();
  const exchange = String(req.query.exchange || "").trim();

  if (!symbol) {
    return res.status(400).json({ message: "symbol is required" });
  }

  try {
    const result = await getStockRecommendationBundle({ symbol, exchange });
    return res.json(result);
  } catch (error) {
    console.error("Recommendation endpoint failed:", error);
    return res.status(500).json({ message: "Failed to generate recommendation" });
  }
});

module.exports = router;