import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';
// restored axios.defaults.baseURL here
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

//axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measurement disabled — removed reportWebVitals usage.
