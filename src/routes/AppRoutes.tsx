import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Candidates from '../pages/Candidates/Candidates';
import Jobs from '../pages/Jobs/Jobs';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          {/* Protected Routes */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="candidates" 
            element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            } 
          />
          
          {/* Unprotected but contains protected actions inside */}
          <Route path="jobs" element={<Jobs />} />
        </Route>
        
        {/* Catch-All 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
