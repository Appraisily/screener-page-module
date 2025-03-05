import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId');

  // If we have a sessionId in query params, redirect to the analyze page
  if (sessionId && location.pathname === '/') {
    return <Navigate to={`/analyze/${sessionId}`} replace />;
  }

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/analyze/:sessionId" element={<AnalyzePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;