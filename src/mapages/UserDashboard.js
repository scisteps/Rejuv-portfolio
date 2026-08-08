// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  Polyline,
} from '@vis.gl/react-google-maps';
import { useGeoData } from '../hooks/useGeoData';
import { usePathTracking } from '../hooks/usePathTracking';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocationImages } from '../hooks/useLocationImages';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_TYPES } from '../utils/geoData';
import CategoryFilter from '../components/user/CategoryFilter';
import LocationDetails from '../components/user/LocationDetails';
import PathTracker from '../components/user/PathTracker';
import ImageViewer from '../components/user/ImageViewer';
import LocationForm from '../components/user/LocationForm';
import './UserDashboard.css';

// ── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };
const MAP_BOUNDS = {
  north: 0.3515, south: 0.3440,
  east: 32.5880, west: 32.5780,
};

// ── Storage meter ────────────────────────────────────────────────────────────
function StorageMeter({ locationImages, userId }) {
  const mine = locationImages.filter(img => img.userId === userId);
  const bytes = mine.reduce((s, img) => s + (img.fileSize || 0), 0);
  const mb = bytes / (1024 * 1024);
  const fmt = (v) => v < 1 ? `${(v * 1024).toFixed(0)} KB` : `${v.toFixed(1)} MB`;

  return (
    <div className="storage-meter">
      <div className="storage-meter-header">
        <span>📦 My uploads</span>
        <span className="storage-stats">{mine.length} photo{mine.length !== 1 ? 's' : ''} · {fmt(mb)}</span>
      </div>
      <p className="storage-note">No limit during beta</p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  // Map state
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(16);
  const [followUser, setFollowUser] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // UI states
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [viewingImages, setViewingImages] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [actionLocation, setActionLocation] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom hooks
  const {
    userLocation, 
    loading: locationLoading, 
    error: locationError,
    isUsingFallback, 
    accuracy, 
    getUserLocation, 
    startWatching, 
    stopWatching,
  } = useUserLocation();

  const { locations, roads, paths, selectedCategories, toggleCategory, getFilteredLocations } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();
  const { locationImages, userId } = useLocationImages();

  // ── Get location on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const initLocation = async () => {
      const position = await getUserLocation();
      if (position && position.lat && position.lng) {
        setMapCenter({ lat: position.lat, lng: position.lng });
        setMapZoom(17);
      }
    };
    initLocation();
    startWatching();
    return () => stopWatching();
  }, []);

  // Follow user when location updates
  useEffect(() => {
    if (userLocation && followUser && mapLoaded) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation, followUser, mapLoaded]);

  // ── Handlers ──
  const handleMapDrag = useCallback(() => {
    setFollowUser(false);
  }, []);

