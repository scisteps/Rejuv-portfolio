// src/services/locationService.js
export const locationService = {
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      // Default options with better timeout handling
      const defaultOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      };
      
      const finalOptions = { ...defaultOptions, ...options };
      
      // Set a timeout to reject if location takes too long
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, finalOptions.timeout + 1000);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve(position);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        finalOptions
      );
    });
  },

  watchPosition(onSuccess, onError, options = {}) {
    if (!navigator.geolocation) {
      onError(new Error('Geolocation is not supported'));
      return null;
    }
    
    const defaultOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    };
    
    return navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      { ...defaultOptions, ...options }
    );
  },

  clearWatch(watchId) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
};