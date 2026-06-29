import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If not logged in, show the login page
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Route to the appropriate dashboard based on role
  return (
    <BrowserRouter>
      <Routes>
        {user.role === 'admin' && (
          <Route path="/*" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
        )}
        {user.role === 'faculty' && (
          <Route path="/*" element={<FacultyDashboard user={user} onLogout={handleLogout} />} />
        )}
        {user.role === 'student' && (
          <Route path="/*" element={<StudentDashboard user={user} onLogout={handleLogout} />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
