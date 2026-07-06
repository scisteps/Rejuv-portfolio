// src/components/CampusMap/CampusMap.jsx
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import CampusBuilding from '../components/CampusBuilding';
import MapControls from '../components/MapControls';
import SearchBar from '../components/SearchBar';
import RoutePlanner from '../components/RoutePlanner';
import { useBuildings } from '../hooks/useBuildings';
import { useUserLocation } from '../hooks/useUserLocation';
import { MAP_CONFIG } from '../utils/constants';
import './CampusMap.css';

function CampusMap() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [isDraggingMode, setIsDraggingMode] = useState(false);
  const [mapCenter, setMapCenter] = useState(MAP_CONFIG.DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(MAP_CONFIG.DEFAULT_ZOOM);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Custom hooks for data management
  const { buildings, updateBuildingPosition } = useBuildings();
  const { userLocation, getUserLocation } = useUserLocation();

  // Check if API key is available
  useEffect(() => {
    if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
      setMapError('Google Maps API key is missing. Please check your environment variables.');
    }
  }, []);

  // Handlers
  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setMapCenter({ lat: building.lat, lng: building.lng });
    setMapZoom(18);
  };

  const handleBuildingPositionUpdate = (buildingId, newLat, newLng) => {
    updateBuildingPosition(buildingId, newLat, newLng);
  };

  const handleToggleMap = () => setShowMap(!showMap);
  const handleToggleDragMode = () => setIsDraggingMode(!isDraggingMode);

  if (mapError) {
    return <div className="map-error">{mapError}</div>;
  }

  return (
    <div className="campus-map-container">
      {/* Controls Panel */}
      <div className="controls-panel">
        <MapControls
          onGetLocation={getUserLocation}
          onToggleMap={handleToggleMap}
          onToggleDragMode={handleToggleDragMode}
          isDraggingMode={isDraggingMode}
          showMap={showMap}
        />
        
        <SearchBar 
          locations={buildings} 
          onSelect={handleBuildingSelect}
        />
        
        {selectedBuilding && (
          <RoutePlanner 
            from={userLocation}
            to={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        )}
      </div>

      {/* Map Layer */}
      <div className={`map-layer ${!showMap ? 'hidden' : ''}`}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapId={process.env.REACT_APP_MAP_ID}
            onCenterChange={(center) => setMapCenter(center)}
            onZoomChange={(zoom) => setMapZoom(zoom)}
            onLoad={() => setMapLoaded(true)}
          >
            {buildings.map((building) => (
              <CampusBuilding
                key={building.id}
                building={building}
                onSelect={handleBuildingSelect}
                onPositionUpdate={handleBuildingPositionUpdate}
                isSelected={selectedBuilding?.id === building.id}
                isDraggable={isDraggingMode}
              />
            ))}
          </Map>
        </APIProvider>
      </div>

      {/* Static Background Layer */}
      {!showMap && (
        <StaticBackgroundLayer 
          buildings={buildings}
          onBuildingSelect={handleBuildingSelect}
        />
      )}
    </div>
  );
}

// Static Background Layer Component
function StaticBackgroundLayer({ buildings, onBuildingSelect }) {
  return (
    <div className="static-background-layer">
      <img 
        src="/images/campus-map-background.jpg" 
        alt="Campus Map"
        className="static-bg-image"
      />
      <div className="static-markers">
        {buildings.map((building) => (
          <StaticMarker 
            key={building.id}
            building={building}
            onClick={() => onBuildingSelect(building)}
          />
        ))}
      </div>
    </div>
  );
}

function StaticMarker({ building, onClick }) {
  // Calculate percentage positions based on map bounds
  const position = calculateStaticPosition(building.lat, building.lng);
  
  return (
    <div 
      className="static-marker"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%` 
      }}
      onClick={onClick}
    >
      <img src={building.imageUrl} alt={building.name} />
      <span>{building.name}</span>
    </div>
  );
}

function calculateStaticPosition(lat, lng) {
  // Adjust these values based on your static image bounds
  const bounds = {
    north: 37.365,
    south: 37.355,
    east: -122.058,
    west: -122.072
  };
  
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
  
  return { x, y };
}

export default CampusMap;