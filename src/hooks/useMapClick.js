// src/hooks/useMapClick.js
import { useState, useCallback } from 'react';

export function useMapClick() {
  const [clickPosition, setClickPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Extracts latitude and longitude from various map click event formats
   */
  const extractLatLng = useCallback((event) => {
    console.log('📍 Extracting lat/lng from event:', event);
    
    let lat, lng;

    // Try different ways to get lat/lng from the event
    try {
      // Method 1: @vis.gl/react-google-maps format
      if (event.detail && event.detail.latLng) {
        const latLng = event.detail.latLng;
        if (typeof latLng.lat === 'function') {
          lat = latLng.lat();
          lng = latLng.lng();
        } else if (typeof latLng.lat === 'number') {
          lat = latLng.lat;
          lng = latLng.lng;
        }
      }
      
      // Method 2: Standard Google Maps format
      if (!lat && !lng && event.latLng) {
        const latLng = event.latLng;
        if (typeof latLng.lat === 'function') {
          lat = latLng.lat();
          lng = latLng.lng();
        } else if (typeof latLng.lat === 'number') {
          lat = latLng.lat;
          lng = latLng.lng;
        }
      }
      
      // Method 3: Direct lat/lng properties
      if (!lat && !lng) {
        if (event.lat !== undefined && event.lng !== undefined) {
          lat = event.lat;
          lng = event.lng;
        } else if (event.latitude !== undefined && event.longitude !== undefined) {
          lat = event.latitude;
          lng = event.longitude;
        }
      }
      
      // Method 4: From event.detail directly
      if (!lat && !lng && event.detail) {
        if (event.detail.lat !== undefined && event.detail.lng !== undefined) {
          lat = event.detail.lat;
          lng = event.detail.lng;
        } else if (event.detail.latitude !== undefined && event.detail.longitude !== undefined) {
          lat = event.detail.latitude;
          lng = event.detail.longitude;
        }
      }
      
      // Validate the result
      if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
        console.log('✅ Extracted position:', { lat, lng });
        return { lat, lng };
      } else {
        console.error('❌ Could not extract valid lat/lng from event:', event);
        return null;
      }
    } catch (error) {
      console.error('❌ Error extracting lat/lng:', error);
      return null;
    }
  }, []);

  /**
   * Handles the map click event
   */
  const handleMapClick = useCallback((event) => {
    console.log('🖱️ Map clicked:', event);
    setIsLoading(true);
    setError(null);

    try {
      const position = extractLatLng(event);
      
      if (position) {
        setClickPosition(position);
        return position;
      } else {
        const errorMsg = 'Could not extract position from map click';
        setError(errorMsg);
        console.error(errorMsg);
        return null;
      }
    } catch (error) {
      const errorMsg = 'Error handling map click: ' + error.message;
      setError(errorMsg);
      console.error(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [extractLatLng]);

  /**
   * Clears the current click position
   */
  const clearClickPosition = useCallback(() => {
    setClickPosition(null);
    setError(null);
  }, []);

  /**
   * Manually set a position (useful for testing)
   */
  const setPosition = useCallback((lat, lng) => {
    const position = { lat, lng };
    setClickPosition(position);
    return position;
  }, []);

  return {
    clickPosition,
    isLoading,
    error,
    handleMapClick,
    clearClickPosition,
    setPosition
  };
}