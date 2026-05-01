import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="logo">TaskFlow</Link>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/today">Today</Link>
            <Link to="/projects">Projects</Link>
            {user?.role === 'admin' && <Link to="/projects/new">+ Create</Link>}
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;