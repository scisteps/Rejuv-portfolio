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
import ImageUploadModal from '../components/user/ImageUploadModal';
import AuthPopup from '../components/Auth/AuthPopup';
import LottieOverlay from '../components/map/LottieOverlay';
import { auth } from '../Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getCategories, getLocations, deleteLocation } from '../services/Firestoreservice';
import './UserDashboard.css';

// ── IMPORT LOTTIE ANIMATION ──
import skateAnimation from '../jsons/skate.json'; // ← CHANGE THIS TO skate.json

const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };
const DEFAULT_ZOOM = 16;

// ── Custom Components ──
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

  const { 
    userLocation, 
    loading: locationLoading, 
    error: locationError,
    isUsingFallback, 
    accuracy, 
    getUserLocation,
    refreshGPS,
    getAccuracyStatus
  } = useUserLocation();

  // ── Fix: Provide default values for roads and paths ──
  const { 
    roads = [],  // Default to empty array
    paths = [],  // Default to empty array
    pathStats = null,
    startTracking, 
    stopTracking, 
    clearPath 
  } = usePathTracking();

  const isTracking = paths.length > 0;

  // ── Load Data ──
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [locationsData, categoriesData] = await Promise.all([
        getLocations(),
        getCategories()
      ]);
      setLocations(locationsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth Listener ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // ── Get location on mount ──
  useEffect(() => {
    getUserLocation().then((pos) => {
      if (pos) {
        setMapCenter({ lat: pos.lat, lng: pos.lng });
        setMapZoom(17);
      }
    });
  }, [getUserLocation]);

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
      
      if (position && position.accuracy) {
        console.log('📍 GPS Accuracy:', position.accuracy + 'm');
        
        if (position.accuracy < 50) {
          setGpsStatus('found');
          setMapCenter({ lat: position.lat, lng: position.lng });
          setMapZoom(18);
          setTimeout(() => setGpsStatus('idle'), 3000);
        } else if (position.accuracy < 200) {
          setGpsStatus('found');
          setMapCenter({ lat: position.lat, lng: position.lng });
          setMapZoom(17);
          setTimeout(() => setGpsStatus('idle'), 3000);
        } else {
          setGpsStatus('failed');
          setTimeout(() => setGpsStatus('idle'), 3000);
        }
      } else {
        setGpsStatus('failed');
        setTimeout(() => setGpsStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('GPS Error:', error);
      setGpsStatus('failed');
      setTimeout(() => setGpsStatus('idle'), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

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
    if (!user) {
      setShowAuth(true);
      return;
    }
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
    loadData(); // Refresh locations
  };

  const handleToggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const getFilteredLocations = () => {
    if (selectedCategories.length === 0) return locations || [];
    return (locations || []).filter(loc => selectedCategories.includes(loc.category));
  };

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await deleteLocation(locationId);
      loadData();
      setSelectedLocation(null);
    } catch (err) {
      console.error('Error deleting location:', err);
      alert('Failed to delete location');
    }
  };

  const filteredLocations = getFilteredLocations();
  const accuracyStatus = getAccuracyStatus ? getAccuracyStatus(accuracy) : { label: 'Unknown', color: '#999', icon: '📍' };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* ── INLINE STYLES ── */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gpsPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lottie-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f7fafc;
        }
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        .loading-screen p {
          color: #4a5568;
          font-size: 16px;
        }
      `}</style>

      {/* Header */}
      <header className="user-header">
        <h1>📍 Geo WAY</h1>
        <div className="user-controls">
          {user ? (
            <>
              <span className="user-email">{user.email || user.phoneNumber}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => setShowAuth(true)}>Login</button>
              <button className="btn-signup" onClick={() => setShowAuth(true)}>Sign Up</button>
            </>
          )}

          <button
            className={`btn-gps ${gpsStatus === 'searching' ? 'searching' : ''}`}
            onClick={handleFindAccurateGPS}
            disabled={isRefreshing || gpsStatus === 'searching'}
          >
            {gpsStatus === 'searching' ? (
              <>
                <span className="gps-spinner"></span>
                Finding GPS...
              </>
            ) : gpsStatus === 'found' ? (
              '✅ GPS Found!'
            ) : gpsStatus === 'failed' ? (
              '⚠️ Try Again'
            ) : (
              '📡 Find GPS'
            )}
          </button>

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

      {/* ── GPS STATUS BANNER ── */}
      {locationError && (
        <div className="location-banner error">
          ⚠️ {locationError}
          <button onClick={handleMoveToLocation}>Retry</button>
        </div>
      )}
      
      {!locationError && userLocation && (
        <div className={`location-banner ${isUsingFallback ? 'warning' : 'success'}`}>
          {isUsingFallback ? (
            <>
              <span className="status-dot" style={{ background: '#ff9800' }}></span>
              📍 Approximate location — {accuracyStatus.label}
              <span className="accuracy-badge">±{Math.round(accuracy || 0)}m</span>
              <button
                className="btn-gps-small"
                onClick={handleFindAccurateGPS}
                disabled={isRefreshing}
              >
                {isRefreshing ? '⏳' : '📡 Get GPS'}
              </button>
            </>
          ) : (
            <>
              <span className="status-dot" style={{ background: accuracyStatus.color }}></span>
              ✅ GPS Active · {accuracyStatus.label}
              <span className="accuracy-badge">
                {accuracyStatus.icon} ±{Math.round(accuracy || 0)}m
              </span>
              {accuracy > 100 && (
                <button
                  className="btn-gps-small"
                  onClick={handleFindAccurateGPS}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? '⏳' : '🔄 Improve'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {locationLoading && !userLocation && (
        <div className="location-banner info">
          <span className="loading-dot"></span>
          Finding your location...
        </div>
      )}

      {/* GPS Searching Indicator */}
      {gpsStatus === 'searching' && (
        <div className="gps-searching-banner">
          <span className="gps-pulse-dot"></span>
          Searching for accurate GPS signal...
          <span className="gps-tip">💡 Go outside for better signal</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="user-layout">
        <aside className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            categories={categories}
          />
          
          {user && (
            <div className="user-stats">
              <h4>My Stats</h4>
              <p>📍 Locations: {(locations || []).filter(l => l.createdBy === user.uid).length}</p>
              <p>📸 My Images: 0</p>
            </div>
          )}
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
            {/* Roads - with safety check */}
            {roads && roads.length > 0 && roads.map(road => (
              <Polyline
                key={road.id}
                path={road.coordinates}
                strokeColor={road.color}
                strokeWeight={3}
                strokeOpacity={0.6}
              />
            ))}

            {/* Paths - with safety check */}
            {paths && paths.length > 1 && (
              <Polyline
                path={paths}
                strokeColor="#4285F4"
                strokeWeight={4}
                strokeOpacity={0.85}
              />
            )}

            {/* ── LOCATION MARKERS WITH LOTTIE ── */}
            {filteredLocations.map(location => (
              <React.Fragment key={location.id}>
                <LocationMarker 
                  location={location}
                  onClick={() => setSelectedLocation(location)}
                />
                {/* Lottie Animation on top of each location marker */}
                <LottieOverlay
                  position={{ lat: location.lat, lng: location.lng }}
                  animationData={skateAnimation}  // ← USING skate.json
                  onClick={() => setSelectedLocation(location)}
                  size={60}  // You can adjust this size
                  title={location.name}
                  offsetY={-30}  // Offset above the marker
                  loop={true}
                  autoplay={true}
                />
              </React.Fragment>
            ))}

            {/* ── USER LOCATION WITH LOTTIE ── */}
            {userLocation && (
              <React.Fragment>
                <UserLocationMarker 
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  isUsingFallback={isUsingFallback}
                  onClick={handleOpenLocationForm}
                />
                {/* Lottie Animation on top of user pin */}
                <LottieOverlay
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  animationData={skateAnimation}  // ← USING skate.json
                  onClick={handleOpenLocationForm}
                  size={70}  // Slightly larger for user location
                  title="You are here — tap to add details"
                  className="user-location-marker"
                  offsetY={-35}
                  loop={true}
                  autoplay={true}
                />
              </React.Fragment>
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
                        onClick={() => handleDeleteLocation(selectedLocation.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </Overlay>
            )}
          </MapWrapper>

          {/* Floating Buttons */}
          <button 
            className="floating-add-btn"
            onClick={handleOpenLocationForm}
            style={{
              position: 'fixed',
              bottom: '160px',
              right: '20px',
              zIndex: 1000,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
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
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              zIndex: 1000,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 25px rgba(245, 87, 108, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.4)';
            }}
            title="Upload Images"
          >
            📸
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
              path={paths || []}
              pathStats={pathStats}
              onStartTracking={startTracking}
              onStopTracking={stopTracking}
              onClearPath={clearPath}
            />
          </div>
        )}
      </div>

      {/* ── LOCATION FORM ── */}
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

      {/* ── IMAGE UPLOAD MODAL ── */}
      {showImageUpload && (
        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          userId={user?.uid}
          onUploadComplete={() => {
            console.log('Images uploaded successfully');
            loadData();
          }}
        />
      )}

      {/* ── AUTH POPUP ── */}
      <AuthPopup
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          console.log('✅ Auth successful!');
          loadData();
        }}
      />
    </div>
  );
}