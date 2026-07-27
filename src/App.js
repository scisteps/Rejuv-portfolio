import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import First from './pages/First';
import AddVideo from './entries/AddVideo';
import Theteam from './pages/Theteam';
import AdminDashboard from './mapages/AdminDashboard';
import UserDashboard from './mapages/UserDashboard';
import AddContributor from './entries/AddContributor';
import MightyMorphin from './tokens/MightyMorphin';
import Agnes from './tokens/Agnes';
import Brand from './pages/Brand';
import Members from './pages/Members';
import Tabitha from './tokens/Tabitha';
import { Analytics } from "@vercel/analytics/react"
import Third from './pages/Third';
import Tsam from './Tsam/Tsam';
import Profile from './pages/Profile';
import PopCulture from './pages/PopCulture';

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
          
         
          <Route path="/first" element={<First />} />
          <Route path="/addvideo" element={<AddVideo />} />
          <Route path="/team" element={<Theteam />} />
          <Route path="/addcontributor" element={<AddContributor />} />
          <Route path="/morphintime" element={<MightyMorphin />} />
          <Route path="/profiles" element={<Members />} />
          <Route path="/tabi" element={<Tabitha />} />
          <Route path="/stillgraphics" element={<Third />} />
          <Route path="/tsam" element={<Tsam />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pc" element={<PopCulture />} />
        
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
