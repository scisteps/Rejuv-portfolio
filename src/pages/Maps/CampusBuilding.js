// src/CampusBuilding.jsx
import { AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

function CampusBuilding({ location, onSelect, onPositionUpdate, isSelected, isDraggable }) {
  const [position, setPosition] = useState({ lat: location.lat, lng: location.lng });
  const [showInfo, setShowInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    const newPosition = { lat: newLat, lng: newLng };
    
    setPosition(newPosition);
    setIsDragging(false);
    
    // Update parent component
    onPositionUpdate(location.id, newLat, newLng);
  };

  const handleClick = () => {
    if (!isDragging) {
      setShowInfo(true);
      onSelect(location);
    }
  };

  return (
    <>
      <AdvancedMarker
        position={position}
        draggable={isDraggable}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        <div className={`campus-marker ${isSelected ? 'selected' : ''} ${isDraggable ? 'draggable' : ''}`}>
          <div className="marker-content">
            <img 
              src={location.imageUrl} 
              alt={location.name}
              className="marker-image"
            />
            <div className="marker-badge">{location.category.charAt(0).toUpperCase()}</div>
          </div>
          <div className="marker-label">{location.name}</div>
          {isDraggable && <div className="drag-indicator">⋮⋮</div>}
        </div>
      </AdvancedMarker>

      {showInfo && (
        <InfoWindow
          position={position}
          onCloseClick={() => {
            setShowInfo(false);
            onSelect(null);
          }}
        >
          <div className="info-window">
            <img 
              src={location.imageUrl} 
              alt={location.name}
              className="info-image"
            />
            <div className="info-content">
              <h3>{location.name}</h3>
              <p className="category">{location.category}</p>
              <p className="description">{location.description}</p>
              <div className="details">
                <div className="detail-item">
                  <span className="emoji">🕒</span>
                  <span>{location.hours}</span>
                </div>
                <div className="detail-item">
                  <span className="emoji">📞</span>
                  <span>{location.phone}</span>
                </div>
              </div>
              <button 
                className="directions-btn"
                onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`)}
              >
                Get Directions 🗺️
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default CampusBuilding;