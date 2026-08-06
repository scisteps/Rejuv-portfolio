// src/components/Common/LocationStatus.jsx
import React from 'react';
import './LocationStatus.css';

const LocationStatus = ({ location, error, isUsingFallback, loading }) => {
  if (loading) {
    return (
      <div className="location-status loading">
        <span className="status-icon">🔄</span>
        <span>Getting your location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="location-status error">
        <span className="status-icon">⚠️</span>
        <span>{error}</span>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isUsingFallback) {
    return (
      <div className="location-status fallback">
        <span className="status-icon">📍</span>
        <span>Using approximate location</span>
        <span className="accuracy-badge">~{location?.accuracy}m</span>
      </div>
    );
  }

  if (location) {
    return (
      <div className="location-status success">
        <span className="status-icon">✅</span>
        <span>Location found</span>
        <span className="accuracy-badge">±{Math.round(location.accuracy)}m</span>
      </div>
    );
  }

  return null;
};

export default LocationStatus;