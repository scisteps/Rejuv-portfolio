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
function App() {
  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<First  />} />
      <Route path="/addvideo" element={<AddVideo  />} />
      <Route path="/team" element={<Theteam  />} />
      <Route path="/addcontributor" element={<AddContributor  />} />
      <Route path="/morphintime" element={<MightyMorphin  />} />
      <Route path="/agnes" element={<Agnes  />} />
      <Route path="/brands" element={<Brand  />} />
      <Route path="/profiles" element={<Members  />} />

      </Routes>
      </div>
     
    </Router>
  );
}

export default App;
