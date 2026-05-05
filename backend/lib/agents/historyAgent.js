const axios = require("axios");
const { findInstrument } = require("../instruments");
const { makeHistory } = require("../marketData");

const TD_BASE_URL = "https://api.twelvedata.com";
const TD_API_KEY = process.env.TWELVE_DATA_API_KEY;

async function fetchHistoryFromTwelveData(symbol, exchange, range = "6mo", interval = "1day") {
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
        outputsize: outputsizeMap[range] || 90,
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
    console.error("historyAgent Twelve Data error:", error.response?.data || error.message);
    return null;
  }
}

async function getStockHistoryAgent({ symbol, exchange = "", range = "6mo" }) {
  if (!symbol) return [];

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

  const interval = intervalMap[range] || "1day";
  const apiHistory = await fetchHistoryFromTwelveData(symbol, exchange, range, interval);
  if (apiHistory?.length) return apiHistory;

  const instrument = findInstrument(symbol, exchange);
  if (!instrument) return [];

  return makeHistory(instrument, range, interval);
}

module.exports = {
  getStockHistoryAgent,
};