// src/utils/constants.js
// Combined constants for the entire application

// ============ MAP CONFIGURATION ============
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 37.3600, lng: -122.0650 },
  DEFAULT_ZOOM: 16,
  MAX_ZOOM: 20,
  MIN_ZOOM: 14,
  TILT: 0,
  MAP_TYPE_ID: 'roadmap'
};

// ============ MARKER STYLES ============
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

// ============ API ENDPOINTS ============
export const API_ENDPOINTS = {
  BUILDINGS: '/api/buildings',
  DIRECTIONS: '/api/directions',
  PLACES: '/api/places',
  GEO_LOCATIONS: '/api/geo/locations',
  GEO_PATHS: '/api/geo/paths'
};

// ============ CATEGORIES ============
export const CATEGORIES = {
  TYPES: {
    RESTAURANT: 'restaurant',
    PARK: 'park',
    SHOPPING: 'shopping',
    SCHOOL: 'school',
    HOSPITAL: 'hospital',
    GYM: 'gym',
    LIBRARY: 'library',
    COMMUNITY: 'community',
    ENTERTAINMENT: 'entertainment',
    TRANSPORT: 'transport',
    RELIGIOUS: 'religious',
    OTHER: 'other'
  },
  COLORS: {
    restaurant: '#FF6B6B',
    park: '#4ECDC4',
    shopping: '#FFD93D',
    school: '#6C5CE7',
    hospital: '#FF6B6B',
    gym: '#00B894',
    library: '#0984E3',
    community: '#FD79A8',
    entertainment: '#FDCB6E',
    transport: '#00CEC9',
    religious: '#A29BFE',
    other: '#636E72'
  },
  ICONS: {
    restaurant: '🍽️',
    park: '🌳',
    shopping: '🛍️',
    school: '🏫',
    hospital: '🏥',
    gym: '💪',
    library: '📚',
    community: '🤝',
    entertainment: '🎭',
    transport: '🚌',
    religious: '⛪',
    other: '📍'
  }
};

// ============ INITIAL DATA ============
export const INITIAL_GEO_DATA = {
  locations: [
    {
      id: 1,
      name: "Central Park",
      lat: 37.3605,
      lng: -122.0655,
      category: 'park',
      description: "Beautiful community park with playground",
      images: [],
      tags: ['playground', 'picnic', 'walking'],
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  paths: [],
  roads: [
    {
      id: 1,
      name: "Main Street",
      coordinates: [
        { lat: 37.3600, lng: -122.0700 },
        { lat: 37.3610, lng: -122.0680 },
        { lat: 37.3620, lng: -122.0650 }
      ],
      color: '#FF6B6B',
      type: 'main'
    }
  ]
};