import { useState } from 'react';
import { exercisesAPI } from '../services/api';

export default function ExerciseSearch({ onDrop, blocks }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ muscle_group: '', difficulty: '' });
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('');

  const search = async () => {
    setLoading(true);
    const res = await exercisesAPI.search({ search: query, ...filters });
    setExercises(res.data.data);
    setLoading(false);
  };

  const handleAdd = (exercise) => {
    if (!selectedBlock) return alert('Please select a block first!');
    onDrop(selectedBlock, exercise);
  };

  return (
    <div>
      <h3 style={styles.title}>Exercise Library</h3>

      <select style={styles.input} value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)}>
        <option value="">Select a block...</option>
        {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <input style={styles.input} placeholder="Search exercises..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />

      <select style={styles.input} value={filters.muscle_group} onChange={e => setFilters({...filters, muscle_group: e.target.value})}>
        <option value="">All muscle groups</option>
        <option value="chest">Chest</option>
        <option value="back">Back</option>
        <option value="legs">Legs</option>
        <option value="shoulders">Shoulders</option>
        <option value="arms">Arms</option>
        <option value="core">Core</option>
      </select>

      <select style={styles.input} value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value})}>
        <option value="">All levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button style={styles.btn} onClick={search}>Search</button>

      <div style={styles.list}>
        {loading && <p style={styles.meta}>Searching...</p>}
        {exercises.map(ex => (
          <div key={ex.id} style={styles.card}>
            <div>
              <p style={styles.name}>{ex.name}</p>
              <p style={styles.meta}>{ex.muscleGroup} · {ex.difficulty}</p>
            </div>
            <button style={styles.addBtn} onClick={() => handleAdd(ex)}>+ Add</button>
          </div>
        ))}
        {exercises.length === 0 && !loading && (
          <p style={styles.meta}>Search for exercises above</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { margin: '0 0 12px', color: '#1a1a2e' },
  input: { width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px' },
  btn: { width: '100%', padding: '8px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  card: { background: 'white', padding: '10px', borderRadius: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { margin: '0 0 2px', fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e' },
  meta: { margin: 0, fontSize: '11px', color: '#999' },
  addBtn: { padding: '4px 10px', background: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' },
};