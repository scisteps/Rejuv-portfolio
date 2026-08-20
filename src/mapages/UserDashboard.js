// src/pages/UserDashboard.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Marker, Overlay, Polyline, useMap } from 'googlemaps-react-primitives';
import MapWrapper from '../components/map/MapWrapper';
import MapPanController from '../components/map/MapPanController';
import RecenterButton from '../components/map/RecenterButton';
import LocationImageMarker from '../components/map/LocationImageMarker';
import ImageLightbox from '../components/map/ImageLightbox';
import { usePathTracking } from '../hooks/usePathTracking';
import { useUserLocation } from '../hooks/useUserLocation';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/geoData';
import CategoryFilter from '../components/user/CategoryFilter';
import LocationDetails from '../components/user/LocationDetails';
import PathTracker from '../components/user/PathTracker';
import LocationForm from '../components/user/LocationForm';
import ImageUploadModal from '../components/user/ImageUploadModal';
import AuthPopup from '../components/Auth/AuthPopup';
import { auth } from '../Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getCategories, getLocations, deleteLocation } from '../services/Firestoreservice';
import './UserDashboard.css';

const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };
const DEFAULT_ZOOM = 16;

// ─── User Location Marker ──────────────────────────────────────────────
function UserLocationMarker({ position, isUsingFallback, onClick }) {
  const map = useMap();
  if (!map) return null;

  const color = isUsingFallback ? '#FF9800' : '#4285F4';

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
        anchor: new window.google.maps.Point(0, 0),
      }}
      label={{ text: '📍', fontSize: '18px', fontWeight: 'bold' }}
      title="You are here — tap to add details"
    />
  );
}

// ─── Category Location Marker ──────────────────────────────────────────
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
        anchor: new window.google.maps.Point(0, 0),
      }}
      label={{
        text: CATEGORY_ICONS[location.category] || '📍',
        fontSize: '12px',
        fontWeight: 'bold',
      }}
    />
  );
}

// ─── User Pan Listener ────────────────────────────────────────────────
function UserPanListener({ onUserPan }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('dragstart', onUserPan);
    return () => listener.remove();
  }, [map, onUserPan]);

  return null;
}

