import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get('/projects');
    setProjects(res.data);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete project? All tasks will be lost.')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 className="auth-title" style={{ marginBottom: 0 }}>Your Projects</h1>
        {user?.role === 'admin' && (
          <Link to="/projects/new" className="btn-primary">+ New Project</Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
        {projects.map(proj => (
          <div key={proj.id} className="project-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 className="project-title">{proj.name}</h3>
              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(proj.id)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
              )}
            </div>
            <p className="project-desc">{proj.description || 'No description'}</p>
            <Link to={`/projects/${proj.id}`} className="project-link">View tasks →</Link>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
          <p>No projects yet. Create one to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;