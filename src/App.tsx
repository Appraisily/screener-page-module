import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import { useTawkTo } from './hooks/useTawkTo';

function App() {
  useTawkTo();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analyze/:sessionId" element={<AnalyzePage />} />
    </Routes>
  );
}

export default App;