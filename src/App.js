import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import First from './pages/First';
import AddVideo from './entries/AddVideo';
function App() {
  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<First  />} />
      <Route path="/addvideo" element={<AddVideo  />} />

      </Routes>
      </div>
     
    </Router>
  );
}

export default App;
