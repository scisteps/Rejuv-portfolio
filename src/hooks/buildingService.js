// src/services/buildingService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const buildingService = {
  async getBuildings() {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings`);
      if (!response.ok) throw new Error('Failed to fetch buildings');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data:', error);
      return null;
    }
  },

  async updateBuildingPosition(buildingId, lat, lng) {
    const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}/position`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    });
    if (!response.ok) throw new Error('Failed to update position');
    return await response.json();
  },

  async updateBuilding(buildingId, updates) {
    const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update building');
    return await response.json();
  },

  async addBuilding(buildingData) {
    const response = await fetch(`${API_BASE_URL}/buildings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildingData)
    });
    if (!response.ok) throw new Error('Failed to add building');
    return await response.json();
  },

  async deleteBuilding(buildingId) {
    const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete building');
    return true;
  },

  async getBuildingImages(buildingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}/images`);
      if (!response.ok) throw new Error('Failed to fetch images');
      return await response.json();
    } catch (error) {
      console.warn('Using default images:', error);
      const building = await this.getBuildings();
      const found = building?.find(b => b.id === buildingId);
      return { images: found?.images || [] };
    }
  },

  async updateBuildingImages(buildingId, images) {
    const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}/images`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images })
    });
    if (!response.ok) throw new Error('Failed to update images');
    return await response.json();
  }
};