import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught cross-origin or third-party iframe errors from bubbling
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || !event.message) {
      // Suppress cross-origin opaque script error from bubbling up to dev harness
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Prevent unhandled promise rejections from killing execution
    event.preventDefault();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
