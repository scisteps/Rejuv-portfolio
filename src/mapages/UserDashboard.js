// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  Polyline,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { useGeoData } from '../hooks/useGeoData';
import { usePathTracking } from '../hooks/usePathTracking';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocationImages } from '../hooks/useLocationImages';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_TYPES } from '../utils/geoData';
import CategoryFilter from '../components/user/CategoryFilter';
import LocationDetails from '../components/user/LocationDetails';
import PathTracker from '../components/user/PathTracker';
import ImageUploadPanel from '../components/user/ImageUploadPanel';
import ImageViewer from '../components/user/ImageViewer';
import './UserDashboard.css';

// ── Constants ────────────────────────────────────────────────────────────────
const MAKERERE_CENTER = { lat: 0.3476, lng: 32.5825 };
const MAKERERE_BOUNDS = {
  north: 0.3515, south: 0.3440,
  east: 32.5880, west: 32.5780,
};

// ── User location pin — pure CSS, no google global ───────────────────────────
function UserPin({ isUsingFallback, accuracy }) {
  const color = isUsingFallback ? '#FF9800' : '#4285F4';
  // Accuracy ring: ~10px per 10m at zoom 18 — clamp between 28 and 80px
  const ringSize = Math.min(80, Math.max(28, (accuracy || 20) * 0.8));

  return (
    <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Accuracy radius */}
      <div style={{
        position: 'absolute',
        width: ringSize, height: ringSize,
        borderRadius: '50%',
        background: color + '18',
        border: `1px solid ${color}44`,
        pointerEvents: 'none',
      }} />
      {/* Pulse ring */}
      <div style={{
        position: 'absolute',
        width: 44, height: 44,
        borderRadius: '50%',
        background: color + '20',
        border: `1.5px solid ${color}60`,
        animation: 'locationPulse 2s ease-out infinite',
        pointerEvents: 'none',
      }} />
      {/* White halo */}
      <div style={{
        position: 'absolute', width: 22, height: 22,
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }} />
      {/* Colored center */}
      <div style={{
        position: 'absolute', width: 14, height: 14,
        borderRadius: '50%', background: color,
      }} />
    </div>
  );
}

