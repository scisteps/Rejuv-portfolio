// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow, Polyline } from '@vis.gl/react-google-maps';
import { useGeoData } from '../hooks/useGeoData';
import { useMapClick } from '../hooks/useMapClick';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/geoData';
import AddLocationModal from '../components/admin/AddLocationModal';
import './AdminDashboard.css';

// Makerere University — correct coordinates
const MAKERERE_CENTER = { lat: 0.3476, lng: 32.5825 };

const MAKERERE_BOUNDS = {
  north: 0.3515,
  south: 0.3440,
  east:  32.5880,
  west:  32.5780,
};

const AdminDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mapCenter, setMapCenter] = useState(MAKERERE_CENTER); // ← Makerere, not California
  const [mapZoom, setMapZoom] = useState(17);

  const { locations, roads, loading, addLocation, deleteLocation } = useGeoData();
  const { clickPosition, handleMapClick, clearClickPosition } = useMapClick();

  const handleAddLocation = async (locationData) => {
    try {
      await addLocation({
        ...locationData,
        lat: clickPosition.lat,
        lng: clickPosition.lng,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      });
      setShowAddModal(false);
      clearClickPosition();
    } catch (error) {
      console.error('Failed to add location:', error);
      alert('Failed to add location. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <span>⏳ Loading map data...</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏛️ Makerere Admin Dashboard</h1>
        <div className="admin-controls">
          <span className="click-hint">
            {clickPosition
              ? `📌 Click "Add Location" to save point at ${clickPosition.lat.toFixed(4)}, ${clickPosition.lng.toFixed(4)}`
              : '🖱️ Click anywhere on the map to place a new location'}
          </span>
          <button
            className="btn-add"
            onClick={() => {
              if (!clickPosition) {
                alert('Click on the map first to choose where to place the location.');
                return;
              }
              setShowAddModal(true);
            }}
            disabled={!clickPosition}
          >
            ➕ Add Location
          </button>
          <button className="btn-refresh" onClick={() => window.location.reload()}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="map-container">
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            gestureHandling="greedy"
            onClick={handleMapClick}
            onCenterChanged={(e) => setMapCenter(e.detail.center)}
            onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
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
                strokeOpacity={0.8}
              />
            ))}

            {/* Campus location markers */}
            {locations.map((location) => (
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

            {/* Preview marker where admin clicked */}
            {clickPosition && (
              <Marker
                position={clickPosition}
                icon={{
                  path: 'M0,-15 C-10,-15 -10,0 0,15 C10,0 10,-15 0,-15',
                  fillColor: '#FF5722',
                  fillOpacity: 0.7,
                  strokeWeight: 2,
                  strokeColor: '#FFFFFF',
                  scale: 1.4,
                }}
                label={{ text: '➕', fontSize: '14px' }}
                title="New location will be placed here"
              />
            )}

            {/* Info window for selected location */}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="location-info-window">
                  <h3>{selectedLocation.name}</h3>
                  <div className="category-badge">
                    {CATEGORY_ICONS[selectedLocation.category]} {selectedLocation.category}
                  </div>
                  <p>{selectedLocation.description}</p>
                  {selectedLocation.tags && (
                    <div className="tags">
                      {selectedLocation.tags.map((tag) => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="action-buttons">
                    <button
                      className="btn-delete"
                      onClick={() => {
                        deleteLocation(selectedLocation.id);
                        setSelectedLocation(null);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {showAddModal && (
        <AddLocationModal
          position={clickPosition}
          onClose={() => {
            setShowAddModal(false);
            clearClickPosition();
          }}
          onSave={handleAddLocation}
        />
      )}
    </div>
  );
};

export default AdminDashboard;