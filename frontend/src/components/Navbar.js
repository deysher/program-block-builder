import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { trainer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>💪 Program Block Builder</Link>
      {trainer && (
        <div style={styles.right}>
          <span style={styles.name}>Hi, {trainer.name}</span>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a1a2e', color: 'white' },
  brand: { color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  name: { color: '#ccc' },
  btn: { padding: '8px 16px', background: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};