const axios = require("axios");

const TD_BASE_URL = "https://api.twelvedata.com";
const TD_API_KEY = process.env.TWELVE_DATA_API_KEY;

/**
 * Starter news agent.
 * For now:
 * - if Twelve Data news is unavailable in your plan, return empty array
 * - keeps shape stable for frontend
 */
async function getStockNewsAgent({ symbol }) {
  if (!symbol) return [];

  // Starter version: safe fallback
  // Replace this later with real provider-specific news endpoint
  return [];

  // Example future structure:
  // return [
  //   {
  //     title: "State Bank of India sees strong momentum",
  //     source: "Some source",
  //     time: "2026-04-07T10:30:00Z",
  //     sentiment_hint: "positive",
  //     url: "https://..."
  //   }
  // ];
}

module.exports = {
  getStockNewsAgent,
};