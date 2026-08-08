// src/hooks/useUserLocation.js
import { useState, useEffect, useRef } from 'react';

// Default fallback (you can change this to your desired fallback location)
const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 }; // Makerere

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const watchIdRef = useRef(null);

  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setIsUsingFallback(true);
        setLoading(false);
        resolve(DEFAULT_CENTER);
        return;
      }

      setLoading(true);
      setError(null);

      // First attempt: High accuracy (GPS)
      console.log('📍 Attempting high accuracy location...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          
          console.log('✅ High accuracy location found:', location);
          setUserLocation(location);
          setAccuracy(location.accuracy);
          setIsUsingFallback(false);
          setLoading(false);
          resolve(location);
        },
        (err) => {
          console.warn('⚠️ High accuracy failed:', err.message);
          
          // Second attempt: Lower accuracy but faster
          console.log('🔄 Trying lower accuracy...');
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
              };
              
              console.log('✅ Location found (lower accuracy):', location);
              setUserLocation(location);
              setAccuracy(location.accuracy);
              setIsUsingFallback(true);
              setLoading(false);
              resolve(location);
            },
            (fallbackErr) => {
              console.warn('⚠️ All location attempts failed:', fallbackErr.message);
              // Use fallback
              setError('Unable to get your location. Using approximate position.');
              setIsUsingFallback(true);
              setLoading(false);
              resolve(DEFAULT_CENTER);
            },
            {
              enableHighAccuracy: false,
              timeout: 8000,
              maximumAge: 60000
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  };

  // Start continuous watching
  const startWatching = (onLocationUpdate) => {
    if (!navigator.geolocation) return;

    // Clear existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    console.log('📍 Starting location watch...');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        console.log('📍 Watch update:', location);
        setUserLocation(location);
        setAccuracy(location.accuracy);
        setIsUsingFallback(false);
        
        if (onLocationUpdate) {
          onLocationUpdate(location);
        }
      },
      (err) => {
        console.warn('⚠️ Watch error:', err.message);
        setError('Lost location signal.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('📍 Watch stopped');
    }
  };

  // Clean up
  useEffect(() => {
    return () => stopWatching();
  }, []);

  return {
    userLocation,
    loading,
    error,
    isUsingFallback,
    accuracy,
    getUserLocation,
    startWatching,
    stopWatching,
    DEFAULT_CENTER,
  };
}