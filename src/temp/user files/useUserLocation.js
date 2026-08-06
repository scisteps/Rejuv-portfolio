// src/hooks/useUserLocation.js
import { useState, useEffect, useRef } from 'react';

const MAKERERE_CENTER = { lat: 0.3476, lng: 32.5825 };

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const watchIdRef = useRef(null);
  const resolvedRef = useRef(false); // prevent double-resolve

  const ERROR_MESSAGES = {
    1: 'Location access denied. Please allow location in your browser settings.',
    2: 'Location unavailable. Check your GPS or network.',
    3: 'Location request timed out.',
  };

  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setIsUsingFallback(true);
        resolve(MAKERERE_CENTER);
        return;
      }

      setLoading(true);
      setError(null);
      resolvedRef.current = false;

      // ── Phase 1: fast coarse fix (IP/WiFi, <1s) ──────────────────────────
      // enableHighAccuracy: false → browser returns immediately with a cached
      // or network-based position. Not GPS-accurate but good enough to show
      // the map and the user's rough area instantly.
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coarse = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          // Resolve the promise immediately so the map can center and render
          if (!resolvedRef.current) {
            resolvedRef.current = true;
            setUserLocation(coarse);
            setAccuracy(coarse.accuracy);
            setIsUsingFallback(false);
            setLoading(false);
            resolve(coarse);
          }

          // ── Phase 2: upgrade to precise GPS silently in background ────────
          // We start a watch here. The first callback with better accuracy
          // updates the pin position smoothly without blocking anything.
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
          }

          watchIdRef.current = navigator.geolocation.watchPosition(
            (precise) => {
              const fine = {
                lat: precise.coords.latitude,
                lng: precise.coords.longitude,
                accuracy: precise.coords.accuracy,
              };
              setUserLocation(fine);
              setAccuracy(fine.accuracy);
              setIsUsingFallback(false);
            },
            (err) => console.warn('GPS watch error:', err.message),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
          );
        },
        (err) => {
          // Phase 1 failed — fall back to Makerere center immediately
          console.warn('Coarse location failed:', err.message);
          setError(ERROR_MESSAGES[err.code] || 'Could not get your location.');
          setIsUsingFallback(true);
          setLoading(false);
          if (!resolvedRef.current) {
            resolvedRef.current = true;
            resolve(MAKERERE_CENTER);
          }
        },
        {
          enableHighAccuracy: false, // fast — returns in <1 second
          timeout: 5000,
          maximumAge: 60000,         // accept a position cached up to 1 min ago
        }
      );
    });
  };

  // Manual watch start (used by path tracker)
  const startWatching = (onLocationUpdate) => {
    if (!navigator.geolocation) return;

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setUserLocation(loc);
        setAccuracy(loc.accuracy);
        setIsUsingFallback(false);
        if (onLocationUpdate) onLocationUpdate(loc);
      },
      (err) => {
        console.warn('Watch error:', err.message);
        setError('Lost location signal.');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopWatching();
  }, []);

  return {
    userLocation,
    loading,
    error,
    accuracy,
    isUsingFallback,
    getUserLocation,
    startWatching,
    stopWatching,
    MAKERERE_CENTER,
  };
}
