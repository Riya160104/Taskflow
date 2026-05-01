import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import TodayView from './pages/TodayView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
            <Route path="/inbox" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
            <Route path="/today" element={<PrivateRoute><><Navbar /><TodayView /></></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><><Navbar /><Projects /></></PrivateRoute>} />
            <Route path="/projects/new" element={<PrivateRoute adminOnly><><Navbar /><CreateProject /></></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><><Navbar /><ProjectDetail /></></PrivateRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;