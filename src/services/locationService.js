// src/services/locationService.js
export const locationService = {
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      // Use high accuracy by default
      const defaultOptions = {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 15000,            // Wait up to 15 seconds
        maximumAge: 0,             // Don't use cached position
        ...options
      };

      console.log('📍 Getting position with options:', defaultOptions);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Position received:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed
          });
          resolve(position);
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          
          // If high accuracy fails, try with lower accuracy as fallback
          if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
            console.log('🔄 Retrying with lower accuracy...');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log('✅ Position received (fallback):', {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  accuracy: position.coords.accuracy
                });
                resolve(position);
              },
              (fallbackError) => {
                reject(fallbackError);
              },
              {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
              }
            );
          } else {
            reject(error);
          }
        },
        defaultOptions
      );
    });
  },

  watchPosition(onSuccess, onError, options = {}) {
    if (!navigator.geolocation) {
      onError(new Error('Geolocation is not supported'));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
      ...options
    };

    console.log('📍 Starting watch with options:', defaultOptions);
    
    return navigator.geolocation.watchPosition(
      (position) => {
        console.log('📍 Position updated:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        onSuccess(position);
      },
      onError,
      defaultOptions
    );
  },

  clearWatch(watchId) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
      console.log('📍 Watch cleared');
    }
  }
};