import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');
  const intervalRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (showTaskForm) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => fetchMembers(true), 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [showTaskForm]);

  const fetchProject = async () => {
    try {
      const res = await api.get('/projects');
      const found = res.data.find(p => p.id === id);
      setProject(found);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${id}`);
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMembers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/projects/${id}/members`);
      setMembers(res.data);
      setDebug(`Members: ${res.data.length} found – ${res.data.map(m => m.email).join(', ')}`);
    } catch (err) {
      console.error(err);
      setDebug(`Error: ${err.response?.status}`);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.assignedTo) {
      alert('Please select a member');
      return;
    }
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
      fetchTasks();
    } catch (err) { alert('Failed to create task'); }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task permanently?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    if (!newMemberEmail.trim()) {
      setMemberError('Please enter an email');
      return;
    }
    try {
      const searchRes = await api.get(`/users/search?email=${encodeURIComponent(newMemberEmail)}`);
      const foundUser = searchRes.data;
      await api.post(`/projects/${id}/members`, { userId: foundUser.id });
      alert(`Member ${foundUser.name} added!`);
      setNewMemberEmail('');
      fetchMembers();
    } catch (err) {
      setMemberError(err.response?.data?.message || 'Failed to add member');
    }
  };

  if (!project) return <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>Loading...</div>;

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', marginBottom: '20px' }}>← Back</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="auth-title">{project.name}</h1>
          <p style={{ color: '#6b7280' }}>{project.description || 'No description'}</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
            {showTaskForm ? 'Cancel' : '+ Add Task'}
          </button>
        )}
      </div>

      <div style={{ background: '#eef2ff', padding: '8px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{debug || 'Loading...'}</span>
        <button onClick={() => fetchMembers()} style={{ background: '#c7d2fe', border: 'none', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' }}>⟳ Refresh</button>
      </div>

      {showTaskForm && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3>Create New Task</h3>
          {members.length === 0 && <div style={{ color: 'red' }}>No team members yet. Add a member first.</div>}
          <form onSubmit={handleCreateTask}>
            <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="input-modern auth-input" required />
            <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} rows="2" className="input-modern auth-input" />
            <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="input-modern auth-input" required />
            <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} className="input-modern auth-input" required>
              <option value="">-- Select a member --</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
            </select>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={members.length === 0}>Create Task</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '32px' }}>
        {pendingTasks.map(task => (
          <div key={task.id} className="task-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <input type="checkbox" onChange={e => handleUpdateStatus(task.id, e.target.checked ? 'completed' : 'pending')} className="task-checkbox" />
              <div className="task-title">{task.title}</div>
              <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
            )}
          </div>
        ))}
        {completedTasks.map(task => (
          <div key={task.id} className="task-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <input type="checkbox" checked={true} onChange={e => handleUpdateStatus(task.id, e.target.checked ? 'completed' : 'pending')} className="task-checkbox" />
              <div className="task-title completed">{task.title}</div>
              <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
            )}
          </div>
        ))}
        {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No tasks yet. Click "Add Task".</p>}
      </div>

      <div className="glass-card" style={{ padding: '28px', marginTop: '32px' }}>
        <h3>Team Members</h3>
        {user?.role === 'admin' && (
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input type="email" placeholder="Member email" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} className="input-modern" style={{ flex: 1 }} required />
            <button type="submit" className="btn-primary">Add Member</button>
          </form>
        )}
        {memberError && <p style={{ color: 'red', marginBottom: '12px' }}>{memberError}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {members.map(m => <span key={m.id} style={{ background: '#f3e8ff', padding: '6px 16px', borderRadius: '40px' }}>{m.name} ({m.email})</span>)}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;