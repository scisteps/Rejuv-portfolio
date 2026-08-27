// src/components/map/MapWrapper.jsx
import React, { useEffect, useRef, useState, useContext } from 'react';
import { GoogleMap, MapContext, useMap } from 'googlemaps-react-primitives';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is missing!');
}

// Wrapper component that provides map context
function MapProvider({ children, center, zoom, onMapReady, ...props }) {
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (mapInstance && onMapReady) {
      onMapReady(mapInstance);
    }
  }, [mapInstance, onMapReady]);

  return (
    <GoogleMap
      ref={(map) => {
        if (map) {
          setMapInstance(map);
        }
      }}
      center={center}
      zoom={zoom}
      {...props}
    >
      {children}
    </GoogleMap>
  );
}

export default function MapWrapper({ 
  children, 
  center, 
  zoom, 
  onClick, 
  onBoundsChanged, 
  onZoomChanged,
  onMapReady 
}) {
  const mapCenter = center || { lat: 0, lng: 0 };

  // Load Google Maps API script
  useEffect(() => {
    if (!window.google && GOOGLE_MAPS_API_KEY) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps API loaded!');
      };
      script.onerror = (error) => {
        console.error('Google Maps API failed to load:', error);
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="map-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {window.google ? (
        <MapProvider
          center={mapCenter}
          zoom={zoom || 14}
          onClick={onClick}
          onBoundsChanged={onBoundsChanged}
          onZoomChanged={onZoomChanged}
          onMapReady={onMapReady}
          options={{
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {children}
        </MapProvider>
      ) : (
        <div className="map-loading" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          background: '#f0f0f0'
        }}>
          <div>
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}