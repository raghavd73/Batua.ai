export default function Dashboard() {
  const summary = {
    invested: 150000,
    currentValue: 168500,
    pnl: 18500,
    estTax: 3200
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: '#e5e7eb' }}>Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <Card title="Invested" value={`₹${summary.invested.toLocaleString()}`} />
        <Card title="Current Value" value={`₹${summary.currentValue.toLocaleString()}`} />
        <Card title="P&L" value={`₹${summary.pnl.toLocaleString()}`} color="#22c55e" />
        <Card title="Estimated Tax (this FY)" value={`₹${summary.estTax.toLocaleString()}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: '#e5e7eb', marginBottom: 8 }}>Portfolio value</h2>
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13 }}>
            (Add chart here later)
          </div>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: '#e5e7eb', marginBottom: 8 }}>Tax summary</h2>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            Once you add transactions, we'll show STCG, LTCG and tax-saving suggestions here.
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16 }}>
      <span style={{ fontSize: 12, color: '#94a3b8' }}>{title}</span>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600, color: color || '#e5e7eb' }}>{value}</div>
    </div>
  );
}
