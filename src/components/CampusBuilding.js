// src/components/CampusMap/CampusBuilding.jsx
import React, { useState } from 'react';
import { Marker, InfoWindow } from '@vis.gl/react-google-maps';
// import Lottie from 'lottie-react';
import './CampusBuilding.css';

const CampusBuilding = ({ 
  building, 
  onSelect, 
  onPositionUpdate, 
  isSelected, 
  isDraggable 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Handle marker drag end
  const handleDragEnd = (event) => {
    if (!isDraggable) return;
    
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    
    if (onPositionUpdate) {
      onPositionUpdate(building.id, newLat, newLng);
    }
  };

  // Handle marker click
  const handleClick = () => {
    if (onSelect) {
      onSelect(building);
    }
    setShowInfo(true);
  };

  // Get marker icon based on building type
  const getMarkerIcon = () => {
    const iconMap = {
      'academic': {
        path: 'M-8,-8 L8,-8 L8,8 L-8,8 Z',
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 1.2
      },
      'services': {
        path: 'M-6,-6 L6,-6 L6,6 L-6,6 Z',
        fillColor: '#34A853',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 1.2
      },
      'hall': {
        path: 'M0,-10 L-6,5 L6,5 Z',
        fillColor: '#EA4335',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 1.2
      },
      'college': {
        path: 'M-10,-10 L10,-10 L10,10 L-10,10 Z',
        fillColor: '#FBBC04',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 1.2
      }
    };
    
    return iconMap[building.type] || iconMap.academic;
  };

  // Get Lottie animation if available
  const getLottieAnimation = () => {
    // You can import different animations based on building type
    // For now, we'll use a placeholder
    return building.lottieAnimation || null;
  };

  // Get building details for info window
  const getInfoContent = () => {
    return (
      <div className="building-info-window">
        <h3 className="building-name">{building.name}</h3>
        {building.description && (
          <p className="building-description">{building.description}</p>
        )}
        <div className="building-details">
          {building.category && (
            <span className="building-category">{building.category}</span>
          )}
          {building.hours && (
            <div className="building-hours">
              <strong>Hours:</strong> {building.hours}
            </div>
          )}
          {building.phone && (
            <div className="building-phone">
              <strong>Phone:</strong> {building.phone}
            </div>
          )}
          {building.amenities && building.amenities.length > 0 && (
            <div className="building-amenities">
              <strong>Amenities:</strong>
              <ul>
                {building.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button 
          className="view-details-btn"
          onClick={() => {
            setShowInfo(false);
            if (onSelect) onSelect(building);
          }}
        >
          View Details
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Main Marker */}
      <Marker
        position={{ lat: building.lat, lng: building.lng }}
        icon={getMarkerIcon()}
        draggable={isDraggable}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        title={building.name}
        label={{
          text: building.name,
          fontSize: '10px',
          fontWeight: 'bold',
          className: 'marker-label'
        }}
        zIndex={isSelected ? 1000 : 1}
      >
        {/* Lottie Animation Overlay (if available) */}
        {/* {getLottieAnimation() && (
          <div className="lottie-overlay">
            <Lottie 
              animationData={getLottieAnimation()} 
              loop={true}
              style={{ width: '60px', height: '60px' }}
            />
          </div>
        )} */}
      </Marker>

      {/* Info Window */}
      {showInfo && (
        <InfoWindow
          position={{ lat: building.lat, lng: building.lng }}
          onCloseClick={() => setShowInfo(false)}
          maxWidth={300}
        >
          {getInfoContent()}
        </InfoWindow>
      )}

      {/* Custom Popup for Hover */}
      {isHovered && !showInfo && (
        <div 
          className="building-tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {building.name}
        </div>
      )}
    </>
  );
};

export default CampusBuilding;