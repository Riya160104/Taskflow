import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your account</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-modern auth-input" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-modern auth-input" required />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
        </div>
      </div>
    </div>
  );
};

export default Login;