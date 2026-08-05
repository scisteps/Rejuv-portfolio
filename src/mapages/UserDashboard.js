// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow, Polyline } from '@vis.gl/react-google-maps';
import { useGeoData } from '../hooks/useGeoData';
import { usePathTracking } from '../hooks/usePathTracking';
import { useUserLocation } from '../hooks/useUserLocation';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_TYPES } from '../utils/geoData';
import CategoryFilter from '../components/user/CategoryFilter';
import LocationDetails from '../components/user/LocationDetails';
import PathTracker from '../components/user/PathTracker';
import './UserDashboard.css';

// Makerere University bounds — map cannot scroll outside campus
const MAKERERE_BOUNDS = {
  north: 0.3515,
  south: 0.3440,
  east: 32.5880,
  west: 32.5780,
};

// Makerere University center
const MAKERERE_CENTER = {
  lat: 0.3476,
  lng: 32.5825
};

const UserDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [mapCenter, setMapCenter] = useState(MAKERERE_CENTER);
  const [mapZoom, setMapZoom] = useState(16);

  const { locations, paths, roads, selectedCategories, toggleCategory, getFilteredLocations } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();
  const { 
    userLocation, 
    loading: locationLoading, 
    error: locationError, 
    isUsingFallback, 
    getUserLocation 
  } = useUserLocation();

  // Get real GPS on mount and pan the map to it
  useEffect(() => {
    getUserLocation().then((position) => {
      if (position) {
        setMapCenter({ lat: position.lat, lng: position.lng });
        setMapZoom(18);
      }
    });
  }, []);

  // Keep map centered on user as they move (only while tracking)
  useEffect(() => {
    if (isTracking && userLocation) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation, isTracking]);

  const handleCenterOnUser = () => {
    getUserLocation().then((pos) => {
      if (pos) {
        setMapCenter({ lat: pos.lat, lng: pos.lng });
        setMapZoom(18);
      }
    });
  };

  const filteredLocations = getFilteredLocations();

  // Custom user location marker icon (no google object needed)
  const userMarkerIcon = {
    path: 'M0,-15 C-10,-15 -10,0 0,15 C10,0 10,-15 0,-15',
    fillColor: isUsingFallback ? '#FF9800' : '#4285F4',
    fillOpacity: 1,
    strokeWeight: 3,
    strokeColor: '#FFFFFF',
    scale: 0.8
  };

  return (
    <div className="user-dashboard">
      <div className="user-header">
        <h1>🎓 Makerere Campus Map</h1>
        <div className="user-controls">
          <button
            className="btn-location"
            onClick={handleCenterOnUser}
            disabled={locationLoading}
          >
            {locationLoading ? '⏳ Getting location...' : '📍 My Location'}
          </button>
          <button className="btn-track" onClick={() => setShowTracker(!showTracker)}>
            {showTracker ? '📊 Hide Tracker' : '📊 Path Tracker'}
          </button>
        </div>
      </div>

      {/* Location status banner */}
      {locationError && (
        <div className="location-banner error">
          ⚠️ {locationError}
          <button onClick={handleCenterOnUser}>Retry</button>
        </div>
      )}
      {isUsingFallback && !locationError && (
        <div className="location-banner warning">
          📍 Showing Makerere campus center — enable GPS for your exact location
        </div>
      )}

      <div className="user-layout">
        <div className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            categories={Object.values(CATEGORY_TYPES)}
          />
        </div>

        <div className="map-container">
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              gestureHandling="greedy"
              onCenterChange={(center) => setMapCenter(center)}
              onZoomChange={(zoom) => setMapZoom(zoom)}
              // Lock map to Makerere campus only
              restriction={{
                latLngBounds: MAKERERE_BOUNDS,
                strictBounds: true,
              }}
              minZoom={15}
              maxZoom={20}
            >
              {/* Campus roads */}
              {roads.map((road) => (
                <Polyline
                  key={road.id}
                  path={road.coordinates}
                  strokeColor={road.color}
                  strokeWeight={3}
                  strokeOpacity={0.6}
                />
              ))}

              {/* User's recorded path while tracking */}
              {path.length > 1 && (
                <Polyline
                  path={path}
                  strokeColor="#4285F4"
                  strokeWeight={4}
                  strokeOpacity={0.8}
                />
              )}

              {/* Campus location markers */}
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  onClick={() => setSelectedLocation(location)}
                  icon={{
                    path: 'M0,-15 C-10,-15 -10,0 0,15 C10,0 10,-15 0,-15',
                    fillColor: CATEGORY_COLORS[location.category] || '#636E72',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    scale: 1.2,
                  }}
                  label={{
                    text: CATEGORY_ICONS[location.category] || '📍',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                />
              ))}

              {/* User's current GPS position */}
              {userLocation && (
                <Marker
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  icon={userMarkerIcon}
                  title="You are here"
                  zIndex={1000}
                />
              )}

              {/* Info window for selected location */}
              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <LocationDetails location={selectedLocation} />
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {showTracker && (
          <div className="tracker-panel">
            <PathTracker
              isTracking={isTracking}
              path={path}
              pathStats={pathStats}
              onStartTracking={startTracking}
              onStopTracking={stopTracking}
              onClearPath={clearPath}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;