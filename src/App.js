import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import First from './pages/First';
import AddVideo from './entries/AddVideo';
import Theteam from './pages/Theteam';
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
import SalesTracker from './SalesTracker';  // ← NEW PAGE

function App() {
  return (
    <Router>
      <div>
      <Analytics />

      <Routes>
      <Route path="/" element={<First  />} />
      <Route path="/addvideo" element={<AddVideo  />} />
      <Route path="/team" element={<Theteam  />} />
      <Route path="/addcontributor" element={<AddContributor  />} />
      <Route path="/morphintime" element={<MightyMorphin  />} />
      <Route path="/agnes" element={<Agnes  />} />
      <Route path="/brands" element={<Brand  />} />
      <Route path="/profiles" element={<Members  />} />
      <Route path="/tabi" element={<Tabitha  />} />
      <Route path="/stillgraphics" element={<Third  />} />
      <Route path="/tsam" element={<Tsam  />} />
      <Route path="/profile" element={<Profile  />} />
      <Route path="/pc" element={<PopCulture  />} />
      <Route path="/sales-tracker" element={<SalesTracker />} />

      </Routes>
      </div>
     
    </Router>
  );
}

export default App;
