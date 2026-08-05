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
import AddImageModal from '../components/user/AddImageModal';
import './UserDashboard.css';

const UserDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 }); // Start with 0, will update
  const [mapZoom, setMapZoom] = useState(16);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { locations, paths, roads, selectedCategories, toggleCategory, getFilteredLocations, updateLocation } = useGeoData();
  const { isTracking, path, pathStats, startTracking, stopTracking, clearPath } = usePathTracking();
  const { 
    userLocation, 
    loading: locationLoading, 
    error: locationError, 
    isUsingFallback, 
    getUserLocation,
    startWatching,
    stopWatching
  } = useUserLocation();

  // Get user location on mount and center map
  useEffect(() => {
    const getLocation = async () => {
      const position = await getUserLocation();
      if (position && position.lat && position.lng) {
        setMapCenter({ lat: position.lat, lng: position.lng });
        setMapZoom(17);
      }
    };
    getLocation();

    // Start watching for location updates
    const watchId = startWatching((newLocation) => {
      // Optionally update map center when user moves
      // setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
    });

    return () => {
      stopWatching();
    };
  }, []);

  // Update map center when user location changes (but only if not tracking)
  useEffect(() => {
    if (!isTracking && userLocation && userLocation.lat && userLocation.lng) {
      // Only update if map hasn't been manually moved recently
      // You can add a flag here if needed
    }
  }, [userLocation, isTracking]);

  const handleCenterOnUser = async () => {
    const position = await getUserLocation();
    if (position && position.lat && position.lng) {
      setMapCenter({ lat: position.lat, lng: position.lng });
      setMapZoom(18);
    }
  };

  const handleAddImage = async (locationId, imageData) => {
    try {
      const location = locations.find(l => l.id === locationId);
      if (location) {
        const updatedImages = [...(location.images || []), imageData];
        await updateLocation(locationId, { images: updatedImages });
        setSelectedLocation(null);
        setShowImageModal(false);
        alert('✅ Image added successfully!');
      }
    } catch (error) {
      console.error('Failed to add image:', error);
      alert('❌ Failed to add image. Please try again.');
    }
  };

  const filteredLocations = getFilteredLocations();

  // Show loading state while getting location
  if (locationLoading && !userLocation) {
    return (
      <div className="user-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>📍 Getting your location...</p>
          <p className="loading-hint">Please allow location access when prompted</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="user-header">
        <h1>🌍 Community Map</h1>
        <div className="user-controls">
          <button
            className="btn-location"
            onClick={handleCenterOnUser}
            disabled={locationLoading}
          >
            {locationLoading ? '⏳ Getting...' : '📍 My Location'}
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
      {isUsingFallback && !locationError && userLocation && (
        <div className="location-banner warning">
          📍 Using approximate location — enable GPS for more accuracy
        </div>
      )}

      <div className="user-layout">
        <div className="filter-sidebar">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            categories={Object.values(CATEGORY_TYPES)}
          />
          <div className="map-legend">
            <h4>📍 Legend</h4>
            {Object.values(CATEGORY_TYPES).map(cat => (
              <div key={cat} className="legend-item">
                <span className="legend-dot" style={{ background: CATEGORY_COLORS[cat] }}></span>
                <span>{CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="map-container">
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              gestureHandling="greedy"
              onCenterChange={(center) => setMapCenter(center)}
              onZoomChange={(zoom) => setMapZoom(zoom)}
              onLoad={() => setMapLoaded(true)}
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

              {/* Saved paths from other users */}
              {paths.map((savedPath) => (
                <Polyline
                  key={savedPath.id}
                  path={savedPath.coordinates}
                  strokeColor="#34A853"
                  strokeWeight={3}
                  strokeOpacity={0.5}
                />
              ))}

              {/* Location markers */}
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
              {userLocation && userLocation.lat && userLocation.lng && (
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
                  title="You are here"
                  zIndex={1000}
                />
              )}

              {/* Info window for selected location with Add Image button */}
              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="location-info-window user-info-window">
                    <h3>{selectedLocation.name}</h3>
                    <div className="category-badge">
                      {CATEGORY_ICONS[selectedLocation.category]} {selectedLocation.category}
                    </div>
                    <p>{selectedLocation.description}</p>
                    {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                      <div className="tags">
                        {selectedLocation.tags.map((tag) => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    {/* Images section */}
                    {selectedLocation.images && selectedLocation.images.length > 0 && (
                      <div className="user-images">
                        <h4>📸 Images</h4>
                        <div className="image-grid">
                          {selectedLocation.images.map((img, idx) => (
                            <div key={idx} className="image-thumb">
                              <img src={img} alt={`${selectedLocation.name} ${idx + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button 
                      className="btn-add-image"
                      onClick={() => setShowImageModal(true)}
                    >
                      📸 Add Image
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Location status at bottom */}
          {userLocation && userLocation.lat && userLocation.lng && (
            <div className="location-status success">
              <span className="status-icon">📍</span>
              <span>Location active</span>
              {!isUsingFallback && (
                <span className="accuracy-badge">±{Math.round(userLocation.accuracy || 0)}m</span>
              )}
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

      {/* Add Image Modal */}
      {showImageModal && selectedLocation && (
        <AddImageModal
          location={selectedLocation}
          onClose={() => setShowImageModal(false)}
          onSave={(imageData) => handleAddImage(selectedLocation.id, imageData)}
        />
      )}
    </div>
  );
};

export default UserDashboard;