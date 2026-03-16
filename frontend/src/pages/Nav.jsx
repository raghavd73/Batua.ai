// Navbar.jsx
export default function Navbar() {
  return (
    <header className="h-14 px-4 md:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold">
          B
        </div>
        <span className="font-semibold text-lg tracking-tight">Batua Invest</span>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        {/* you will plug your StockSearch here later */}
        <input
          className="w-full bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Search stocks (e.g. TCS, RELIANCE)…"
        />
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500">
          Login
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-800" />
      </div>
    </header>
  );
}
