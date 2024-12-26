import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ArtScreener from './components/ArtScreener';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtScreener apiUrl={import.meta.env.VITE_API_URL} />
  </StrictMode>
);