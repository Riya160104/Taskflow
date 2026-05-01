import { useState, useEffect } from 'react';
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
  const [debugInfo, setDebugInfo] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchMembers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get('/projects');
      const found = res.data.find(p => p.id === id);
      setProject(found);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setDebugInfo('Fetching members...');
      const res = await api.get(`/projects/${id}/members`);
      console.log('Members API response:', res.data);
      setDebugInfo(`Found ${res.data.length} members: ${JSON.stringify(res.data.map(m => m.email))}`);
      setMembers(res.data);
      if (res.data.length === 0) {
        setDebugInfo(prev => prev + ' (No members in this project)');
      }
    } catch (err) {
      console.error(err);
      setDebugInfo(`Error fetching members: ${err.response?.status} ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.assignedTo) {
      alert('Please select a member to assign this task');
      return;
    }
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    if (!newMemberEmail.trim()) {
      setMemberError('Please enter an email address');
      return;
    }
    try {
      const searchRes = await api.get(`/users/search?email=${encodeURIComponent(newMemberEmail)}`);
      const foundUser = searchRes.data;
      await api.post(`/projects/${id}/members`, { userId: foundUser.id });
      alert(`Member ${foundUser.name} added successfully!`);
      setNewMemberEmail('');
      fetchMembers();
    } catch (err) {
      console.error(err);
      setMemberError(err.response?.data?.message || 'Failed to add member');
    }
  };

  if (!project) {
    return <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>Loading project...</div>;
  }

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <button
        onClick={() => navigate('/projects')}
        style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Back to Projects
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '8px' }}>{project.name}</h1>
          <p style={{ color: '#6b7280' }}>{project.description || 'No description'}</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
            {showTaskForm ? 'Cancel' : '+ Add Task'}
          </button>
        )}
      </div>

      {/* Debug Info Panel */}
      <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '12px', fontFamily: 'monospace' }}>
        <strong>Debug:</strong> {debugInfo}
        <button onClick={fetchMembers} style={{ marginLeft: '12px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Refresh Members</button>
      </div>

      {showTaskForm && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>Create New Task</h3>
          {members.length === 0 && !loading && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#fee2e2', borderRadius: '12px', color: '#b91c1c' }}>
              ⚠️ No team members in this project. Please add at least one member before creating tasks.
            </div>
          )}
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="input-modern auth-input"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="input-modern auth-input"
              rows="2"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="input-modern auth-input"
              required
            />
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
              className="input-modern auth-input"
              required
              disabled={members.length === 0}
            >
              <option value="">-- Select a member --</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={members.length === 0}
            >
              Create Task
            </button>
            {members.length === 0 && !loading && (
              <p style={{ fontSize: '12px', marginTop: '8px', textAlign: 'center', color: '#e11d48' }}>
                You need to add members to this project first.
              </p>
            )}
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '32px' }}>
        {pendingTasks.length > 0 && (
          <>
            <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Tasks</h3>
            {pendingTasks.map(task => (
              <div key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={(e) => handleUpdateStatus(task.id, e.target.checked ? 'completed' : 'pending')}
                  className="task-checkbox"
                />
                <div className="task-title">{task.title}</div>
                <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </>
        )}
        {completedTasks.length > 0 && (
          <>
            <h3 style={{ fontWeight: '600', marginTop: '24px', marginBottom: '16px' }}>Completed</h3>
            {completedTasks.map(task => (
              <div key={task.id} className="task-item" style={{ opacity: 0.7 }}>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={(e) => handleUpdateStatus(task.id, e.target.checked ? 'completed' : 'pending')}
                  className="task-checkbox"
                />
                <div className="task-title completed">{task.title}</div>
                <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </>
        )}
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
            No tasks yet. Click "Add Task" to get started.
          </p>
        )}
      </div>

      <div className="glass-card" style={{ padding: '28px', marginTop: '32px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Team Members</h3>
        {user?.role === 'admin' && (
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="input-modern"
              style={{ flex: 1, minWidth: '200px' }}
              required
            />
            <button type="submit" className="btn-primary">Add Member</button>
          </form>
        )}
        {memberError && <p style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{memberError}</p>}
        {loading && <p>Loading members...</p>}
        {!loading && members.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No members yet. Admin can add members above.</p>
        )}
        {!loading && members.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {members.map(m => (
              <span key={m.id} style={{ background: '#f3e8ff', padding: '6px 16px', borderRadius: '40px', fontSize: '14px' }}>
                {m.name} ({m.email})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;