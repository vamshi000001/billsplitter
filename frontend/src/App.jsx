import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoomDetail from './pages/RoomDetail';
import Landing from './pages/Landing';
import RoommateLogin from './pages/RoommateLogin';
import AppAdminLogin from './pages/AppAdminLogin';
import AppAdminDashboard from './pages/AppAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddRoommate from './pages/AddRoommate';
import AcceptInvite from './pages/AcceptInvite';
import Settings from './pages/Settings';

import AIHelper from './components/AIHelper';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        <AIHelper />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/roommate-login" element={<RoommateLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/create-room" element={<Navigate to="/register" />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id"
              element={
                <ProtectedRoute>
                  <RoomDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id/add-member"
              element={
                <ProtectedRoute>
                  <AddRoommate />
                </ProtectedRoute>
              }
            />
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route path="/appadminlogin" element={<AppAdminLogin />} />
            <Route path="/app-admin/dashboard" element={<AppAdminDashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
