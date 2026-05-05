import React, { useMemo } from "react";

export default function StockChart({ candles = [] }) {
  const data = useMemo(() => {
    return candles
      .map((c) => ({
        time: c.time,
        close: Number(c.close),
      }))
      .filter((c) => Number.isFinite(c.close));
  }, [candles]);

  if (data.length === 0) {
    return <div className="stock-muted">No chart data available.</div>;
  }

  const width = 900;
  const height = 320;
  const padding = 32;

  const prices = data.map((d) => d.close);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x =
        padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((d.close - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const latest = data[data.length - 1]?.close;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ marginBottom: "10px", fontWeight: 700 }}>
        Latest: ₹{latest.toFixed(2)}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          height: "320px",
          background: "#ffffff",
          borderRadius: "14px",
        }}
      >
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        <text x={padding} y={24} fontSize="14" fill="#6b7280">
          ₹{max.toFixed(2)}
        </text>

        <text x={padding} y={height - 8} fontSize="14" fill="#6b7280">
          ₹{min.toFixed(2)}
        </text>
      </svg>
    </div>
  );
}