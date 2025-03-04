import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';

function App() {
  useEffect(() => {
    console.log('App component mounted');
    return () => console.log('App component unmounted');
  }, []);

  // Adding a logging wrapper for each component
  const LoggedHomePage = () => {
    useEffect(() => {
      console.log('HomePage component mounted');
      return () => console.log('HomePage component unmounted');
    }, []);
    return <HomePage />;
  };

  const LoggedAnalyzePage = (props: any) => {
    useEffect(() => {
      console.log('AnalyzePage component mounted with params:', props);
      return () => console.log('AnalyzePage component unmounted');
    }, [props]);
    return <AnalyzePage {...props} />;
  };

  // Log the current URL path
  useEffect(() => {
    console.log('Current URL path:', window.location.pathname);
    console.log('Current URL search:', window.location.search);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoggedHomePage />} />
      <Route path="/analyze/:sessionId" element={<LoggedAnalyzePage />} />
    </Routes>
  );
}

export default App;