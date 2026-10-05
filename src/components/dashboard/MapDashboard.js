// src/components/dashboard/MapDashboard.jsx
//
// Shared implementation behind both /map (UserDashboard) and /admin
// (AdminDashboard). The two pages render the exact same map, filters,
// tracker, elevation info, and location navigator — the only thing
// that differs is whether location-management controls (add / edit /
// delete a pin) are shown, controlled by the `mode` prop.
//
//   <MapDashboard mode="user" />   -> view-only
//   <MapDashboard mode="admin" />  -> view + create/edit/delete

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Marker, Overlay, Polyline, useMap } from 'googlemaps-react-primitives';
import MapWrapper from '../map/MapWrapper';
import MapPanController from '../map/MapPanController';
import RecenterButton from '../map/RecenterButton';
import LocationNavigator from '../map/LocationNavigator';
import LocationImageMarker from '../map/LocationImageMarker';
import ImageLightbox from '../map/ImageLightbox';
import { usePathTracking } from '../../hooks/usePathTracking';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useElevation } from '../../hooks/useElevation';
import { useDirections } from '../../hooks/useDirections';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/geoData';
import CategoryFilter from '../user/CategoryFilter';
import LocationDetails from '../user/LocationDetails';
import PathTracker from '../user/PathTracker';
import LocationForm from '../user/LocationForm';
import ImageUploadModal from '../user/ImageUploadModal';
import AuthPopup from '../Auth/AuthPopup';
import { auth } from '../../Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getCategories, getLocations, deleteLocation } from '../../services/Firestoreservice';
// MapDashboard.css is additive on top of the layout rules that live in
// mapages/UserDashboard.css (.user-dashboard, .location-banner,
// .map-container, .map-controls, .custom-info-window, ...). Without this
// import the map container had no height and every banner/control was
// unstyled.
import '../../mapages/UserDashboard.css';
import './MapDashboard.css';

const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };
const DEFAULT_ZOOM = 16;

function formatElevationDiff(diffMeters) {
  if (diffMeters == null) return null;
  const rounded = Math.round(Math.abs(diffMeters));
  if (rounded === 0) return 'same elevation as you';
  return diffMeters > 0 ? `+${rounded}m above you` : `-${rounded}m below you`;
}

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
      title="You are here"
    />
  );
}
// Rejects if `promise` takes longer than `ms`. The timer is always cleared,
// otherwise a resolved request left a pending timer behind on every load.
function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}
// ─── Category Location Marker ──────────────────────────────────────────
function LocationMarker({ location, elevationDiff, onClick }) {
  const map = useMap();
  if (!map) return null;

  const diffLabel = formatElevationDiff(elevationDiff);

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
      title={diffLabel ? `${location.name} — ${diffLabel}` : location.name}
    />
  );
}

// ─── User Pan Listener ────────────────────────────────────────────────
function UserPanListener({ onUserPan }) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof map.addListener !== 'function') return undefined;

    const listener = map.addListener('dragstart', onUserPan);

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, [map, onUserPan]);

  return null;
}

