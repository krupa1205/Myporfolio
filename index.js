import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Optional for styling
import App from './App'; // Import the App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* Render the App component here */}
  </React.StrictMode>
);
