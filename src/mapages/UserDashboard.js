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
import ImageUploadPanel from '../components/user/ImageUploadPanel';
import ImageViewer from '../components/user/ImageViewer';
import LocationForm from '../components/user/LocationForm';
import './UserDashboard.css';

// ── Constants ────────────────────────────────────────────────────────────────
const MAKERERE_CENTER = { lat: 0.3476, lng: 32.5825 };
const MAKERERE_BOUNDS = {
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
  const [mapCenter, setMapCenter] = useState(MAKERERE_CENTER);
  const [mapZoom, setMapZoom] = useState(16);
  const [followUser, setFollowUser] = useState(true);

  // UI states
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [viewingImages, setViewingImages] = useState(null);
  
  // Location form states
  const [showActionModal, setShowActionModal] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [actionLocation, setActionLocation] = useState(null);
  const [actionMode, setActionMode] = useState(null);

  // Custom hooks
  const {
    userLocation, loading: locationLoading, error: locationError,
    isUsingFallback, accuracy, getUserLocation, startWatching, stopWatching,
  } = useUserLocation();

  const { locations, roads, paths, selectedCategories, toggleCategory, getFilteredLocations } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();
  const { locationImages, uploading, uploadProgress, error: uploadError, userId, uploadImageAtLocation } = useLocationImages();

  // ── Get location immediately on mount ─────────────────────────────────────
  useEffect(() => {
    getUserLocation().then((pos) => {
      if (pos && followUser) {
        setMapCenter({ lat: pos.lat, lng: pos.lng });
        setMapZoom(18);
      }
    });
    startWatching();
    return () => stopWatching();
  }, []);

  // Pan map to follow user
  useEffect(() => {
    if (userLocation && followUser) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation, followUser]);

  // Stop following when user manually pans
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

  // ── Location action handlers ──────────────────────────────────────────────
  const handleUserLocationClick = () => {
    if (!userLocation) {
      alert('Getting your location... Please wait a moment.');
      return;
    }
    setActionLocation({ lat: userLocation.lat, lng: userLocation.lng });
    setShowActionModal(true);
  };

  const handleAddInfo = () => {
    setShowActionModal(false);
    setActionMode('info');
    setShowLocationForm(true);
  };

  const handleAddImage = () => {
    setShowActionModal(false);
    setActionMode('image');
    setShowImageUpload(true);
  };

  const handleAddBoth = () => {
    setShowActionModal(false);
    setActionMode('both');
    setShowLocationForm(true);
  };

  const handleLocationSuccess = async (newLocation) => {
    setShowLocationForm(false);
    console.log('Location added:', newLocation);
    
    if (actionMode === 'both') {
      setActionMode('image');
      setShowImageUpload(true);
    } else {
      setActionMode(null);
      setActionLocation(null);
      alert('✅ Location added successfully!');
    }
  };

  const handleImageUploadSuccess = () => {
    setShowImageUpload(false);
    setActionMode(null);
    setActionLocation(null);
    alert('✅ Image uploaded successfully!');
  };

  // Group camera pins by location
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
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="user-header">
        <h1>📍 Geo WAY</h1>
        <div className="user-controls">
          <button className="btn-location" onClick={handleCenterOnUser} disabled={locationLoading}>
            {locationLoading ? '⏳ Locating...' : '📍 My Location'}
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

        {/* Map */}
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

              {/* ── USER LOCATION PIN (using standard Marker) ── */}
              {userLocation && (
                <Marker
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  zIndex={1000}
                  onClick={handleUserLocationClick}
                  icon={{
                    path: 'M 0,-24 C -10,-24 -14,-10 -8,-2 L 0,12 L 8,-2 C 14,-10 10,-24 0,-24 Z',
                    fillColor: isUsingFallback ? '#FF9800' : '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2.5,
                    strokeColor: '#FFFFFF',
                    scale: 1.2,
                    anchor: { x: 0, y: 0 }
                  }}
                  label={{
                    text: '📍',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    className: 'user-location-label'
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

          {/* Re-center button */}
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

      {/* ── ACTION MODAL ── */}
      {showActionModal && actionLocation && (
        <div className="location-action-overlay" onClick={() => setShowActionModal(false)}>
          <div className="location-action-modal" onClick={(e) => e.stopPropagation()}>
            <button className="action-close-btn" onClick={() => setShowActionModal(false)}>✕</button>
            
            <div className="action-header">
              <div className="action-location-pin">📍</div>
              <h3>Add Location Details</h3>
              <p className="action-coords">
                {actionLocation.lat.toFixed(6)}, {actionLocation.lng.toFixed(6)}
              </p>
            </div>

            <div className="action-options">
              <div className="action-option" onClick={handleAddInfo}>
                <div className="option-icon">📝</div>
                <div className="option-content">
                  <h4>Add Info Only</h4>
                  <p>Name, category, description & details</p>
                </div>
                <div className="option-arrow">→</div>
              </div>

              <div className="action-option" onClick={handleAddImage}>
                <div className="option-icon">📸</div>
                <div className="option-content">
                  <h4>Add Image Only</h4>
                  <p>Upload photos without additional info</p>
                </div>
                <div className="option-arrow">→</div>
              </div>

              <div className="action-option" onClick={handleAddBoth}>
                <div className="option-icon">✨</div>
                <div className="option-content">
                  <h4>Add Both</h4>
                  <p>Complete location info with images</p>
                </div>
                <div className="option-arrow">→</div>
              </div>
            </div>

            <div className="action-footer">
              <button className="action-cancel" onClick={() => setShowActionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOCATION FORM ── */}
      {showLocationForm && actionLocation && (
        <LocationForm
          lat={actionLocation.lat}
          lng={actionLocation.lng}
          mode={actionMode}
          onClose={() => {
            setShowLocationForm(false);
            setActionLocation(null);
            setActionMode(null);
          }}
          onSuccess={handleLocationSuccess}
        />
      )}

      {/* ── IMAGE UPLOAD ── */}
      {showImageUpload && actionLocation && (
        <ImageUploadPanel
          lat={actionLocation.lat}
          lng={actionLocation.lng}
          onUpload={uploadImageAtLocation}
          onClose={() => {
            setShowImageUpload(false);
            setActionLocation(null);
            setActionMode(null);
          }}
          uploading={uploading}
          uploadProgress={uploadProgress}
          error={uploadError}
          onSuccess={handleImageUploadSuccess}
        />
      )}

      {/* ── IMAGE VIEWER ── */}
      {viewingImages && (
        <ImageViewer images={viewingImages} onClose={() => setViewingImages(null)} />
      )}
    </div>
  );
}