// ─── Main Dashboard ────────────────────────────────────────────────────
export default function MapDashboard({ mode = 'user' }) {
  const canManageLocations = mode === 'admin';

  // ── Map state ──
  const [initialCenter] = useState(DEFAULT_CENTER);
  const [initialZoom] = useState(DEFAULT_ZOOM);
  const currentZoomRef = useRef(DEFAULT_ZOOM);
  const [isCenteredOnUser, setIsCenteredOnUser] = useState(false);

  // ── Fly-to target for MapPanController ──
  // A monotonic counter, not Date.now(): two flights within the same
  // millisecond produced identical requestIds and MapPanController (which
  // de-dupes on requestId) silently dropped the second one.
  const [flyTarget, setFlyTarget] = useState(null);
  const flyRequestIdRef = useRef(0);
  const flyTo = useCallback((lat, lng, zoom) => {
    flyRequestIdRef.current += 1;
    setFlyTarget({
      lat,
      lng,
      zoom,
      requestId: flyRequestIdRef.current,
    });
  }, []);

  // ── UI state ──
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(-1);
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
    path: trackedPath = [],
    pathStats = null,
    currentPoint: trackingPoint = null,
    error: trackingError = null,
    isTracking,
    startTracking,
    stopTracking,
    clearPath,
  } = usePathTracking();

  // While the path tracker is recording, the dot on the map should follow the
  // live fix. Directions/elevation deliberately keep using `userLocation` so
  // a new fix every second can't re-trigger those APIs.
  const markerLocation = trackingPoint || userLocation;

 const loadData = useCallback(async () => {
  try {
    setLoading(true);
    const [locationsData, categoriesData] = await withTimeout(
      Promise.all([getLocations(), getCategories()]),
      8000,
      'Loading locations/categories'
    );
    setLocations(locationsData || []);
    setCategories(categoriesData || []);
  } catch (error) {
    console.error('Error loading data:', error);
    // Don't leave the app stuck with nothing — show the map with
    // no pins rather than no map at all.
    setLocations([]);
    setCategories([]);
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
  // Fires exactly once, when the map becomes ready. This used to depend on
  // `getUserLocation`, which was re-created on every render — so every state
  // update kicked off another GPS request, producing an endless request loop
  // (permission churn, battery drain, constant re-renders).
  const didInitialFlyRef = useRef(false);
  useEffect(() => {
    if (!mapReady || didInitialFlyRef.current) return undefined;
    didInitialFlyRef.current = true;

    let cancelled = false;

    // The hook already asks for a fix on mount; getUserLocation de-duplicates,
    // so this reuses that request instead of firing a second one.
    getUserLocation()
      .then((position) => {
        if (cancelled) return;
        // null means "no fix" (denied / unsupported / timed out). The banner
        // explains why — never fly the map to a guessed coordinate.
        if (!position) return;
        flyTo(position.lat, position.lng, 17);
        setIsCenteredOnUser(true);
      })
      .catch(() => {
        /* surfaced through the hook's error state */
      });

    return () => {
      cancelled = true;
    };
  }, [mapReady, getUserLocation, flyTo]);

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

  // ── Elevation relative to the user, for every visible location ──
  const { userElevation, elevationById } = useElevation(
    userLocation,
    filteredLocations
  );

  // ── Walking route from the user to whichever location is selected ──
  const { route: navigationRoute, loading: routeLoading } = useDirections(
    userLocation,
    selectedLocation,
    'WALKING'
  );

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
      // precise: true skips the fast pass and ignores any cached fix.
      const position = await refreshGPS();

      if (!position) {
        setGpsStatus('failed');
      } else {
        setGpsStatus('found');
        // Zoom in further the tighter the fix is.
        const zoom =
          position.accuracy != null && position.accuracy < 50 ? 18 : 17;
        flyTo(position.lat, position.lng, zoom);
        setIsCenteredOnUser(true);
      }
    } catch (error) {
      console.error('GPS Error:', error);
      setGpsStatus('failed');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setGpsStatus('idle'), 3000);
    }
  };

  const handleRecenter = async () => {
    setIsRefreshing(true);
    try {
      // Prefer what we already have; only ask the browser if we have nothing.
      const position = markerLocation || (await getUserLocation());

      if (position) {
        flyTo(
          position.lat,
          position.lng,
          Math.max(currentZoomRef.current, 17)
        );
        setIsCenteredOnUser(true);
        setCurrentLocationIndex(-1);
        setSelectedLocation(null);
      }
      // With no fix available the error banner already explains why — don't
      // jump the map to a default coordinate and pretend that's the user.
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Left/middle/right navigator: middle re-uses the same "center on
  // me" behavior as the floating recenter control.
  const handleCenterOnUser = handleRecenter;

  const handleSelectLocationIndex = (index) => {
    const location = filteredLocations[index];
    if (!location) return;
    setCurrentLocationIndex(index);
    setSelectedLocation(location);
    setIsCenteredOnUser(false);
    flyTo(location.lat, location.lng, Math.max(currentZoomRef.current, 17));
  };

  const openLocationFormAt = (position) => {
    if (!position) return;
    setActionLocation({ lat: position.lat, lng: position.lng });
    setShowLocationForm(true);
  };

  const handleOpenLocationForm = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (markerLocation) {
      openLocationFormAt(markerLocation);
      return;
    }

    // No position yet: ask for one. On failure the location banner explains
    // why — no more blocking alert() dialog.
    getUserLocation()
      .then(openLocationFormAt)
      .catch(() => {});
  };

  // Admin only: click anywhere on the map to drop a pin there, same
  // as the old AdminDashboard's click-to-add flow.
  const handleMapClick = (e) => {
    if (!canManageLocations) return;
    if (!e?.latLng) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    setActionLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setShowLocationForm(true);
  };

  const handleLocationSuccess = () => {
    setShowLocationForm(false);
    setActionLocation(null);
    loadData();
  };

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


 

  // ── Render ──
  return (
    <div className="user-dashboard">
      {/* ─── Header ─── */}
      <header className="user-header">
        <h1>📍 Geo WAY{canManageLocations ? ' · Admin' : ''}</h1>

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
          <span>⚠️ {locationError}</span>
          <button
            onClick={() => {
              handleRecenter();
            }}
            disabled={locationLoading}
          >
            {locationLoading ? 'Locating…' : 'Retry'}
          </button>
        </div>
      )}

      {!locationError && markerLocation && (
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

          {isTracking
            ? `🎥 Recording path · ${accuracyStatus.label}`
            : isUsingFallback
            ? `📍 Approximate location — ${accuracyStatus.label}`
            : `✅ GPS Active · ${accuracyStatus.label}`}

          {/* Don't render "±0m" while the accuracy is still unknown. */}
          <span className="accuracy-badge">
            {accuracyStatus.icon}{' '}
            {accuracy != null ? `±${Math.round(accuracy)}m` : 'accuracy pending'}
          </span>

          {userElevation != null && (
            <span className="accuracy-badge elevation-badge">
              ⛰️ {Math.round(userElevation)}m elev.
            </span>
          )}

          <button
            className="btn-gps-small"
            onClick={handleFindAccurateGPS}
            disabled={isRefreshing}
          >
            {isRefreshing ? '⏳' : '📡 Improve'}
          </button>
        </div>
      )}

      {locationLoading && !markerLocation && (
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

          {/* Pin data is fetched separately from GPS — tell the user which
              one they're waiting on. */}
          {loading && locations.length === 0 && (
            <div className="sidebar-hint">
              <span className="loading-dot" /> Loading locations…
            </div>
          )}

          {!loading && locations.length === 0 && (
            <div className="sidebar-hint">No locations yet.</div>
          )}

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

        {/* ─── Map + Navigator ─── */}
        <div className="map-and-nav">
          <div className="map-container">
            <MapWrapper
              center={initialCenter}
              zoom={initialZoom}
              onClick={handleMapClick}
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

              {/* ─── Paths (recorded while tracking) ─── */}
              {trackedPath.length > 1 && (
                <Polyline
                  path={trackedPath}
                  strokeColor="#4285F4"
                  strokeWeight={4}
                  strokeOpacity={0.85}
                />
              )}

              {/* ─── Route to the selected location ─── */}
              {navigationRoute?.path?.length > 1 && (
                <Polyline
                  path={navigationRoute.path}
                  strokeColor="#0F9D58"
                  strokeWeight={4}
                  strokeOpacity={0.9}
                />
              )}

              {/* ─── Location Markers ─── */}
              {filteredLocations.map((location, index) => (
                <React.Fragment key={location.id}>
                  <LocationMarker
                    location={location}
                    elevationDiff={elevationById[location.id]?.diffFromUser}
                    onClick={() => handleSelectLocationIndex(index)}
                  />
                  <LocationImageMarker
                    location={location}
                    onClick={() => handleSelectLocationIndex(index)}
                    onZoom={(image, title) =>
                      setLightboxImage({ image, title })
                    }
                  />
                </React.Fragment>
              ))}

              {/* ─── Pending "new pin" preview (admin, while the form is open) ─── */}
              {canManageLocations && showLocationForm && actionLocation && (
                <Marker
                  position={{ lat: actionLocation.lat, lng: actionLocation.lng }}
                  icon={{
                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                    fillColor: '#FF5722',
                    fillOpacity: 0.7,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    scale: 1.4,
                    anchor: new window.google.maps.Point(0, 0),
                  }}
                  label={{ text: '➕', fontSize: '14px' }}
                />
              )}

              {/* ─── User Location Marker ─── */}
              {markerLocation && (
                <UserLocationMarker
                  position={{
                    lat: markerLocation.lat,
                    lng: markerLocation.lng,
                  }}
                  isUsingFallback={isUsingFallback}
                  onClick={
                    canManageLocations ? handleOpenLocationForm : undefined
                  }
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
                      elevationInfo={elevationById[selectedLocation.id]}
                      routeInfo={navigationRoute}
                    />

                    {canManageLocations &&
                      user &&
                      selectedLocation.createdBy === user.uid && (
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
                isLocating={isRefreshing || (locationLoading && !markerLocation)}
                isActive={isCenteredOnUser}
              />

              {canManageLocations && (
                <button
                  className="floating-add-btn"
                  onClick={handleOpenLocationForm}
                  title="Add Location"
                >
                  📍
                </button>
              )}

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

          {/* ─── Prev / Center-on-me / Next ─── */}
          <LocationNavigator
            locations={filteredLocations}
            currentIndex={currentLocationIndex}
            onSelectIndex={handleSelectLocationIndex}
            onCenterUser={handleCenterOnUser}
            isCenteringUser={isRefreshing}
            routeInfo={navigationRoute}
            routeLoading={routeLoading}
          />
        </div>

        {/* ─── Tracker Panel ─── */}
        {showTracker && (
          <div className="tracker-panel">
            <PathTracker
              isTracking={isTracking}
              path={trackedPath}
              pathStats={pathStats}
              error={trackingError}
              onStartTracking={startTracking}
              onStopTracking={stopTracking}
              onClearPath={clearPath}
            />
          </div>
        )}
      </div>

      {/* ─── Modals ─── */}
      {canManageLocations && showLocationForm && actionLocation && (
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