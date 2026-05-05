export default function ExpenseList({ expenses }) {
  return (
    <div
      style={{
        background: '#020617',
        border: '1px solid #111827',
        borderRadius: 12,
        padding: 16
      }}
    >
      <h3 style={{ color: '#e5e7eb', marginBottom: 12 }}>Expenses</h3>

      {expenses.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>No expenses yet.</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense._id}
            style={{
              borderBottom: '1px solid #111827',
              padding: '12px 0',
              color: '#e5e7eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{expense.description}</strong>
              <span>₹{expense.amount?.toFixed(2)}</span>
            </div>

            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              Paid by {expense.paidBy} • {new Date(expense.date).toLocaleDateString()}
            </div>

            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
              Split among: {expense.participants?.join(', ')}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
