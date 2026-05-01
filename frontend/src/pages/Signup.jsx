import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Start managing tasks beautifully</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input-modern auth-input" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-modern auth-input" required />
          <input type="password" placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} className="input-modern auth-input" required />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-modern auth-input">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign Up</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;