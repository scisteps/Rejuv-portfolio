// src/hooks/useUserLocation.js
import { useState } from 'react';
import { locationService } from '../services/locationService';

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackLocation, setFallbackLocation] = useState(null);

  const getUserLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to get location with a shorter timeout first
      const position = await locationService.getCurrentPosition({
        enableHighAccuracy: false, // Use less accurate but faster method
        timeout: 5000, // Reduced timeout to 5 seconds
        maximumAge: 60000 // Accept cached position up to 1 minute old
      });
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'gps'
      };
      
      setUserLocation(location);
      setFallbackLocation(null);
      return location;
      
    } catch (err) {
      console.error('Geolocation error:', err);
      
      // If GPS fails, try IP-based location as fallback
      try {
        console.log('🔄 Trying IP-based fallback...');
        const ipLocation = await getIPLocation();
        if (ipLocation) {
          setFallbackLocation(ipLocation);
          setUserLocation(ipLocation);
          setError('Using approximate location (IP-based)');
          return ipLocation;
        }
      } catch (ipError) {
        console.error('IP fallback failed:', ipError);
      }
      
      // If all fails, use default location
      const defaultLocation = {
        lat: 37.3605,
        lng: -122.0655,
        accuracy: 1000,
        source: 'default'
      };
      
      setFallbackLocation(defaultLocation);
      setUserLocation(defaultLocation);
      setError(err.message || 'Unable to get precise location');
      return defaultLocation;
      
    } finally {
      setLoading(false);
    }
  };

  // IP-based location fallback
  const getIPLocation = async () => {
    try {
      // Using free IP geolocation API
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP API failed');
      
      const data = await response.json();
      return {
        lat: data.latitude,
        lng: data.longitude,
        accuracy: 5000, // IP-based location is less accurate
        source: 'ip',
        city: data.city,
        region: data.region,
        country: data.country_name
      };
    } catch (error) {
      console.error('IP geolocation failed:', error);
      return null;
    }
  };

  return {
    userLocation,
    loading,
    error,
    getUserLocation,
    fallbackLocation,
    isUsingFallback: !!fallbackLocation
  };
}