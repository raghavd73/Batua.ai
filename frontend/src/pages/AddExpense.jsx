import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitType: 'equal',
    participants: [],
    note: ''
  });

  useEffect(() => {
    const loadGroup = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/splitwise/groups/${id}`);
      setGroup(data.group);
      setForm((prev) => ({
        ...prev,
        paidBy: data.group.members[0] || '',
        participants: data.group.members || []
      }));
    };
    loadGroup();
  }, [id]);

  const toggleParticipant = (member) => {
    const exists = form.participants.includes(member);
    setForm({
      ...form,
      participants: exists
        ? form.participants.filter((m) => m !== member)
        : [...form.participants, member]
    });
  };

  const submitExpense = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/splitwise/expenses', {
      groupId: id,
      description: form.description,
      amount: Number(form.amount),
      paidBy: form.paidBy,
      splitType: form.splitType,
      participants: form.participants,
      note: form.note
    });

    navigate(`/splitwise/group/${id}`);
  };

  if (!group) return <div style={{ color: '#9ca3af' }}>Loading...</div>;

  return (
    <form
      onSubmit={submitExpense}
      style={{
        color: '#e5e7eb',
        background: '#020617',
        border: '1px solid #111827',
        borderRadius: 12,
        padding: 16,
        display: 'grid',
        gap: 12
      }}
    >
      <h1 style={{ fontSize: 24 }}>Add Expense</h1>

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={inputStyle}
      />

      <input
        placeholder="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        style={inputStyle}
      />

      <select
        value={form.paidBy}
        onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
        style={inputStyle}
      >
        {group.members.map((member) => (
          <option key={member} value={member}>{member}</option>
        ))}
      </select>

      <div>
        <div style={{ marginBottom: 8 }}>Split among:</div>
        {group.members.map((member) => (
          <label key={member} style={{ display: 'block', marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={form.participants.includes(member)}
              onChange={() => toggleParticipant(member)}
            />{' '}
            {member}
          </label>
        ))}
      </div>

      <textarea
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        style={{ ...inputStyle, minHeight: 90 }}
      />

      <button type="submit" style={buttonStyle}>Save Expense</button>
    </form>
  );
}

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #1f2937',
  background: '#0f172a',
  color: '#e5e7eb'
};

const buttonStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: 'none',
  background: '#22c55e',
  color: '#020617',
  fontWeight: 600,
  cursor: 'pointer'
};
