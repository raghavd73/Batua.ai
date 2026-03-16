// Dashboard.jsx
export default function Dashboard() {
  // later you will fetch these from backend
  const summary = {
    invested: 150000,
    currentValue: 168500,
    pnl: 18500,
    estTax: 3200
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold">Overview</h1>

      {/* Top cards – similar to Groww’s portfolio cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Invested" value={`₹${summary.invested.toLocaleString()}`} />
        <Card title="Current value" value={`₹${summary.currentValue.toLocaleString()}`} />
        <Card
          title="P&L"
          value={`₹${summary.pnl.toLocaleString()}`}
          accent={summary.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}
        />
        <Card title="Estimated tax (this FY)" value={`₹${summary.estTax.toLocaleString()}`} />
      </div>

      {/* Placeholder for chart and holdings like Groww */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-medium mb-2">Portfolio value</h2>
          <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
            (Add chart here later)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-medium mb-2">Tax summary</h2>
          <p className="text-xs text-slate-400">
            Once you add transactions, we’ll show STCG, LTCG and tax‑saving suggestions here.
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, accent }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
      <span className="text-xs text-slate-400">{title}</span>
      <span className={`mt-1 text-lg font-semibold ${accent || ''}`}>{value}</span>
    </div>
  );
}
