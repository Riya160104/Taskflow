import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchMembers();
  }, [id]);

  const fetchProject = async () => {
    const res = await api.get('/projects');
    const found = res.data.find(p => p.id === id);
    setProject(found);
  };
  const fetchTasks = async () => {
    const res = await api.get(`/tasks?projectId=${id}`);
    setTasks(res.data);
  };
  const fetchMembers = async () => {
    const res = await api.get(`/projects/${id}/members`);
    setMembers(res.data);
  };

  const createTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', { ...newTask, projectId: id });
    setShowForm(false);
    setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
    fetchTasks();
  };

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  if (!project) return <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>Loading...</div>;

  const pending = tasks.filter(t => t.status !== 'completed');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', marginBottom: '20px' }}>← Back to Projects</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>{project.name}</h1>
          <p style={{ color: '#6b7280' }}>{project.description}</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Task'}</button>
        )}
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>New Task</h3>
          <form onSubmit={createTask}>
            <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="input-modern auth-input" required />
            <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="input-modern auth-input" rows="2" />
            <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="input-modern auth-input" required />
            <select value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} className="input-modern auth-input" required>
              <option value="">Assign to</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Task</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '32px' }}>
        {pending.map(task => (
          <div key={task.id} className="task-item">
            <input type="checkbox" checked={false} onChange={(e) => updateStatus(task.id, e.target.checked ? 'completed' : 'pending')} className="task-checkbox" />
            <div className="task-title">{task.title}</div>
            <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
          </div>
        ))}
        {completed.map(task => (
          <div key={task.id} className="task-item" style={{ opacity: 0.7 }}>
            <input type="checkbox" checked={true} onChange={(e) => updateStatus(task.id, e.target.checked ? 'completed' : 'pending')} className="task-checkbox" />
            <div className="task-title completed">{task.title}</div>
            <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
          </div>
        ))}
        {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No tasks yet. Add your first task!</p>}
      </div>

      <div className="glass-card" style={{ padding: '28px', marginTop: '32px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>👥 Team Members</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {members.map(m => (
            <span key={m.id} style={{ background: '#f3e8ff', padding: '6px 16px', borderRadius: '40px', fontSize: '14px' }}>{m.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;