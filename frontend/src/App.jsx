import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const RoomDetail = React.lazy(() => import('./pages/RoomDetail'));
const Landing = React.lazy(() => import('./pages/Landing'));
const RoommateLogin = React.lazy(() => import('./pages/RoommateLogin'));
const AppAdminLogin = React.lazy(() => import('./pages/AppAdminLogin'));
const AppAdminDashboard = React.lazy(() => import('./pages/AppAdminDashboard'));
const AddRoommate = React.lazy(() => import('./pages/AddRoommate'));
const AcceptInvite = React.lazy(() => import('./pages/AcceptInvite'));
const Settings = React.lazy(() => import('./pages/Settings'));

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
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
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
