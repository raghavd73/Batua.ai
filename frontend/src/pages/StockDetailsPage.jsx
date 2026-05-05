import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchStockDetails, fetchStockHistory } from "../lib/StocksApi";

const RANGE_MAP = {
  "1D": "1d",
  "1W": "5d",
  "1M": "1mo",
  "3M": "3mo",
  "6M": "6mo",
  "1Y": "1y",
  "5Y": "5y",
  ALL: "max",
};

function safePrice(value, currency = "INR") {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  return currency === "INR" ? `₹${n.toFixed(2)}` : n.toFixed(2);
}

export default function StockDetailsPage() {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const [searchParams] = useSearchParams();

  const exchange = searchParams.get("exchange") || "NSE";

  const [details, setDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedRange, setSelectedRange] = useState("1Y");
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchStockDetails(symbol, exchange);

        if (!cancelled) {
          setDetails(data || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load stock.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [symbol, exchange]);

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;

    async function loadHistory() {
      try {
        setHistoryLoading(true);

        const data = await fetchStockHistory(
          symbol,
          exchange,
          RANGE_MAP[selectedRange]
        );

        if (!cancelled) {
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setHistory([]);
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [symbol, exchange, selectedRange]);

  if (!symbol) {
    return <div className="stock-page">Invalid stock symbol.</div>;
  }

  if (loading) {
    return <div className="stock-page">Loading stock...</div>;
  }

  if (error) {
    return (
      <div className="stock-page">
        <button onClick={() => navigate(-1)}>← Back</button>
        <p>{error}</p>
      </div>
    );
  }

  if (!details) {
    return <div className="stock-page">No stock details found.</div>;
  }

  const quote = details.quote || {};
  const overview = details.overview || {};
  const fundamentals = details.fundamentals || {};

  return (
    <div className="stock-page">
      <div className="stock-container">
        <button onClick={() => navigate(-1)} className="stock-back-btn">
          ← Back
        </button>

        <div className="stock-card">
          <h1>{details.company_name || symbol}</h1>
          <p>
            {details.ticker_symbol || symbol} • {details.exchange || exchange}
          </p>

          <h2>{safePrice(quote.last_price, details.currency)}</h2>

          <p>
            Change:{" "}
            {quote.change != null ? Number(quote.change).toFixed(2) : "--"} (
            {quote.change_pct != null
              ? `${Number(quote.change_pct).toFixed(2)}%`
              : "--"}
            )
          </p>
        </div>

        <div className="stock-card">
          <h2>Stock Chart</h2>

          <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
            {Object.keys(RANGE_MAP).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={selectedRange === range ? "active" : ""}
              >
                {range}
              </button>
            ))}
          </div>

          {historyLoading ? (
            <p>Loading chart...</p>
          ) : history.length > 0 ? (
<div>
  Chart data loaded: {history.length} points
</div>          ) : (
            <p>No chart data available.</p>
          )}
        </div>

        <div className="stock-card">
          <h2>Overview</h2>
          <p>Open: {safePrice(overview.open, details.currency)}</p>
          <p>Prev Close: {safePrice(overview.prev_close, details.currency)}</p>
          <p>Today Low: {safePrice(overview.today_low, details.currency)}</p>
          <p>Today High: {safePrice(overview.today_high, details.currency)}</p>
          <p>Volume: {overview.volume || "--"}</p>
        </div>

        <div className="stock-card">
          <h2>Fundamentals</h2>
          <p>Market Cap: {fundamentals.market_cap || "--"}</p>
          <p>P/E Ratio: {fundamentals.pe_ratio ?? "--"}</p>
          <p>P/B Ratio: {fundamentals.pb_ratio ?? "--"}</p>
          <p>ROE: {fundamentals.roe || "--"}</p>
        </div>
      </div>
    </div>
  );
}