// ── Camera pin for saved photos ──────────────────────────────────────────────
function CameraPin({ count }) {
  return (
    <div style={{
      position: 'relative',
      background: '#1a1a2e', border: '2.5px solid #fff',
      borderRadius: '50%', width: 36, height: 36,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 17, boxShadow: '0 3px 10px rgba(0,0,0,0.45)', cursor: 'pointer',
    }}>
      📸
      {count > 1 && (
        <div style={{
          position: 'absolute', top: -6, right: -6,
          background: '#E53935', color: '#fff',
          borderRadius: '50%', width: 18, height: 18,
          fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid #fff',
        }}>
          {count}
        </div>
      )}
    </div>
  );
}

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
  // Map never waits for GPS — starts at Makerere immediately
  const [mapCenter, setMapCenter] = useState(MAKERERE_CENTER);
  const [mapZoom, setMapZoom] = useState(16);
  const [followUser, setFollowUser] = useState(true); // pan map as location updates

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [viewingImages, setViewingImages] = useState(null);

  const {
    userLocation, loading: locationLoading, error: locationError,
    isUsingFallback, accuracy, getUserLocation, startWatching, stopWatching,
    MAKERERE_CENTER: MC,
  } = useUserLocation();

  const { locations, roads, paths, selectedCategories, toggleCategory, getFilteredLocations } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();
  const { locationImages, uploading, uploadProgress, error: uploadError, userId, uploadImageAtLocation } = useLocationImages();

  // ── Get location immediately on mount ─────────────────────────────────────
  // Map is already visible at Makerere center. getUserLocation resolves fast
  // (phase 1: coarse, <1s) then silently upgrades to GPS in background.
  useEffect(() => {
    getUserLocation().then((pos) => {
      if (pos && followUser) {
        setMapCenter({ lat: pos.lat, lng: pos.lng });
        setMapZoom(18);
      }
    });
    // Start continuous watch so pin updates as user walks
    startWatching();
    return () => stopWatching();
  }, []);

  // Pan map to follow user only if followUser is on and not manually panned
  useEffect(() => {
    if (userLocation && followUser) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation, followUser]);

  // Stop following when user manually pans the map
  const handleMapDrag = useCallback(() => setFollowUser(false), []);

  const handleCenterOnUser = () => {
    if (userLocation) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
      setMapZoom(18);
      setFollowUser(true);
    } else {
      getUserLocation().then((pos) => {
        if (pos) { setMapCenter({ lat: pos.lat, lng: pos.lng }); setMapZoom(18); setFollowUser(true); }
      });
    }
  };

  // Group camera pins by rounded lat/lng
  const imagePinGroups = locationImages.reduce((acc, img) => {
    const key = `${img.lat.toFixed(4)}_${img.lng.toFixed(4)}`;
    if (!acc[key]) acc[key] = { lat: img.lat, lng: img.lng, images: [] };
    acc[key].images.push(img);
    return acc;
  }, {});

  const filteredLocations = getFilteredLocations();

  const accuracyLabel = accuracy
    ? accuracy < 20 ? `±${Math.round(accuracy)}m · GPS` : `±${Math.round(accuracy)}m · Network`
    : '';

  return (
    <div className="user-dashboard">
      <style>{`
        @keyframes locationPulse {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="user-header">
        <h1> Geo WAY</h1>
        <div className="user-controls">
          <button className="btn-location" onClick={handleCenterOnUser} disabled={locationLoading}>
            {locationLoading ? '⏳ Locating...' : '📍 My Location'}
          </button>
          <button className="btn-camera" onClick={() => {
            if (!userLocation) { alert('Waiting for GPS — try again in a moment.'); return; }
            setShowUploadPanel(true);
          }}>
            📸 Add Photo
          </button>
          <button className="btn-track" onClick={() => setShowTracker(!showTracker)}>
            {showTracker ? '📊 Hide Tracker' : '📊 Track Path'}
          </button>
        </div>
      </div>

      {/* Status banners */}
      {locationError && (
        <div className="location-banner error">
          ⚠️ {locationError} <button onClick={handleCenterOnUser}>Retry</button>
        </div>
      )}
      {!locationError && userLocation && (
        <div className={`location-banner ${isUsingFallback ? 'warning' : 'success'}`}>
          {isUsingFallback
            ? '📍 Approximate location — GPS upgrading...'
            : `✅ Live GPS · ${accuracyLabel}`}
        </div>
      )}
      {locationLoading && !userLocation && (
        <div className="location-banner info">⏳ Finding your location...</div>
      )}

      <div className="user-layout">
        {/* Sidebar */}
        <div className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            categories={Object.values(CATEGORY_TYPES)}
          />
          <StorageMeter locationImages={locationImages} userId={userId} />
        </div>

        {/* Map — renders immediately, no waiting */}
        <div className="map-container">
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              gestureHandling="greedy"
              onCenterChanged={(e) => setMapCenter(e.detail.center)}
              onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
              onDrag={handleMapDrag}
              mapId={process.env.REACT_APP_MAP_ID || 'campus-map'}
              restriction={{ latLngBounds: MAKERERE_BOUNDS, strictBounds: true }}
              minZoom={15}
              maxZoom={20}
            >
              {/* Roads */}
              {roads.map(road => (
                <Polyline key={road.id} path={road.coordinates}
                  strokeColor={road.color} strokeWeight={3} strokeOpacity={0.6} />
              ))}

              {/* Saved paths */}
              {paths && paths.map(p => (
                <Polyline key={p.id} path={p.coordinates}
                  strokeColor="#34A853" strokeWeight={2} strokeOpacity={0.4} />
              ))}

              {/* Active recording path */}
              {path.length > 1 && (
                <Polyline path={path} strokeColor="#4285F4" strokeWeight={4} strokeOpacity={0.85} />
              )}

              {/* Campus building markers */}
              {filteredLocations.map(location => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  onClick={() => setSelectedLocation(location)}
                  icon={{
                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                    fillColor: CATEGORY_COLORS[location.category] || '#636E72',
                    fillOpacity: 1, strokeWeight: 2, strokeColor: '#FFFFFF', scale: 1.2,
                  }}
                  label={{ text: CATEGORY_ICONS[location.category] || '📍', fontSize: '12px' }}
                />
              ))}

              {/* Camera pins — one per unique location */}
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
    label={{
      text: '📸',
      fontSize: '14px',
      fontWeight: 'bold'
    }}
  />
))}

              {/* Live user pin — tap to add photo */}
          {userLocation && (
  <Marker
    position={{ lat: userLocation.lat, lng: userLocation.lng }}
    zIndex={1000}
    title="You are here — tap to add a photo"
    onClick={() => setShowUploadPanel(true)}
    icon={{
      path: 'M0,-15 C-10,-15 -10,0 0,15 C10,0 10,-15 0,-15',
      fillColor: isUsingFallback ? '#FF9800' : '#4285F4',
      fillOpacity: 1,
      strokeWeight: 3,
      strokeColor: '#FFFFFF',
      scale: 0.8
    }}
  />
)}

              {/* Building info window */}
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

          {/* Re-center button — visible when user has panned away */}
          {!followUser && userLocation && (
            <button className="recenter-btn" onClick={handleCenterOnUser}>
              📍 Re-center
            </button>
          )}
        </div>

        {/* Path tracker panel */}
        {showTracker && (
          <div className="tracker-panel">
            <PathTracker
              isTracking={isTracking} path={path} pathStats={pathStats}
              onStartTracking={startTracking} onStopTracking={stopTracking} onClearPath={clearPath}
            />
          </div>
        )}
      </div>

      {/* Upload panel */}
      {showUploadPanel && userLocation && (
        <ImageUploadPanel
          lat={userLocation.lat} lng={userLocation.lng}
          onUpload={uploadImageAtLocation}
          onClose={() => setShowUploadPanel(false)}
          uploading={uploading} uploadProgress={uploadProgress} error={uploadError}
        />
      )}

      {/* Image viewer */}
      {viewingImages && (
        <ImageViewer images={viewingImages} onClose={() => setViewingImages(null)} />
      )}
    </div>
  );
}
