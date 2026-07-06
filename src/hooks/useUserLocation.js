// src/hooks/useUserLocation.js
import { useState, useEffect } from 'react';
import { locationService } from './locationService';

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Get user location once
  const getUserLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await locationService.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      
      setUserLocation(location);
      return location;
    } catch (err) {
      console.error('Failed to get user location:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start watching user location
  const startWatching = (onLocationUpdate) => {
    if (watchId) {
      stopWatching();
    }

    const onSuccess = (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      
      setUserLocation(location);
      
      if (onLocationUpdate && typeof onLocationUpdate === 'function') {
        onLocationUpdate(location);
      }
    };

    const onError = (error) => {
      console.error('Location watch error:', error);
      setError(error.message);
    };

    const id = locationService.watchPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
    setWatchId(id);
    return id;
  };

  // Stop watching location
  const stopWatching = () => {
    if (watchId) {
      locationService.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        locationService.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Optionally get location on mount
  useEffect(() => {
    // Uncomment the line below to automatically get location on mount
    // getUserLocation();
  }, []);

  return {
    userLocation,
    loading,
    error,
    getUserLocation,
    startWatching,
    stopWatching
  };
}