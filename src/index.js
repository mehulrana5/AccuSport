import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'

const root = createRoot(document.getElementById('root'));

console.log(window.location.origin);
root.render(
  <App />
);