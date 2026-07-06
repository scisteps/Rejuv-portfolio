// src/utils/constants.js
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 37.3600, lng: -122.0650 },
  DEFAULT_ZOOM: 16,
  MAX_ZOOM: 20,
  MIN_ZOOM: 14,
  TILT: 0,
  MAP_TYPE_ID: 'roadmap'
};

export const MARKER_STYLES = {
  DEFAULT: {
    size: 48,
    borderRadius: '50%',
    borderWidth: 3
  },
  SELECTED: {
    scale: 1.1,
    glowColor: '#4285f4'
  },
  DRAGGABLE: {
    cursor: 'grab'
  }
};

export const API_ENDPOINTS = {
  BUILDINGS: '/api/buildings',
  DIRECTIONS: '/api/directions',
  PLACES: '/api/places'
};