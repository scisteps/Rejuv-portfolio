// src/components/common/LocationStatus.jsx
import React from 'react';
import './LocationStatus.css';

const LocationStatus = ({
  location,
  error,
  isUsingFallback,
  loading,
  onRetry,
}) => {
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
        {/* Re-request the fix instead of reloading the whole page — a full
            reload threw away the map, filters and any half-typed form. */}
        <button
          className="retry-btn"
          onClick={() => {
            if (onRetry) onRetry();
            else window.location.reload();
          }}
          disabled={loading}
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
        {location?.accuracy != null && (
          <span className="accuracy-badge">~{Math.round(location.accuracy)}m</span>
        )}
      </div>
    );
  }

  if (location) {
    return (
      <div className="location-status success">
        <span className="status-icon">✅</span>
        <span>Location found</span>
        <span className="accuracy-badge">
          ±{Math.round(location.accuracy)}m
        </span>
      </div>
    );
  }

  return null;
};

export default LocationStatus;