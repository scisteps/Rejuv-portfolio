// src/components/map/MapWrapper.jsx
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useMap } from 'googlemaps-react-primitives';
import './MapWrapper.css';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = 'google-maps-script';

let googleMapsPromise = null;

function loadGoogleMaps() {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error('Missing REACT_APP_GOOGLE_MAPS_API_KEY'));
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps script'))
      );
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

// Lives *inside* <GoogleMap>, so useMap() actually has a map to return.
// Reports the instance up to MapWrapper's caller exactly once.
function MapReadyNotifier({ onMapReady }) {
  const map = useMap();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (map && !notifiedRef.current) {
      notifiedRef.current = true;
      onMapReady?.(map);
    }
  }, [map, onMapReady]);

  return null;
}

export default function MapWrapper({
  children,
  center,
  zoom,
  onMapReady,
  ...props
}) {
  const [status, setStatus] = useState(
    window.google?.maps ? 'ready' : 'loading'
  );
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (!cancelled) setStatus('ready');
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="map-status map-status--loading">
        <div className="map-status__spinner" />
        <p>Loading map…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="map-status map-status--error">
        <span className="map-status__icon">⚠️</span>
        <p className="map-status__title">Couldn't load Google Maps</p>
        <p className="map-status__detail">{errorMessage}</p>
        <button
          className="map-status__retry"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <GoogleMap
      center={center || { lat: 0, lng: 0 }}
      zoom={zoom || 14}
      {...props}
    >
      <MapReadyNotifier onMapReady={onMapReady} />
      {children}
    </GoogleMap>
  );
}