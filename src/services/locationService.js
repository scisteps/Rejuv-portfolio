// src/services/locationService.js
export const locationService = {
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  },

  watchPosition(onSuccess, onError, options = {}) {
    if (!navigator.geolocation) {
      onError(new Error('Geolocation is not supported'));
      return null;
    }
    return navigator.geolocation.watchPosition(onSuccess, onError, options);
  },

  clearWatch(watchId) {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
};