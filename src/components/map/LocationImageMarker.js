// src/components/map/LocationImageMarker.jsx
import React, { useRef } from 'react';
import { Overlay } from 'googlemaps-react-primitives';
import LOCATION_IMAGES from './Images';
import './LocationImageMarker.css';

const DOUBLE_TAP_DELAY = 300; // ms

export default function LocationImageMarker({ location, onClick, onZoom }) {
  const lastTapRef = useRef(0);

  // Only use images from the LOCATION_IMAGES mapping
  // Try location name first, then category as fallback
  const image = 
    LOCATION_IMAGES[location.name] ||
    LOCATION_IMAGES[location.category];

  if (!image) {
    console.log('No image found for:', location.name, location.category);
    return null;
  }

  const handleTap = (event) => {
    event.stopPropagation();
    const now = Date.now();
    const isDoubleTap = now - lastTapRef.current < DOUBLE_TAP_DELAY;
    lastTapRef.current = now;

    if (isDoubleTap) {
      onZoom(image, location.name);
    } else {
      onClick();
    }
  };

  return (
    <Overlay position={{ lat: location.lat, lng: location.lng }}>
      <div
        className="location-image-marker"
        onClick={handleTap}
        onDoubleClick={() => onZoom(image, location.name)}
        title={location.name}
      >
        <img
          src={image}
          alt={location.name || 'Location'}
          className="location-marker-image"
          draggable={false}
          onError={(e) => {
            // Hide image if it fails to load
            e.target.style.display = 'none';
            console.error('Failed to load image:', image);
          }}
        />
        {location.number != null && (
          <div className="location-number">{location.number}</div>
        )}
      </div>
    </Overlay>
  );
}