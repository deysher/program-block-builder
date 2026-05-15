import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💪 Program Block Builder</h2>
        <h3 style={styles.subtitle}>Create Account</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.btn} type="submit">Create Account</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
  card: { background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
  title: { textAlign: 'center', color: '#1a1a2e', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '24px', fontWeight: 'normal' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '12px', fontSize: '14px' },
  link: { textAlign: 'center', marginTop: '16px', fontSize: '14px' },
};