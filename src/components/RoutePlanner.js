// src/components/RoutePlanner.jsx
import { useState } from 'react';

function RoutePlanner({ from, to, onClose }) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRoute = async () => {
    if (!from) {
      alert("Please enable location services to get route from your current position");
      return;
    }

    setLoading(true);
    // In production, use Google Directions API
    // This is a simplified simulation
    setTimeout(() => {
      setRoute({
        distance: "0.8 km",
        duration: "10 min walk",
        steps: [
          "Head east on Main Street",
          "Turn left at Student Union",
          "Continue straight to destination"
        ]
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="route-planner">
      <div className="route-header">
        <h3>Route to {to?.name}</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      
      <div className="route-info">
        <div className="location-info">
          <div className="from">
            <span className="dot"></span>
            <span>{from ? "Your Location" : "Not available"}</span>
          </div>
          <div className="to">
            <span className="dot destination"></span>
            <span>{to?.name}</span>
          </div>
        </div>
        
        <button onClick={getRoute} className="get-route-btn" disabled={loading}>
          {loading ? "Calculating..." : "Get Directions 🚶"}
        </button>
        
        {route && (
          <div className="route-details">
            <div className="route-summary">
              <span>📏 {route.distance}</span>
              <span>⏱️ {route.duration}</span>
            </div>
            <div className="route-steps">
              {route.steps.map((step, index) => (
                <div key={index} className="step">
                  <span className="step-number">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoutePlanner;