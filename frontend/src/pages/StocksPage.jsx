// src/pages/StocksPage.jsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  tradePageStyle,
  tradeContentStyle,
  tradeTabBarStyle,
  makeTradeTabStyle,
} from "../styles/tradePageStyles";
import {
  fetchStockRecommendation,
  fetchStockDetails,
  fetchStockHistory,
} from "../lib/StocksApi";

const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5050";

const TAB_NAMES = [
  "Stocks",
  "Portfolio",
  "Suggestions",
  "Orders",
  "Watchlist",
  "Features",
];

const RECENTLY_VIEWED_STORAGE_KEY = "recentlyViewedStocks";

const RECENTLY_VIEWED_PLACEHOLDERS = [
  { slot: 0 },
  { slot: 1 },
  { slot: 2 },
  { name: "See more", isSeeMore: true },
];

const PLACEHOLDER_STOCKS = [
  {
    name: "Reliance Industries",
    ticker: "RELIANCE",
    price: "2945.20",
    change: "+0.94%",
  },
  {
    name: "Infosys",
    ticker: "INFY",
    price: "1688.30",
    change: "+1.22%",
  },
  {
    name: "Tata Consultancy Services",
    ticker: "TCS",
    price: "4120.40",
    change: "-0.58%",
  },
  {
    name: "HDFC Bank",
    ticker: "HDFCBANK",
    price: "1628.95",
    change: "+0.37%",
  },
  {
    name: "ICICI Bank",
    ticker: "ICICIBANK",
    price: "1214.15",
    change: "-0.42%",
  },
  {
    name: "State Bank of India",
    ticker: "SBIN",
    price: "782.50",
    change: "+0.81%",
  },
];

