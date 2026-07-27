// src/services/geoDataService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const geoDataService = {
  async getLocations() {
    try {
      const response = await fetch(`${API_BASE_URL}/geo/locations`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data:', error);
      return null;
    }
  },

  async addLocation(locationData) {
    const response = await fetch(`${API_BASE_URL}/geo/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });
    if (!response.ok) throw new Error('Failed to add location');
    return await response.json();
  },

  async updateLocation(locationId, data) {
    const response = await fetch(`${API_BASE_URL}/geo/locations/${locationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update location');
    return await response.json();
  },

  async deleteLocation(locationId) {
    const response = await fetch(`${API_BASE_URL}/geo/locations/${locationId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete location');
    return true;
  },

  async savePath(pathData) {
    const response = await fetch(`${API_BASE_URL}/geo/paths`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pathData)
    });
    if (!response.ok) throw new Error('Failed to save path');
    return await response.json();
  },

  async getPaths() {
    try {
      const response = await fetch(`${API_BASE_URL}/geo/paths`);
      if (!response.ok) throw new Error('Failed to fetch paths');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data:', error);
      return null;
    }
  }
};