import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import First from './pages/First';
import AddVideo from './entries/AddVideo';
import Theteam from './pages/Theteam';
function App() {
  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<First  />} />
      <Route path="/addvideo" element={<AddVideo  />} />
      <Route path="/team" element={<Theteam  />} />

      </Routes>
      </div>
     
    </Router>
  );
}

export default App;
