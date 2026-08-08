// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Marker, Overlay, Polyline, useMap } from 'googlemaps-react-primitives';
import MapWrapper from '../components/map/MapWrapper';
import { useGeoData } from '../hooks/useGeoData';
import { usePathTracking } from '../hooks/usePathTracking';
import { useUserLocation } from '../hooks/useUserLocation';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_TYPES } from '../utils/geoData';
import CategoryFilter from '../components/user/CategoryFilter';
import LocationDetails from '../components/user/LocationDetails';
import PathTracker from '../components/user/PathTracker';
import LocationForm from '../components/user/LocationForm';
import './UserDashboard.css';
const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };
const DEFAULT_ZOOM = 16;

// ── Custom Components using useMap ──

// User Location Marker Component
function UserLocationMarker({ position, isUsingFallback, onClick }) {
  const map = useMap();
  const color = isUsingFallback ? '#FF9800' : '#4285F4';
  
  if (!map) return null;
  
  return (
    <Marker
      position={position}
      onClick={onClick}
      icon={{
        path: 'M 0,-24 C -10,-24 -14,-10 -8,-2 L 0,12 L 8,-2 C 14,-10 10,-24 0,-24 Z',
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2.5,
        strokeColor: '#FFFFFF',
        scale: 1.2,
        anchor: new window.google.maps.Point(0, 0)

      }}
      label={{
        text: '📍',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
      title="You are here — tap to add details"
    />
  );
}

// Location Marker Component
function LocationMarker({ location, onClick }) {
  const map = useMap();
  
  if (!map) return null;
  
  return (
    <Marker
      position={{ lat: location.lat, lng: location.lng }}
      onClick={onClick}
      icon={{
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: CATEGORY_COLORS[location.category] || '#636E72',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 1.2,
        anchor: new window.google.maps.Point(0, 0)

      }}
      label={{
        text: CATEGORY_ICONS[location.category] || '📍',
        fontSize: '12px',
        fontWeight: 'bold'
      }}
    />
  );
}

// ── Main Component ──
export default function UserDashboard() {
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [actionLocation, setActionLocation] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { 
    userLocation, 
    loading: locationLoading, 
    error: locationError,
    isUsingFallback, 
    accuracy, 
    getUserLocation 
  } = useUserLocation();

  const { locations, roads, paths, selectedCategories, toggleCategory, getFilteredLocations } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();

  // Get location on mount
  useEffect(() => {
    getUserLocation().then((pos) => {
      if (pos) {
        setMapCenter({ lat: pos.lat, lng: pos.lng });
        setMapZoom(17);
      }
    });
  }, []);

  // ── Handlers ──
  const handleMoveToLocation = async () => {
    setIsRefreshing(true);
    try {
      const position = await getUserLocation();
      if (position) {
        setMapCenter({ lat: position.lat, lng: position.lng });
        setMapZoom(18);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenLocationForm = () => {
    if (userLocation) {
      setActionLocation({ lat: userLocation.lat, lng: userLocation.lng });
      setShowLocationForm(true);
    } else {
      getUserLocation().then((pos) => {
        if (pos) {
          setActionLocation({ lat: pos.lat, lng: pos.lng });
          setShowLocationForm(true);
        } else {
          alert('Unable to get your location. Please enable GPS.');
        }
      });
    }
  };

  const handleLocationSuccess = () => {
    setShowLocationForm(false);
    setActionLocation(null);
  };

  const filteredLocations = getFilteredLocations();

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="user-header">
        <h1>📍 Geo WAY</h1>
        <div className="user-controls">
          <button 
            className="btn-location" 
            onClick={handleMoveToLocation}
            disabled={locationLoading || isRefreshing}
          >
            {isRefreshing ? '⏳' : '📍 My Location'}
          </button>
          <button 
            className="btn-track" 
            onClick={() => setShowTracker(!showTracker)}
          >
            {showTracker ? '📊 Hide' : '📊 Track'}
          </button>
        </div>
      </header>

      {/* Status Banner */}
      {locationError && (
        <div className="location-banner error">
          ⚠️ {locationError}
          <button onClick={handleMoveToLocation}>Retry</button>
        </div>
      )}
      
      {!locationError && userLocation && (
        <div className={`location-banner ${isUsingFallback ? 'warning' : 'success'}`}>
          {isUsingFallback ? '📍 Approximate location' : '✅ GPS Active'}
          {accuracy && <span className="accuracy-badge">±{Math.round(accuracy)}m</span>}
        </div>
      )}

      {/* Main Layout */}
      <div className="user-layout">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            categories={Object.values(CATEGORY_TYPES)}
          />
        </aside>

        {/* Map */}
        <div className="map-container">
          <MapWrapper
            center={mapCenter}
            zoom={mapZoom}
            onClick={() => {}}
            onBoundsChanged={() => {}}
            onZoomChanged={(zoom) => setMapZoom(zoom)}
          >
            {/* Roads */}
            {roads.map(road => (
              <Polyline
                key={road.id}
                path={road.coordinates}
                strokeColor={road.color}
                strokeWeight={3}
                strokeOpacity={0.6}
              />
            ))}

            {/* Paths */}
            {path.length > 1 && (
              <Polyline
                path={path}
                strokeColor="#4285F4"
                strokeWeight={4}
                strokeOpacity={0.85}
              />
            )}

            {/* Location Markers */}
            {filteredLocations.map(location => (
              <LocationMarker 
                key={location.id} 
                location={location}
                onClick={() => setSelectedLocation(location)}
              />
            ))}

            {/* User Location */}
            {userLocation && (
              <UserLocationMarker 
                position={{ lat: userLocation.lat, lng: userLocation.lng }}
                isUsingFallback={isUsingFallback}
                onClick={handleOpenLocationForm}
              />
            )}

            {/* Info Window Overlay */}
            {selectedLocation && (
              <Overlay position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}>
                <div className="custom-info-window">
                  <button 
                    className="info-close"
                    onClick={() => setSelectedLocation(null)}
                  >
                    ✕
                  </button>
                  <LocationDetails location={selectedLocation} />
                </div>
              </Overlay>
            )}
          </MapWrapper>

          {/* Floating Buttons */}
          <button 
            className="floating-add-btn"
            onClick={handleOpenLocationForm}
          >
            📍 Add Location
          </button>

          {!userLocation && (
            <button 
              className="recenter-btn" 
              onClick={handleMoveToLocation}
            >
              📍
            </button>
          )}
        </div>

        {/* Tracker Panel */}
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

      {/* Location Form Modal */}
      {showLocationForm && actionLocation && (
        <LocationForm
          lat={actionLocation.lat}
          lng={actionLocation.lng}
          onClose={() => {
            setShowLocationForm(false);
            setActionLocation(null);
          }}
          onSuccess={handleLocationSuccess}
        />
      )}
    </div>
  );
}