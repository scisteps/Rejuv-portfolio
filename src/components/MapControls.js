// src/components/CampusMap/MapControls.jsx
import React from 'react';

function MapControls({ 
  onGetLocation, 
  onToggleMap, 
  onToggleDragMode, 
  isDraggingMode, 
  showMap 
}) {
  return (
    <div className="map-controls">
      <button onClick={onGetLocation} className="btn btn-primary">
        📍 My Location
      </button>
      <button onClick={onToggleMap} className="btn btn-secondary">
        {showMap ? "🗺️ Hide Map" : "🖼️ Show Map"}
      </button>
      <button 
        onClick={onToggleDragMode} 
        className={`btn ${isDraggingMode ? 'btn-active' : 'btn-secondary'}`}
      >
        {isDraggingMode ? "🔓 Drag Mode ON" : "🔒 Drag Mode OFF"}
      </button>
    </div>
  );
}

export default MapControls;