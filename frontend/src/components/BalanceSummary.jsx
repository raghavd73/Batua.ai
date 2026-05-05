export default function BalanceSummary({ balances }) {
  return (
    <div
      style={{
        background: '#020617',
        border: '1px solid #111827',
        borderRadius: 12,
        padding: 16
      }}
    >
      <h3 style={{ color: '#e5e7eb', marginBottom: 12 }}>Balances</h3>

      {balances.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>No balances yet.</p>
      ) : (
        balances.map((item) => (
          <div
            key={item.user}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #111827',
              color: '#e5e7eb'
            }}
          >
            <span>{item.user}</span>
            <span style={{ color: item.balance >= 0 ? '#22c55e' : '#f87171' }}>
              ₹{item.balance.toFixed(2)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