export default function StocksPage() {
  const [activeTab, setActiveTab] = useState("Stocks");

  return (
    <div style={tradePageStyle}>
      <div style={tradeContentStyle}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          Stocks
        </h1>

        <div style={tradeTabBarStyle}>
          {TAB_NAMES.map((name) => (
            <button
              key={name}
              style={makeTradeTabStyle(activeTab, name)}
              onClick={() => setActiveTab(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {renderActiveTabContent(activeTab)}
      </div>
    </div>
  );
}

function renderActiveTabContent(activeTab) {
  switch (activeTab) {
    case "Stocks":
      return <StocksTab />;
    case "Portfolio":
      return renderPortfolioTab();
    case "Suggestions":
      return <SuggestionsTab />;
    case "Orders":
      return renderOrdersTab();
    case "Watchlist":
      return renderWatchlistTab();
    case "Features":
      return renderFeaturesTab();
    default:
      return null;
  }
}

/* ===================== Stocks tab ===================== */

function StocksTab() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const searchRow = {
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    border: "2px solid #000",
    backgroundColor: "#fff",
    padding: "6px 10px",
  };

  const searchInput = {
    border: "none",
    outline: "none",
    fontSize: "14px",
    flex: 1,
  };

  const filterIcon = {
    marginLeft: "8px",
    fontSize: "20px",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #000",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    maxHeight: "260px",
    overflowY: "auto",
    zIndex: 20,
  };

  const dropdownItemStyle = {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
  };

  const dropdownItemSecondary = {
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: 600,
    marginTop: "2px",
  };

  const sectionWrapper = {
    marginTop: "24px",
  };

  const sectionTitle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  };

  const stockGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  };

  const stockCard = {
    borderRadius: "16px",
    padding: "14px 16px",
    backgroundColor: "#ffffff",
    color: "#111827",
    minHeight: "96px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #E5E7EB",
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
    cursor: "pointer",
  };

  const stockName = {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#111827",
  };

  const stockPrice = {
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
  };

  const stockChange = (positive) => ({
    fontSize: "12px",
    fontWeight: 600,
    marginTop: "4px",
    color: positive ? "#16A34A" : "#DC2626",
  });

  const seeMoreCardInner = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "6px",
    color: "#111827",
  };

  const pushRecentlyViewed = (stock) => {
    const payload = {
      ticker_symbol: stock?.ticker_symbol,
      company_name: stock?.company_name,
      exchange: stock?.exchange || "NSE",
      country: stock?.country || "India",
      currency: stock?.currency || "INR",
      last_price: stock?.price || stock?.last_price || "",
      change: stock?.change || "",
      change_pct: stock?.change_pct || "",
    };

    setRecentlyViewed((prev) => {
      const withoutDupes = prev.filter(
        (s) =>
          !(
            s.ticker_symbol === payload.ticker_symbol &&
            (s.exchange || "") === (payload.exchange || "")
          )
      );

      const next = [payload, ...withoutDupes].slice(0, 3);
      localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSelectStock = (stock) => {
    pushRecentlyViewed(stock);
    setShowDropdown(false);

    navigate(
  `/stocks/${encodeURIComponent(stock.ticker_symbol)}?exchange=${encodeURIComponent(stock.exchange || "NSE")}`,
  {
    state: {
      symbol: stock.ticker_symbol,
      exchange: stock.exchange || "NSE",
      stock,
    },
  }
);
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setLastQuery("");
      return;
    }

    if (trimmed === lastQuery) return;

    setLoading(true);
    setShowDropdown(true);
    setLastQuery(trimmed);

    try {
      const url = `${API_BASE}/api/stocks/search?q=${encodeURIComponent(
        trimmed
      )}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Stock search error:", res.status, text);
        setResults([]);
        return;
      }

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error calling stock search:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  const popularStocks = useMemo(() => PLACEHOLDER_STOCKS, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Stocks</h2>

      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div style={searchRow}>
          <span style={{ fontSize: "18px", marginRight: "8px" }}>🔍</span>
          <input
            style={searchInput}
            placeholder="Search stock name or ticker"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
            onBlur={handleBlur}
          />
          <span style={filterIcon}>➤</span>
        </div>

        {showDropdown && (
          <div style={dropdownStyle}>
            {loading && (
              <div style={{ padding: "8px 12px", fontSize: "13px" }}>
                Searching…
              </div>
            )}

            {!loading && results.length === 0 && (
              <div style={{ padding: "8px 12px", fontSize: "13px" }}>
                No matches found
              </div>
            )}

            {!loading &&
              results.map((stock) => (
                <button
                  key={`${stock.ticker_symbol}-${stock.exchange || "NSE"}`}
                  type="button"
                  style={dropdownItemStyle}
                  onClick={() => handleSelectStock(stock)}
                >
                  <div style={{ fontWeight: 700 }}>{stock.company_name}</div>
                  <div style={dropdownItemSecondary}>
                    {stock.ticker_symbol}
                    {stock.exchange ? ` • ${stock.exchange}` : ""}
                    {stock.country ? ` • ${stock.country}` : ""}
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      <div style={sectionWrapper}>
        <div style={sectionTitle}>Recently Viewed</div>

        <div style={stockGrid}>
          {RECENTLY_VIEWED_PLACEHOLDERS.map((s) => {
            if (s.isSeeMore) {
              return (
                <div key="see-more" style={stockCard}>
                  <div style={seeMoreCardInner}>
                    <div style={stockName}>See more</div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                      Explore all popular stocks on Batua →
                    </div>
                  </div>
                </div>
              );
            }

            const item = recentlyViewed[s.slot];

            if (!item) {
              return (
                <div
                  key={`empty-${s.slot}`}
                  style={{
                    ...stockCard,
                    opacity: 0.45,
                    borderStyle: "dashed",
                    cursor: "default",
                  }}
                >
                  <div style={stockName}>No recent stock</div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    Search and open a stock to see it here
                  </div>
                </div>
              );
            }

            const positive = Number(item.change ?? 0) >= 0;

            return (
              <div
                key={`${item.ticker_symbol}-${item.exchange || "NSE"}`}
                style={stockCard}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleSelectStock({
                    company_name: item.company_name,
                    ticker_symbol: item.ticker_symbol,
                    exchange: item.exchange,
                    country: item.country,
                    currency: item.currency,
                    price: item.last_price,
                    change: item.change,
                    change_pct: item.change_pct,
                  })
                }
              >
                <div style={stockName}>{item.company_name}</div>

                <div>
                  <div style={stockPrice}>
                    {item.last_price ? `${item.last_price} INR` : ""}
                  </div>
                  <div style={stockChange(positive)}>
                    {item.change_pct
                      ? `${item.change ?? ""} (${item.change_pct}%)`
                      : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "28px" }}>
        <div style={sectionTitle}>Popular Stocks</div>

        <div style={stockGrid}>
          {popularStocks.map((stock) => {
            const positive = !stock.change.includes("-");

            return (
              <div
                key={stock.ticker}
                style={stockCard}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleSelectStock({
                    company_name: stock.name,
                    ticker_symbol: stock.ticker,
                    exchange: "NSE",
                    country: "India",
                    currency: "INR",
                    price: stock.price,
                  })
                }
              >
                <div style={stockName}>{stock.name}</div>

                <div>
                  <div style={stockPrice}>{stock.price} INR</div>
                  <div style={stockChange(positive)}>{stock.change}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function MiniLineChart({ data = [] }) {
  const pointsData = data
    .map((item) => Number(item.close))
    .filter((value) => Number.isFinite(value));

  if (pointsData.length < 2) {
    return <div style={{ color: "#6B7280" }}>No chart data available.</div>;
  }

  const width = 900;
  const height = 260;
  const padding = 28;

  const min = Math.min(...pointsData);
  const max = Math.max(...pointsData);
  const range = max - min || 1;

  const points = pointsData
    .map((price, index) => {
      const x =
        padding +
        (index / Math.max(pointsData.length - 1, 1)) * (width - padding * 2);

      const y =
        height -
        padding -
        ((price - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const latest = pointsData[pointsData.length - 1];
  const first = pointsData[0];
  const returnPct = ((latest - first) / first) * 100;

  return (
    <div
      style={{
        marginTop: "18px",
        padding: "18px",
        borderRadius: "18px",
        background: "#111",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#888", fontWeight: 700 }}>
            30 DAY PRICE GRAPH
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800 }}>
            ₹{latest.toFixed(2)}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#888", fontWeight: 700 }}>30d return</div>
          <div style={{ fontSize: "20px", fontWeight: 800 }}>
            {returnPct >= 0 ? "+" : ""}
            {returnPct.toFixed(1)}%
          </div>
          <div style={{ color: "#888", marginTop: "8px" }}>High / Low</div>
          <div>
            ₹{max.toFixed(0)} / ₹{min.toFixed(0)}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "260px", marginTop: "12px" }}
      >
        <polyline
          fill="none"
          stroke="#7AC943"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}
/* ===================== Suggestions tab ===================== */
function SuggestionsTab() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("10000");
  const [risk, setRisk] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [selectedDetails, setSelectedDetails] = useState(null);
const [selectedHistory, setSelectedHistory] = useState([]);
const [stockPreviewLoading, setStockPreviewLoading] = useState(false);
const [stockSearch, setStockSearch] = useState("");
const [stockResults, setStockResults] = useState([]);
const [stockSearchLoading, setStockSearchLoading] = useState(false);
const [showStockDropdown, setShowStockDropdown] = useState(false);
const [selectedStock, setSelectedStock] = useState(null);

const handleStockSearch = async (e) => {
  const value = e.target.value;
  setStockSearch(value);
  setSelectedStock(null);
  setSymbol("");

  const trimmed = value.trim();

  if (trimmed.length < 2) {
    setStockResults([]);
    setShowStockDropdown(false);
    return;
  }

  try {
    setStockSearchLoading(true);
    setShowStockDropdown(true);

    const res = await fetch(
      `${API_BASE}/api/stocks/search?q=${encodeURIComponent(trimmed)}`
    );

    const data = await res.json();
    setStockResults(Array.isArray(data) ? data : []);
  } catch (err) {
    setStockResults([]);
  } finally {
    setStockSearchLoading(false);
  }
};

const handleSelectSuggestionStock = async (stock) => {
  setSelectedStock(stock);
  setStockSearch(`${stock.company_name} (${stock.ticker_symbol})`);
  setSymbol(stock.ticker_symbol);
  setShowStockDropdown(false);

  try {
    setStockPreviewLoading(true);

    const exchange = stock.exchange || "NSE";

    const [detailsData, historyData] = await Promise.all([
      fetchStockDetails(stock.ticker_symbol, exchange),
      fetchStockHistory(stock.ticker_symbol, exchange, "1mo"),
    ]);

    setSelectedDetails(detailsData);
    setSelectedHistory(Array.isArray(historyData) ? historyData : []);
  } catch (err) {
    setSelectedDetails(null);
    setSelectedHistory([]);
  } finally {
    setStockPreviewLoading(false);
  }
};
  const detectedSymbol = selectedStock?.ticker_symbol || symbol.trim().toUpperCase();
const detectedExchange = selectedStock?.exchange || "NSE";
  const suggestedSize = Math.round(Number(amount || 0) * 0.08);

  const handleGetBrief = async () => {
    if (!detectedSymbol) {
      setError("Enter a stock symbol first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRecommendation(null);

const data = await fetchStockRecommendation(detectedSymbol, detectedExchange);
      setRecommendation({
        symbol: detectedSymbol,
        amount,
        suggestedSize,
        risk,
        ...data,
      });
    } catch (err) {
      setError(err.message || "Failed to get recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
        AI Stock Suggestions
      </h2>

      <div className="stock-card">
        <div className="stock-card-header">
          <h2>Today's Question</h2>
        </div>

        <label>Enter a stock</label>

<div style={{ position: "relative", marginTop: "8px" }}>
  <input
    value={stockSearch}
    onChange={handleStockSearch}
    onFocus={() => {
      if (stockResults.length > 0) setShowStockDropdown(true);
    }}
    placeholder="Search stock name or ticker"
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: "14px",
      border: "1px solid #D1D5DB",
    }}
  />

  {showStockDropdown && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "#fff",
        border: "1px solid #D1D5DB",
        borderRadius: "14px",
        marginTop: "6px",
        zIndex: 50,
        maxHeight: "240px",
        overflowY: "auto",
      }}
    >
      {stockSearchLoading && (
        <div style={{ padding: "10px" }}>Searching...</div>
      )}

      {!stockSearchLoading && stockResults.length === 0 && (
        <div style={{ padding: "10px" }}>No stocks found</div>
      )}

      {!stockSearchLoading &&
        stockResults.map((stock) => (
          <button
            key={`${stock.ticker_symbol}-${stock.exchange || "NSE"}`}
            type="button"
            onClick={() => handleSelectSuggestionStock(stock)}
            style={{
              width: "100%",
              padding: "12px",
              textAlign: "left",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <strong>{stock.company_name}</strong>
            <div style={{ fontSize: "12px", color: "#16a34a" }}>
              {stock.ticker_symbol}
              {stock.exchange ? ` • ${stock.exchange}` : ""}
              {stock.country ? ` • ${stock.country}` : ""}
            </div>
          </button>
        ))}
    </div>
  )}
</div>
 {stockPreviewLoading && (
  <div className="stock-card" style={{ marginTop: "18px" }}>
    Loading stock preview...
  </div>
)}

{selectedDetails && !stockPreviewLoading && (
  <div style={{ marginTop: "18px" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
      }}
    >
      <div className="stock-metric">
        <span>Nifty 50</span>
        <strong>22,463</strong>
        <p style={{ color: "#16A34A", margin: 0 }}>+0.6% today</p>
      </div>

      <div className="stock-metric">
        <span>Sensex</span>
        <strong>73,902</strong>
        <p style={{ color: "#16A34A", margin: 0 }}>+0.5% today</p>
      </div>

      <div className="stock-metric">
        <span>{selectedDetails.ticker_symbol}</span>
        <strong>₹{Number(selectedDetails.quote?.last_price || 0).toFixed(2)}</strong>
        <p style={{ color: "#6B7280", margin: 0 }}>selected stock</p>
      </div>

      <div className="stock-metric">
        <span>Market signal</span>
        <strong>
          {Number(selectedDetails.quote?.change_pct || 0) >= 0 ? "Positive" : "Weak"}
        </strong>
        <p
          style={{
            color:
              Number(selectedDetails.quote?.change_pct || 0) >= 0
                ? "#16A34A"
                : "#DC2626",
            margin: 0,
          }}
        >
          {Number(selectedDetails.quote?.change_pct || 0).toFixed(2)}%
        </p>
      </div>
    </div>

    <MiniLineChart data={selectedHistory} />
  </div>
)}

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "16px" }}>
  <div>
    <label>Ticker</label>
    <input
      value={symbol}
      onChange={(e) => setSymbol(e.target.value)}
      placeholder="RELIANCE"
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #D1D5DB",
      }}
    />
  </div>

  <div>
    <label>Amount you may invest</label>
    <input
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="10000"
      type="number"
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #D1D5DB",
      }}
    />
  </div>
</div>

<div style={{ marginTop: "16px" }}>
  <label>Now choose your comfort level</label>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "8px" }}>
    {["careful", "balanced", "adventurous"].map((item) => (
      <button
        key={item}
        onClick={() => setRisk(item)}
        style={{
          padding: "14px",
          borderRadius: "14px",
          border: risk === item ? "2px solid #2563EB" : "1px solid #D1D5DB",
          background: risk === item ? "#EFF6FF" : "#fff",
          fontWeight: 700,
          cursor: "pointer",
          textTransform: "capitalize",
        }}
      >
        {item}
      </button>
    ))}
  </div>
</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "20px" }}>
          <div className="stock-metric">
            <span>Amount checked</span>
            <strong>₹{Number(amount || 0).toLocaleString("en-IN")}</strong>
          </div>
          <div className="stock-metric">
            <span>Suggested starting size</span>
            <strong>₹{suggestedSize.toLocaleString("en-IN")}</strong>
          </div>
          <div className="stock-metric">
            <span>Detected symbol</span>
            <strong>{detectedSymbol || "--"}</strong>
          </div>
        </div>

        {error && <div className="stock-error" style={{ marginTop: "14px" }}>{error}</div>}

        <button
          onClick={handleGetBrief}
          disabled={loading}
          style={{
            marginTop: "18px",
            padding: "14px 20px",
            borderRadius: "14px",
            border: "none",
            background: "#2563EB",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {loading ? "Checking..." : "Get Today's Brief"}
        </button>
      </div>

 {recommendation && (
  <div className="stock-card" style={{ marginTop: "20px" }}>
    <div className="stock-card-header">
      <h2>{recommendation.symbol} Agent Report</h2>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
      <div className="stock-metric stock-metric-wide">
        <span>Researcher Agent · {recommendation.symbol}</span>
        <strong>{recommendation.researcher?.label || "Neutral"}</strong>
        <div style={{ marginTop: "10px", fontSize: "24px", fontWeight: 800 }}>
          {recommendation.researcher?.confidence ?? "--"}%
        </div>
        <p>{recommendation.researcher?.summary}</p>
        <div>
          Bull: {recommendation.researcher?.bullScore ?? "--"} | Bear:{" "}
          {recommendation.researcher?.bearScore ?? "--"}
        </div>
        {(recommendation.researcher?.reasons || []).map((reason, index) => (
          <p key={index}>– {reason}</p>
        ))}
      </div>

      <div className="stock-metric stock-metric-wide">
        <span>Analyst Agent · {recommendation.symbol}</span>
        <p>P/E Ratio<br /><strong>{recommendation.analyst?.peRatio ?? "--"}</strong></p>
        <p>5-day momentum<br /><strong>{recommendation.analyst?.momentum5d ?? "--"}</strong></p>
        <p>AI confidence<br /><strong>{recommendation.analyst?.confidence ?? "--"} / 100</strong></p>
        <p>Short term outlook<br /><strong>{recommendation.analyst?.outlook ?? "--"}</strong></p>
        {(recommendation.analyst?.notes || []).map((note, index) => (
          <p key={index}>– {note}</p>
        ))}
      </div>
    </div>

    <div className="stock-metric stock-metric-wide" style={{ marginTop: "16px" }}>
      <span>Risk Manager · Your profile: {risk.toUpperCase()} risk</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "12px" }}>
        <div>
          <span>Suitability</span>
          <strong>{recommendation.riskManager?.suitability || "--"}</strong>
        </div>
        <div>
          <span>Watch out for</span>
          <strong>{recommendation.riskManager?.warning || "--"}</strong>
        </div>
        <div>
          <span>Opportunity</span>
          <strong>{recommendation.riskManager?.opportunity || "--"}</strong>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: "18px",
      padding: "18px",
      borderRadius: "16px",
      background: "#DCFCE7",
      color: "#14532D",
      fontWeight: 800,
      fontSize: "18px",
    }}>
      What to do today: {recommendation.riskManager?.action || "Watch before investing."}
    </div>
  </div>
)}
    </div>
  );
}
/* ===================== Other tabs ===================== */

function renderPortfolioTab() {
  const card = {
    backgroundColor: "#fff",
    borderRadius: "18px",
    border: "2px solid #b5c7f2",
    padding: "16px",
    marginBottom: "16px",
  };

  const sectionTitle = {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "8px",
  };

  const label = {
    fontSize: "16px",
    marginBottom: "4px",
  };

  const chartBox = {
    marginTop: "12px",
    height: "220px",
    borderRadius: "18px",
    border: "2px solid #b5c7f2",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const periodRow = {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginTop: "16px",
    fontWeight: 700,
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Portfolio</h2>

      <div style={card}>
        <div style={sectionTitle}>My Events</div>
        <div
          style={{
            ...card,
            marginBottom: 0,
            borderRadius: "18px",
            border: "2px solid #000",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={label}>Holdings (5)</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                $ 5,676,433
              </div>
            </div>
            <div style={{ fontSize: "36px" }}>📈</div>
          </div>
          <div style={{ marginTop: "12px" }}>
            <div style={label}>1D Returns</div>
            <div style={label}>Total Returns</div>
            <div style={label}>Invested</div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Total Value</div>
        <div
          style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}
        >
          $ 5,676,433
        </div>
        <div style={label}>Loss</div>
        <div style={label}>Profit</div>

        <div style={chartBox}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: 8 }}>
            Change%
          </div>
          <div style={{ fontSize: "14px", opacity: 0.6 }}>
            Chart placeholder
          </div>
          <div style={periodRow}>
            <span>W</span>
            <span>M</span>
            <span>3M</span>
            <span>6M</span>
            <span>Y</span>
          </div>
        </div>
      </div>
    </div>
  );
  
}

function renderOrdersTab() {
  const itemStyle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Orders</h2>

      <div style={itemStyle}>Open Orders</div>
      <div style={itemStyle}>Executed Orders</div>
      <div style={itemStyle}>Cancelled Orders</div>
    </div>
  );
}

function renderWatchlistTab() {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Watchlist</h2>
      <p style={{ textAlign: "center" }}>
        Your watchlisted stocks will appear here.
      </p>
    </div>
  );
}

function renderFeaturesTab() {
  const itemStyle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Features</h2>
      <div style={itemStyle}>IPO’s</div>
      <div style={itemStyle}>Intraday</div>
      <div style={itemStyle}>Events</div>
      <div style={itemStyle}>MTF</div>
      <div style={itemStyle}>ETF</div>
      <div style={itemStyle}>Gold Bonds</div>
    </div>
  );
}