import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get('/dashboard');
    setStats(res.data.stats);
    setRecentTasks(res.data.recentTasks);
  };

  const statItems = [
    { label: 'Total Tasks', key: 'total' },
    { label: 'Pending', key: 'pending' },
    { label: 'In Progress', key: 'inProgress' },
    { label: 'Completed', key: 'completed' },
    { label: 'Overdue', key: 'overdue' },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea, #764ba2)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>Here's what's happening with your tasks</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {statItems.map(item => (
          <div key={item.key} className="stat-card">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
            <div className="stat-number">{stats?.[item.key] ?? 0}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No tasks yet. Create your first task!</p>
        ) : (
          recentTasks.map(task => (
            <div key={task.id} className="task-item">
              <input type="checkbox" checked={task.status === 'completed'} readOnly className="task-checkbox" />
              <div className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>{task.title}</div>
              <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;