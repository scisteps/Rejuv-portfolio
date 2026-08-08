// src/hooks/useUserLocation.js
import { useState, useEffect, useRef } from 'react';

// Default fallback location (Makerere University, Kampala)
const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // ── Get GPS Location with High Accuracy ──
  const getUserLocation = () => {
    return new Promise((resolve) => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser';
        setError(errorMsg);
        setIsUsingFallback(true);
        setLoading(false);
        resolve(DEFAULT_CENTER);
        return;
      }

      setLoading(true);
      setError(null);

      // High accuracy GPS options
      const options = {
        enableHighAccuracy: true,  // Force GPS
        timeout: 30000,            // Wait up to 30 seconds
        maximumAge: 0,             // Don't use cached position
      };

      console.log('📡 Requesting GPS with high accuracy...');

      navigator.geolocation.getCurrentPosition(
        // ── Success Handler ──
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: position.timestamp
          };

          console.log('✅ GPS Location acquired!');
          console.log(`📍 Accuracy: ${location.accuracy}m`);
          console.log(`📍 Coordinates: ${location.lat}, ${location.lng}`);

          setUserLocation(location);
          setAccuracy(location.accuracy);
          setIsUsingFallback(false);
          setLoading(false);
          setRetryCount(0);
          resolve(location);
        },
        // ── Error Handler ──
        (error) => {
          console.error('❌ GPS Error:', error.message);
          console.error('Error code:', error.code);
          
          // Try again with lower accuracy if GPS fails
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            console.log(`🔄 Retry ${retryCount + 1}/${maxRetries} with lower accuracy...`);
            
            setTimeout(() => {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                  };
                  
                  console.log('✅ Location found (lower accuracy):', location);
                  setUserLocation(location);
                  setAccuracy(location.accuracy);
                  setIsUsingFallback(location.accuracy > 100);
                  setLoading(false);
                  setRetryCount(0);
                  resolve(location);
                },
                (fallbackError) => {
                  console.error('❌ Fallback also failed:', fallbackError.message);
                  setError(getErrorMessage(fallbackError));
                  setIsUsingFallback(true);
                  setLoading(false);
                  resolve(DEFAULT_CENTER);
                },
                {
                  enableHighAccuracy: false,
                  timeout: 10000,
                  maximumAge: 60000
                }
              );
            }, 2000);
          } else {
            // All retries exhausted, use fallback
            setError('Unable to get GPS signal. Using approximate location.');
            setIsUsingFallback(true);
            setLoading(false);
            resolve(DEFAULT_CENTER);
          }
        },
        options
      );
    });
  };

  // ── Get Error Message ──
  const getErrorMessage = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return '📍 Location access denied. Please enable GPS in your browser settings.';
      case error.POSITION_UNAVAILABLE:
        return '📍 GPS signal unavailable. Try going outside.';
      case error.TIMEOUT:
        return '📍 GPS timeout. Try moving to an open area.';
      default:
        return `📍 GPS error: ${error.message}`;
    }
  };

  // ── Watch Location Continuously ──
  const startWatching = (onLocationUpdate) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return null;
    }

    // Clear existing watch
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    console.log('📍 Starting continuous GPS watch...');

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        console.log(`📍 GPS Update: ${location.accuracy}m`);
        
        setUserLocation(location);
        setAccuracy(location.accuracy);
        setIsUsingFallback(location.accuracy > 100);
        setError(null);
        
        if (onLocationUpdate && typeof onLocationUpdate === 'function') {
          onLocationUpdate(location);
        }
      },
      (error) => {
        console.warn('⚠️ Watch error:', error.message);
        setError('Lost GPS signal. Attempting to reconnect...');
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    );

    setWatchId(id);
    return id;
  };

  // ── Stop Watching ──
  const stopWatching = () => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      console.log('📍 GPS watch stopped');
    }
  };

  // ── Force GPS Refresh ──
  const refreshGPS = async () => {
    setRetryCount(0);
    return await getUserLocation();
  };

  // ── Get Accuracy Status ──
  const getAccuracyStatus = (accuracy) => {
    if (!accuracy) return { label: 'Unknown', color: '#999', icon: '📡' };
    if (accuracy < 20) return { label: 'Excellent', color: '#2e7d32', icon: '📍' };
    if (accuracy < 50) return { label: 'Good', color: '#4caf50', icon: '📍' };
    if (accuracy < 100) return { label: 'Fair', color: '#ff9800', icon: '📍' };
    if (accuracy < 500) return { label: 'Poor', color: '#f44336', icon: '⚠️' };
    if (accuracy < 1000) return { label: 'Very Poor', color: '#d32f2f', icon: '⚠️' };
    return { label: 'No GPS', color: '#999', icon: '❌' };
  };

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // ── Auto-get location on mount ──
  useEffect(() => {
    getUserLocation();
  }, []);

  return {
    userLocation,
    loading,
    error,
    accuracy,
    isUsingFallback,
    getUserLocation,
    refreshGPS,
    startWatching,
    stopWatching,
    getAccuracyStatus,
    DEFAULT_CENTER
  };
}