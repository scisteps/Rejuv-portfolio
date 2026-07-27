// src/hooks/useGeoData.js
import { useState, useEffect } from 'react';
import { geoDataService } from '../services/geoDataService';
import { INITIAL_GEO_DATA } from '../utils/geoData';

export function useGeoData() {
  const [locations, setLocations] = useState([]);
  const [paths, setPaths] = useState([]);
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locationsData, pathsData] = await Promise.all([
        geoDataService.getLocations(),
        geoDataService.getPaths()
      ]);

      setLocations(locationsData || INITIAL_GEO_DATA.locations);
      setPaths(pathsData || INITIAL_GEO_DATA.paths);
      setRoads(INITIAL_GEO_DATA.roads);
    } catch (err) {
      console.error('Failed to load geo data:', err);
      setError(err.message);
      setLocations(INITIAL_GEO_DATA.locations);
      setPaths(INITIAL_GEO_DATA.paths);
      setRoads(INITIAL_GEO_DATA.roads);
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (locationData) => {
    try {
      const saved = await geoDataService.addLocation(locationData);
      setLocations(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('Failed to add location:', err);
      throw err;
    }
  };

  const updateLocation = async (locationId, data) => {
    setLocations(prev => 
      prev.map(loc => 
        loc.id === locationId ? { ...loc, ...data } : loc
      )
    );
    try {
      await geoDataService.updateLocation(locationId, data);
    } catch (err) {
      console.error('Failed to update location:', err);
      await loadData();
      throw err;
    }
  };

  const deleteLocation = async (locationId) => {
    try {
      await geoDataService.deleteLocation(locationId);
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
    } catch (err) {
      console.error('Failed to delete location:', err);
      throw err;
    }
  };

  const savePath = async (pathData) => {
    try {
      const saved = await geoDataService.savePath(pathData);
      setPaths(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('Failed to save path:', err);
      throw err;
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getFilteredLocations = () => {
    if (selectedCategories.length === 0) return locations;
    return locations.filter(loc => selectedCategories.includes(loc.category));
  };

  return {
    locations,
    paths,
    roads,
    loading,
    error,
    selectedCategories,
    addLocation,
    updateLocation,
    deleteLocation,
    savePath,
    toggleCategory,
    getFilteredLocations,
    refreshData: loadData
  };
}