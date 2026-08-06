// src/hooks/usePathTracking.js
import { useState, useRef } from 'react';

function haversineDistance(a, b) {
  const R = 6371e3; // metres
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function usePathTracking() {
  const [path, setPath] = useState([]);         // array of { lat, lng }
  const [isTracking, setIsTracking] = useState(false);
  const [pathStats, setPathStats] = useState({ distance: 0, duration: 0, points: 0 });
  const watchIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setPath([]);
    setPathStats({ distance: 0, duration: 0, points: 0 });
    setIsTracking(true);
    startTimeRef.current = Date.now();

    // Update duration every second
    intervalRef.current = setInterval(() => {
      setPathStats((prev) => ({
        ...prev,
        duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }));
    }, 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setPath((prev) => {
          const updated = [...prev, newPoint];
          // Compute total distance
          let dist = 0;
          for (let i = 1; i < updated.length; i++) {
            dist += haversineDistance(updated[i - 1], updated[i]);
          }
          setPathStats((s) => ({
            ...s,
            distance: dist,
            points: updated.length,
          }));
          return updated;
        });
      },
      (err) => console.warn('Path tracking error:', err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  };

  const clearPath = () => {
    stopTracking();
    setPath([]);
    setPathStats({ distance: 0, duration: 0, points: 0 });
  };

  return { isTracking, path, pathStats, startTracking, stopTracking, clearPath };
}
