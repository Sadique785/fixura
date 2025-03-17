  import { useState } from 'react'
  import reactLogo from './assets/react.svg'
  import viteLogo from '/vite.svg'
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import LoginPage from "./pages/Login";
  import RegisterPage from "./pages/Register"; // New
  import Dashboard from "./pages/Dashboard";
  import TicketDetail from "./pages/TicketDetail";
  import AdminPanel from "./pages/AdminPanel";
  import NotFound from "./pages/NotFound";
  import HomePage from './pages/HomePage';
  import { Toaster } from 'react-hot-toast';
  import ProtectedRoute from './protected/ProtectedRoute';




  function App() {
    
    return (
      <>

    <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              padding: '14px',
              background: '#f1f5f9', // Light gray-blue background
              color: '#1e293b', // Dark blue-gray text
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow
            },
            success: {
              style: {
                background: '#d1fae5', // Light green
                color: '#065f46', // Dark green text
              },
            },
            error: {
              style: {
                background: '#fb8c74', // Light red
                color: '#991b1b', // Dark red text
              },
            },
            info: {
              style: {
                background: '#dbeafe', // Light blue
                color: '#1e40af', // Dark blue text
              },
            },
            warning: {
              style: {
                background: '#d1fae5', // Light green (same as success)
                color: '#065f46', // Dark green text (same as success)
              },
            },
          }}
        />

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 


          <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
        path="/ticket/:id"
        element={
          <ProtectedRoute>
                <TicketDetail />
          </ProtectedRoute>

        }
        />

      <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      </>
    );

  }

  export default App
