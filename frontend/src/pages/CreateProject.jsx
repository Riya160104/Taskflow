import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description: desc });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '60px' }}>
      <div className="glass-card" style={{ padding: '40px' }}>
        <h1 className="auth-title" style={{ textAlign: 'center' }}>✨ New Project</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} className="input-modern auth-input" required />
          <textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} rows="4" className="input-modern auth-input" style={{ resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" onClick={() => navigate('/projects')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;