// Replace your handleMoveToLocation with this debug version
const handleMoveToLocation = async () => {
  console.log('📍 Move to location clicked');
  setIsRefreshing(true);
  setFollowUser(true);
  
  try {
    console.log('📍 Getting location...');
    const position = await getUserLocation();
    console.log('📍 Position received:', position);
    
    if (position && position.lat && position.lng) {
      console.log('📍 Setting map center to:', position.lat, position.lng);
      setMapCenter({ lat: position.lat, lng: position.lng });
      setMapZoom(18);
      setFollowUser(true);
      alert(`📍 Moved to: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
    } else {
      console.warn('⚠️ No location available');
      alert('Unable to get your location. Please check GPS.');
    }
  } catch (error) {
    console.error('❌ Error getting location:', error);
    alert('Error: ' + error.message);
  } finally {
    setIsRefreshing(false);
  }
};

  const handleOpenLocationForm = () => {
    if (!userLocation) {
      getUserLocation().then((pos) => {
        if (pos) {
          setActionLocation({ lat: pos.lat, lng: pos.lng });
          setShowLocationForm(true);
        } else {
          alert('Unable to get your location. Please enable GPS.');
        }
      });
      return;
    }
    setActionLocation({ lat: userLocation.lat, lng: userLocation.lng });
    setShowLocationForm(true);
  };

  const handleLocationSuccess = () => {
    setShowLocationForm(false);
    setActionLocation(null);
    alert('✅ Location saved successfully!');
  };

  // ── Computed values ──
  const imagePinGroups = locationImages.reduce((acc, img) => {
    const key = `${img.lat.toFixed(4)}_${img.lng.toFixed(4)}`;
    if (!acc[key]) acc[key] = { lat: img.lat, lng: img.lng, images: [] };
    acc[key].images.push(img);
    return acc;
  }, {});

  const filteredLocations = getFilteredLocations();
  
  const accuracyLabel = accuracy
    ? accuracy < 20 ? 'Excellent' : 
      accuracy < 50 ? 'Good' : 
      accuracy < 100 ? 'Fair' : 'Weak'
    : '';

  const accuracyColor = accuracy
    ? accuracy < 20 ? '#2e7d32' :
      accuracy < 50 ? '#4caf50' :
      accuracy < 100 ? '#ff9800' : '#f44336'
    : '#999';

  return (
    <div className="user-dashboard">
      {/* ── STYLES ── */}
      <style>{`
        @keyframes locationPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="user-header">
        <h1>📍 Geo WAY</h1>
        <div className="user-controls">
          <button 
            className="btn-location" 
            onClick={handleMoveToLocation}
            disabled={locationLoading || isRefreshing}
          >
            {isRefreshing ? (
              <span className="btn-spinner"></span>
            ) : locationLoading ? (
              '⏳ Locating...'
            ) : (
              '📍 My Location'
            )}
          </button>
          <button 
            className="btn-refresh" 
            onClick={handleMoveToLocation}
            disabled={locationLoading || isRefreshing}
            title="Refresh location"
          >
            {isRefreshing ? '⏳' : '🔄'}
          </button>
          <button 
            className="btn-track" 
            onClick={() => setShowTracker(!showTracker)}
          >
            {showTracker ? '📊 Hide Tracker' : '📊 Track Path'}
          </button>
        </div>
      </div>

      {/* ── STATUS BANNERS ── */}
      {locationError && (
        <div className="location-banner error">
          ⚠️ {locationError} 
          <button onClick={handleMoveToLocation} disabled={isRefreshing}>
            {isRefreshing ? '⏳' : 'Retry'}
          </button>
        </div>
      )}
      
      {!locationError && userLocation && (
        <div className={`location-banner ${isUsingFallback ? 'warning' : 'success'}`}>
          {isUsingFallback ? (
            '📍 Approximate location — GPS upgrading...'
          ) : (
            <>
              <span className="status-dot" style={{ background: accuracyColor }}></span>
              ✅ Live GPS · {accuracyLabel}
              <span className="accuracy-badge">±{Math.round(accuracy || 0)}m</span>
            </>
          )}
        </div>
      )}
      
      {locationLoading && !userLocation && (
        <div className="location-banner info">
          <span className="spinner-small"></span>
          Finding your location...
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="user-layout">
        {/* Sidebar */}
        {/* <div className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            categories={Object.values(CATEGORY_TYPES)}
          />
          <StorageMeter locationImages={locationImages} userId={userId} />
        </div> */}

        {/* Map Container */}
        <div className="map-container">
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              gestureHandling="greedy"
              onCenterChanged={(e) => {
                setMapCenter(e.detail.center);
                if (mapLoaded) {
                  setFollowUser(false);
                }
              }}
              onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
              onDrag={handleMapDrag}
              onLoad={() => setMapLoaded(true)}
              // Remove mapId if you don't have one
              // mapId={process.env.REACT_APP_MAP_ID}
              restriction={{ latLngBounds: MAP_BOUNDS, strictBounds: true }}
              minZoom={15}
              maxZoom={20}
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

              {/* Saved paths */}
              {paths && paths.map(p => (
                <Polyline 
                  key={p.id} 
                  path={p.coordinates}
                  strokeColor="#34A853" 
                  strokeWeight={2} 
                  strokeOpacity={0.4} 
                />
              ))}

              {/* Active tracking path */}
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
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  onClick={() => setSelectedLocation(location)}
                  icon={{
                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                    fillColor: CATEGORY_COLORS[location.category] || '#636E72',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    scale: 1.2,
                  }}
                  label={{ 
                    text: CATEGORY_ICONS[location.category] || '📍', 
                    fontSize: '12px' 
                  }}
                />
              ))}

              {/* Camera pins */}
              {Object.values(imagePinGroups).map(group => (
                <Marker
                  key={`img_${group.lat}_${group.lng}`}
                  position={{ lat: group.lat, lng: group.lng }}
                  zIndex={500}
                  onClick={() => setViewingImages(group.images)}
                  icon={{
                    path: 'M0,-20 C-15,-20 -20,-5 0,15 C20,-5 15,-20 0,-20',
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    scale: 0.8
                  }}
                  label={{ text: '📸', fontSize: '14px', fontWeight: 'bold' }}
                />
              ))}

              {/* User Location Pin */}
              {userLocation && (
                <Marker
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  zIndex={1000}
                  onClick={handleOpenLocationForm}
                  icon={{
                    path: 'M 0,-24 C -10,-24 -14,-10 -8,-2 L 0,12 L 8,-2 C 14,-10 10,-24 0,-24 Z',
                    fillColor: isUsingFallback ? '#FF9800' : '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2.5,
                    strokeColor: '#FFFFFF',
                    scale: 1.2,
                  }}
                  label={{
                    text: '📍',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    className: 'user-location-label'
                  }}
                  title="You are here — tap to add details"
                />
              )}

              {/* Info Window */}
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

          {/* ── FLOATING BUTTONS ── */}
          <button 
            className="floating-add-btn"
            onClick={handleOpenLocationForm}
            title="Add location at your current GPS position"
          >
            <span className="btn-icon">📍</span>
            <span className="btn-text">Add Location</span>
          </button>

          {!followUser && userLocation && (
            <button className="recenter-btn" onClick={handleMoveToLocation}>
              📍
            </button>
          )}

          {userLocation && !isUsingFallback && (
            <div className="accuracy-indicator">
              <span className="accuracy-dot" style={{ background: accuracyColor }}></span>
              <span className="accuracy-text">±{Math.round(accuracy || 0)}m</span>
            </div>
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

      {/* ── MODALS ── */}
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

      {viewingImages && (
        <ImageViewer images={viewingImages} onClose={() => setViewingImages(null)} />
      )}
    </div>
  );
}