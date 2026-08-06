import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminDashboard from './mapages/AdminDashboard';
import UserDashboard from './mapages/UserDashboard';

import { Analytics } from "@vercel/analytics/react"


function App() {
  return (
    <Router>
      <div>
      <Analytics />

        <Routes>
          {/* Main Routes - Geo-Fencing Community Map */}
          <Route path="/" element={<UserDashboard />} />
          <Route path="/map" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
         
    
     
        
          {/* Catch-all route - 404 Not Found */}
          <Route path="*" element={<div className="not-found">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go to Home</a>
          </div>} />
        </Routes>
      </div>
     
    </Router>
  );
}

export default App;
