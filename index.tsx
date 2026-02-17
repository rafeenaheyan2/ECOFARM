
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Main entry point with defensive bootstrapping to handle "white screen" issues.
 */
const bootstrap = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error("Critical Error: Root element '#root' not found in DOM.");
      return;
    }

    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("EcoDairy Farm App Initialized Successfully");
  } catch (error) {
    console.error("Failed to bootstrap the React application:", error);
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `<div style="padding: 2rem; color: red; font-family: sans-serif;">
        <h2>Bootstrap Error</h2>
        <p>${error instanceof Error ? error.message : String(error)}</p>
      </div>`;
    }
  }
};

// Ensure DOM is ready if script is not deferred
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