// ─── Main Dashboard ────────────────────────────────────────────────────
export default function UserDashboard() {
  // ── Map state ──
  const [initialCenter] = useState(DEFAULT_CENTER);
  const [initialZoom] = useState(DEFAULT_ZOOM);
  const currentZoomRef = useRef(DEFAULT_ZOOM);
  const [isCenteredOnUser, setIsCenteredOnUser] = useState(false);

  // ── Fly-to target for MapPanController ──
  const [flyTarget, setFlyTarget] = useState(null);
  const flyTo = useCallback((lat, lng, zoom) => {
    setFlyTarget({ lat, lng, zoom, requestId: Date.now() });
  }, []);

  // ── UI state ──
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [actionLocation, setActionLocation] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // ── Hooks ──
  const {
    userLocation,
    loading: locationLoading,
    error: locationError,
    isUsingFallback,
    accuracy,
    getUserLocation,
    refreshGPS,
    getAccuracyStatus,
  } = useUserLocation();

  const {
    roads = [],
    paths = [],
    pathStats = null,
    startTracking,
    stopTracking,
    clearPath,
  } = usePathTracking();

  const isTracking = paths.length > 0;

  // ── Data loading ──
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [locationsData, categoriesData] = await Promise.all([
        getLocations(),
        getCategories(),
      ]);
      setLocations(locationsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth state ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // ── Initial location fly-to ──
  useEffect(() => {
    if (mapReady) {
      getUserLocation().then((position) => {
        if (position) {
          flyTo(position.lat, position.lng, 17);
          setIsCenteredOnUser(true);
        }
      });
    }
  }, [mapReady, getUserLocation, flyTo]);

  // ── Handlers ──
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFindAccurateGPS = async () => {
    setIsRefreshing(true);
    setGpsStatus('searching');

    try {
      const position = await refreshGPS();

      if (position?.accuracy) {
        if (position.accuracy < 50) {
          setGpsStatus('found');
          flyTo(position.lat, position.lng, 18);
          setIsCenteredOnUser(true);
        } else if (position.accuracy < 200) {
          setGpsStatus('found');
          flyTo(position.lat, position.lng, 17);
          setIsCenteredOnUser(true);
        } else {
          setGpsStatus('failed');
        }
      } else {
        setGpsStatus('failed');
      }

      setTimeout(() => setGpsStatus('idle'), 3000);
    } catch (error) {
      console.error('GPS Error:', error);
      setGpsStatus('failed');
      setTimeout(() => setGpsStatus('idle'), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRecenter = async () => {
    setIsRefreshing(true);
    try {
      const position = userLocation || (await getUserLocation());
      if (position) {
        flyTo(position.lat, position.lng, Math.max(currentZoomRef.current, 17));
        setIsCenteredOnUser(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenLocationForm = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (userLocation) {
      setActionLocation({ lat: userLocation.lat, lng: userLocation.lng });
      setShowLocationForm(true);
    } else {
      getUserLocation().then((position) => {
        if (position) {
          setActionLocation({ lat: position.lat, lng: position.lng });
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
    loadData();
  };

  const handleToggleCategory = (categoryId) => {
    setSelectedCategories((previous) =>
      previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId]
    );
  };

  const filteredLocations =
    selectedCategories.length === 0
      ? locations || []
      : (locations || []).filter((location) =>
          selectedCategories.includes(location.category)
        );

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await deleteLocation(locationId);
      loadData();
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location');
    }
  };

  const accuracyStatus = getAccuracyStatus
    ? getAccuracyStatus(accuracy)
    : { label: 'Unknown', color: '#999', icon: '📍' };

  // ── Loading screen ──
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading map data...</p>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="user-dashboard">
      {/* ─── Header ─── */}
      <header className="user-header">
        <h1>📍 Geo WAY</h1>

        <div className="user-controls">
          {user ? (
            <>
              <span className="user-email">
                {user.email || user.phoneNumber}
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => setShowAuth(true)}>
                Login
              </button>
              <button className="btn-signup" onClick={() => setShowAuth(true)}>
                Sign Up
              </button>
            </>
          )}

          <button
            className={`btn-gps ${gpsStatus === 'searching' ? 'searching' : ''}`}
            onClick={handleFindAccurateGPS}
            disabled={isRefreshing || gpsStatus === 'searching'}
          >
            {gpsStatus === 'searching'
              ? 'Finding GPS...'
              : gpsStatus === 'found'
              ? '✅ GPS Found!'
              : gpsStatus === 'failed'
              ? '⚠️ Try Again'
              : '📡 Find GPS'}
          </button>

          <button
            className="btn-track"
            onClick={() => setShowTracker(!showTracker)}
          >
            {showTracker ? '📊 Hide' : '📊 Track'}
          </button>
        </div>
      </header>

      {/* ─── Location Status Banner ─── */}
      {locationError && (
        <div className="location-banner error">
          ⚠️ {locationError}
          <button onClick={handleRecenter}>Retry</button>
        </div>
      )}

      {!locationError && userLocation && (
        <div
          className={`location-banner ${
            isUsingFallback ? 'warning' : 'success'
          }`}
        >
          <span
            className="status-dot"
            style={{
              background: isUsingFallback ? '#ff9800' : accuracyStatus.color,
            }}
          />

          {isUsingFallback
            ? `📍 Approximate location — ${accuracyStatus.label}`
            : `✅ GPS Active · ${accuracyStatus.label}`}

          <span className="accuracy-badge">
            {accuracyStatus.icon} ±{Math.round(accuracy || 0)}m
          </span>

          <button
            className="btn-gps-small"
            onClick={handleFindAccurateGPS}
            disabled={isRefreshing}
          >
            {isRefreshing ? '⏳' : '📡 Improve'}
          </button>
        </div>
      )}

      {locationLoading && !userLocation && (
        <div className="location-banner info">
          <span className="loading-dot"></span>
          Finding your location...
        </div>
      )}

      {gpsStatus === 'searching' && (
        <div className="gps-searching-banner">
          <span className="gps-pulse-dot"></span>
          Searching for accurate GPS signal...
          <span className="gps-tip">💡 Go outside for better signal</span>
        </div>
      )}

      {/* ─── Main Layout ─── */}
      <div className="user-layout">
        {/* ─── Sidebar ─── */}
        <aside className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            categories={categories}
          />

          {user && (
            <div className="user-stats">
              <h4>My Stats</h4>
              <p>
                📍 Locations:{' '}
                {(locations || []).filter(
                  (location) => location.createdBy === user.uid
                ).length}
              </p>
              <p>📸 My Images: 0</p>
            </div>
          )}
        </aside>

        {/* ─── Map Container ─── */}
        <div className="map-container">
          <MapWrapper
            center={initialCenter}
            zoom={initialZoom}
            onClick={() => {}}
            onBoundsChanged={() => {}}
            onZoomChanged={(zoom) => {
              currentZoomRef.current = zoom;
            }}
            onMapReady={() => setMapReady(true)}
          >
            {/* ─── Pan Controller ─── */}
            <MapPanController target={flyTarget} />

            {/* ─── User Pan Listener ─── */}
            <UserPanListener onUserPan={() => setIsCenteredOnUser(false)} />

            {/* ─── Roads ─── */}
            {roads?.length > 0 &&
              roads.map((road) => (
                <Polyline
                  key={road.id}
                  path={road.coordinates}
                  strokeColor={road.color}
                  strokeWeight={3}
                  strokeOpacity={0.6}
                />
              ))}

            {/* ─── Paths ─── */}
            {paths?.length > 1 && (
              <Polyline
                path={paths}
                strokeColor="#4285F4"
                strokeWeight={4}
                strokeOpacity={0.85}
              />
            )}

            {/* ─── Location Markers ─── */}
            {filteredLocations.map((location) => (
              <React.Fragment key={location.id}>
                <LocationMarker
                  location={location}
                  onClick={() => setSelectedLocation(location)}
                />
                <LocationImageMarker
                  location={location}
                  onClick={() => setSelectedLocation(location)}
                  onZoom={(image, title) =>
                    setLightboxImage({ image, title })
                  }
                />
              </React.Fragment>
            ))}

            {/* ─── User Location Marker ─── */}
            {userLocation && (
              <UserLocationMarker
                position={{
                  lat: userLocation.lat,
                  lng: userLocation.lng,
                }}
                isUsingFallback={isUsingFallback}
                onClick={handleOpenLocationForm}
              />
            )}

            {/* ─── Selected Location Info Window ─── */}
            {selectedLocation && (
              <Overlay
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
              >
                <div className="custom-info-window">
                  <button
                    className="info-close"
                    onClick={() => setSelectedLocation(null)}
                  >
                    ✕
                  </button>

                  <LocationDetails
                    location={selectedLocation}
                    onUpdate={loadData}
                  />

                  {user && selectedLocation.createdBy === user.uid && (
                    <div className="location-owner-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setActionLocation(selectedLocation);
                          setShowLocationForm(true);
                          setSelectedLocation(null);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteLocation(selectedLocation.id)
                        }
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </Overlay>
            )}
          </MapWrapper>

          {/* ─── Map Controls ─── */}
          <div className="map-controls">
            <RecenterButton
              onClick={handleRecenter}
              isLocating={isRefreshing || (locationLoading && !userLocation)}
              isActive={isCenteredOnUser}
            />

            <button
              className="floating-add-btn"
              onClick={handleOpenLocationForm}
              title="Add Location"
            >
              📍
            </button>

            <button
              className="floating-image-btn"
              onClick={() => {
                if (!user) {
                  setShowAuth(true);
                  return;
                }
                setShowImageUpload(true);
              }}
              title="Upload Images"
            >
              📸
            </button>
          </div>
        </div>

        {/* ─── Tracker Panel ─── */}
        {showTracker && (
          <div className="tracker-panel">
            <PathTracker
              isTracking={isTracking}
              path={paths || []}
              pathStats={pathStats}
              onStartTracking={startTracking}
              onStopTracking={stopTracking}
              onClearPath={clearPath}
            />
          </div>
        )}
      </div>

      {/* ─── Modals ─── */}
      {showLocationForm && actionLocation && (
        <LocationForm
          lat={actionLocation.lat}
          lng={actionLocation.lng}
          location={actionLocation.id ? actionLocation : null}
          onClose={() => {
            setShowLocationForm(false);
            setActionLocation(null);
          }}
          onSuccess={handleLocationSuccess}
        />
      )}

      {showImageUpload && (
        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          userId={user?.uid}
          onUploadComplete={() => {
            loadData();
          }}
        />
      )}

      <AuthPopup
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          loadData();
        }}
      />

      <ImageLightbox
        image={lightboxImage?.image}
        title={lightboxImage?.title}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}