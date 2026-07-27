// src/components/User/PathTracker.jsx
import React from 'react';
import './PathTracker.css';

const PathTracker = ({ 
  isTracking, 
  path, 
  pathStats, 
  onStartTracking, 
  onStopTracking, 
  onClearPath 
}) => {
  return (
    <div className="path-tracker">
      <h3>🚶 Path Tracker</h3>
      
      <div className="tracker-stats">
        <div className="stat-item">
          <span className="stat-label">Distance</span>
          <span className="stat-value">{pathStats.distance.toFixed(2)} km</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{pathStats.duration} min</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{pathStats.speed.toFixed(1)} km/h</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Points</span>
          <span className="stat-value">{path.length}</span>
        </div>
      </div>

      <div className="tracker-actions">
        {!isTracking ? (
          <button className="btn-start" onClick={onStartTracking}>
            ▶️ Start Tracking
          </button>
        ) : (
          <button className="btn-stop" onClick={onStopTracking}>
            ⏹️ Stop Tracking
          </button>
        )}
        <button className="btn-clear" onClick={onClearPath} disabled={path.length === 0}>
          🗑️ Clear
        </button>
      </div>

      {path.length > 0 && (
        <div className="tracker-path-preview">
          <div className="path-mini-map">
            <div className="mini-map-dots">
              {path.slice(0, 30).map((point, index) => (
                <div 
                  key={index} 
                  className="mini-dot"
                  style={{
                    left: `${((point.lng + 122.072) / (122.058 - 122.072)) * 100}%`,
                    top: `${((37.365 - point.lat) / (37.365 - 37.355)) * 100}%`,
                    opacity: 0.3 + (index / path.length) * 0.7
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathTracker;