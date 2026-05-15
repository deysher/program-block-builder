import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', duration_weeks: '' });
  const { trainer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    programsAPI.getAll().then(res => setPrograms(res.data.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await programsAPI.create(form);
    setPrograms([res.data, ...programs]);
    setShowForm(false);
    setForm({ name: '', description: '', duration_weeks: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Programs</h2>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>+ New Program</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input style={styles.input} placeholder="Program Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Duration (weeks)" value={form.duration_weeks} onChange={e => setForm({...form, duration_weeks: e.target.value})} />
          <button style={styles.btn} type="submit">Create</button>
        </form>
      )}

      <div style={styles.grid}>
        {programs.map(p => (
          <div key={p.id} style={styles.card} onClick={() => navigate(`/programs/${p.id}`)}>
            <h3 style={styles.cardTitle}>{p.name}</h3>
            <p style={styles.cardDesc}>{p.description || 'No description'}</p>
            {p.duration_weeks && <p style={styles.cardMeta}>{p.durationWeeks} weeks</p>}
          </div>
        ))}
        {programs.length === 0 && <p style={styles.empty}>No programs yet. Create your first one!</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  btn: { padding: '10px 20px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', },
  cardTitle: { margin: '0 0 8px', color: '#1a1a2e' },
  cardDesc: { color: '#666', fontSize: '14px', margin: '0 0 8px' },
  cardMeta: { color: '#999', fontSize: '12px', margin: 0 },
  empty: { color: '#999', gridColumn: '1/-1' },
};