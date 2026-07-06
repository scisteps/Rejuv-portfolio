// src/hooks/useBuildings.js
import { useState, useEffect } from 'react';
import { buildingService } from './buildingService';
import { INITIAL_BUILDINGS } from '../utils/campusData';

export function useBuildings() {
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    setLoading(true);
    try {
      const data = await buildingService.getBuildings();
      if (data && data.length > 0) {
        // Merge API data with initial data to ensure all fields are present
        const mergedData = data.map(apiBuilding => {
          const initialBuilding = INITIAL_BUILDINGS.find(b => b.id === apiBuilding.id);
          return { ...initialBuilding, ...apiBuilding };
        });
        setBuildings(mergedData);
      }
    } catch (err) {
      console.error('Failed to load buildings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBuildingPosition = async (buildingId, newLat, newLng) => {
    setBuildings(prev => 
      prev.map(building => 
        building.id === buildingId 
          ? { ...building, lat: newLat, lng: newLng }
          : building
      )
    );

    try {
      await buildingService.updateBuildingPosition(buildingId, newLat, newLng);
    } catch (err) {
      console.error('Failed to save building position:', err);
      // Revert on error
      await loadBuildings();
      throw err;
    }
  };

  const updateBuildingData = async (buildingId, updates) => {
    setBuildings(prev => 
      prev.map(building => 
        building.id === buildingId 
          ? { ...building, ...updates }
          : building
      )
    );

    try {
      await buildingService.updateBuilding(buildingId, updates);
    } catch (err) {
      console.error('Failed to update building data:', err);
      await loadBuildings();
      throw err;
    }
  };

  const addBuilding = async (newBuilding) => {
    try {
      const saved = await buildingService.addBuilding(newBuilding);
      setBuildings(prev => [...prev, { ...newBuilding, ...saved }]);
      return saved;
    } catch (err) {
      console.error('Failed to add building:', err);
      throw err;
    }
  };

  const deleteBuilding = async (buildingId) => {
    try {
      await buildingService.deleteBuilding(buildingId);
      setBuildings(prev => prev.filter(b => b.id !== buildingId));
    } catch (err) {
      console.error('Failed to delete building:', err);
      throw err;
    }
  };

  // New: Get buildings by type
  const getBuildingsByType = (type) => {
    return buildings.filter(b => b.type === type);
  };

  // New: Get buildings by category
  const getBuildingsByCategory = (category) => {
    return buildings.filter(b => b.category === category);
  };

  return {
    buildings,
    loading,
    error,
    updateBuildingPosition,
    updateBuildingData,
    addBuilding,
    deleteBuilding,
    getBuildingsByType,
    getBuildingsByCategory,
    refreshBuildings: loadBuildings
  };
}