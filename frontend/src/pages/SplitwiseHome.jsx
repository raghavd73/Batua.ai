import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SplitwiseHome() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    members: 'Raghav,Aman,Priya'
  });

  const fetchGroups = async () => {
    const { data } = await axios.get('http://localhost:5000/api/splitwise/groups');
    setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/splitwise/groups', {
      name: form.name,
      description: form.description,
      members: form.members.split(',').map((m) => m.trim()),
      createdBy: 'Raghav'
    });
    setForm({ name: '', description: '', members: 'Raghav,Aman,Priya' });
    fetchGroups();
  };

  return (
    <div style={{ color: '#e5e7eb', display: 'grid', gap: 20 }}>
      <h1 style={{ fontSize: 24 }}>Shared Expenses</h1>

      <form
        onSubmit={createGroup}
        style={{
          background: '#020617',
          border: '1px solid #111827',
          borderRadius: 12,
          padding: 16,
          display: 'grid',
          gap: 12
        }}
      >
        <input
          placeholder="Group name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Members comma separated"
          value={form.members}
          onChange={(e) => setForm({ ...form, members: e.target.value })}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Create Group</button>
      </form>

      <div style={{ display: 'grid', gap: 12 }}>
        {groups.map((group) => (
          <Link
            key={group._id}
            to={`/splitwise/group/${group._id}`}
            style={{
              background: '#020617',
              border: '1px solid #111827',
              borderRadius: 12,
              padding: 16,
              color: '#e5e7eb',
              textDecoration: 'none'
            }}
          >
            <div style={{ fontWeight: 600 }}>{group.name}</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>{group.description}</div>
            <div style={{ fontSize: 12, color: '#22c55e', marginTop: 8 }}>
              Members: {group.members.join(', ')}
            </div>
          </Link>
        ))}
      </div>
    </div>
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
