import { useState, useEffect } from 'react';
import api from '../services/api';

const TodayView = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    const res = await api.get('/tasks');
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = res.data.filter(t => t.dueDate?.split('T')[0] === today);
    setTasks(todayTasks);
  };

  const updateStatus = async (id, completed) => {
    const status = completed ? 'completed' : 'pending';
    await api.put(`/tasks/${id}`, { status });
    fetchToday();
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="auth-title">Today's Tasks</h1>
        <p className="auth-sub">{new Date().toDateString()}</p>
      </div>
      <div className="glass-card" style={{ padding: '32px' }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No tasks due today. Relax!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <input type="checkbox" checked={task.status === 'completed'} onChange={(e) => updateStatus(task.id, e.target.checked)} className="task-checkbox" />
              <div className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>{task.title}</div>
              <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayView;