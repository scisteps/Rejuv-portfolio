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
// Make sure LocationStatus is properly exported
// import LocationStatus from '../components/common/LocationStatus'; 
import './UserDashboard.css';

const UserDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.3605, lng: -122.0655 });
  const [mapZoom, setMapZoom] = useState(16);
  const [showTracker, setShowTracker] = useState(false);

  const { locations, paths, roads, selectedCategories, toggleCategory, getFilteredLocations } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();
  const { 
    userLocation, 
    loading: locationLoading, 
    error: locationError, 
    getUserLocation,
    isUsingFallback 
  } = useUserLocation();

  useEffect(() => {
    getUserLocation().then(position => {
      if (position) {
        setMapCenter({ lat: position.lat, lng: position.lng });
        setMapZoom(17);
      }
    });
  }, []);

  const handleRetryLocation = () => {
    getUserLocation();
  };

  const filteredLocations = getFilteredLocations();

  return (
    <div className="user-dashboard">
      <div className="user-header">
        <h1>🌍 Community Map</h1>
        <div className="user-controls">
          <button className="btn-location" onClick={handleRetryLocation}>
            📍 Update Location
          </button>
          <button className="btn-track" onClick={() => setShowTracker(!showTracker)}>
            {showTracker ? '📊 Hide Tracker' : '📊 Path Tracker'}
          </button>
        </div>
      </div>

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
              onCenterChange={setMapCenter}
              onZoomChange={setMapZoom}
            >
              {roads.map(road => (
                <Polyline
                  key={road.id}
                  path={road.coordinates}
                  strokeColor={road.color}
                  strokeWeight={3}
                  strokeOpacity={0.6}
                />
              ))}

              {path.length > 1 && (
                <Polyline
                  path={path}
                  strokeColor="#4285F4"
                  strokeWeight={4}
                  strokeOpacity={0.8}
                />
              )}

              {filteredLocations.map(location => (
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
                    scale: 1.2
                  }}
                  label={{
                    text: CATEGORY_ICONS[location.category] || '📍',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                />
              ))}

              {userLocation && (
                <Marker
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  icon={{
                    path: 'M0,-15 C-10,-15 -10,0 0,15 C10,0 10,-15 0,-15',
                    fillColor: isUsingFallback ? '#FF9800' : '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor: '#FFFFFF',
                    scale: 0.8
                  }}
                  label={{
                    text: '📍',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                />
              )}

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

          {/* Location Status - This is likely line 151 */}
          {locationError && (
            <div className="location-status error">
              <span className="status-icon">⚠️</span>
              <span>{locationError}</span>
              <button className="retry-btn" onClick={handleRetryLocation}>
                Retry
              </button>
            </div>
          )}
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