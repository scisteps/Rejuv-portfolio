// src/components/map/MapWrapper.jsx
import React, { useEffect, useRef } from 'react';
import { GoogleMap } from 'googlemaps-react-primitives';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function MapWrapper({ 
  children, 
  center, 
  zoom, 
  onMapReady,
  ...props 
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google && GOOGLE_MAPS_API_KEY) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  if (!window.google) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        background: '#f0f0f0'
      }}>
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      ref={(map) => {
        if (map) {
          mapRef.current = map;
          if (onMapReady) onMapReady(map);
        }
      }}
      center={center || { lat: 0, lng: 0 }}
      zoom={zoom || 14}
      {...props}
    >
      {children}
    </GoogleMap>
  );
}