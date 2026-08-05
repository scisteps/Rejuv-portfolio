// src/hooks/useUserLocation.js
import { useState, useEffect, useRef } from 'react';

// Makerere University as the fallback center (not California!)
const MAKERERE_CENTER = { lat: 0.3476, lng: 32.5825 };

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const watchIdRef = useRef(null);

  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setIsUsingFallback(true);
        resolve(MAKERERE_CENTER);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(location);
          setIsUsingFallback(false);
          setLoading(false);
          resolve(location);
        },
        (err) => {
          console.warn('GPS error:', err.message);

          // Give a clear human-readable error
          const messages = {
            1: 'Location access denied. Please allow location in your browser settings.',
            2: 'Location unavailable. Check your GPS or network.',
            3: 'Location request timed out. Try again.',
          };

          setError(messages[err.code] || 'Could not get your location.');
          setIsUsingFallback(true);
          setLoading(false);

          // Fall back to Makerere center so the map still loads correctly
          resolve(MAKERERE_CENTER);
        },
        {
          enableHighAccuracy: true,  // uses GPS chip, not just IP
          timeout: 10000,            // wait up to 10 seconds
          maximumAge: 0,             // never use a cached position
        }
      );
    });
  };

  // Continuously watch and update location (for path tracking)
  const startWatching = (onLocationUpdate) => {
    if (!navigator.geolocation) return;

    // Clear any existing watch first
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setUserLocation(location);
        setIsUsingFallback(false);
        if (onLocationUpdate) onLocationUpdate(location);
      },
      (err) => {
        console.warn('Watch error:', err.message);
        setError('Lost location signal.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Clean up the watch when the component unmounts
  useEffect(() => {
    return () => stopWatching();
  }, []);

  return {
    userLocation,
    loading,
    error,
    isUsingFallback,
    getUserLocation,
    startWatching,
    stopWatching,
    MAKERERE_CENTER, // export so dashboards can use it as initial center
  };
}