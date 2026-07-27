// src/pages/AdminDashboard.jsx (with hook)
import React, { useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow, Polyline } from '@vis.gl/react-google-maps';
import { useGeoData } from '../hooks/useGeoData';
import { useMapClick } from '../hooks/useMapClick';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/geoData';
import AddLocationModal from '../components/admin/AddLocationModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.3605, lng: -122.0655 });
  const [mapZoom, setMapZoom] = useState(16);

  const { locations, roads, loading, addLocation, deleteLocation } = useGeoData();
  const { clickPosition, handleMapClick, clearClickPosition } = useMapClick();

  const handleAddLocation = async (locationData) => {
    try {
      await addLocation({
        ...locationData,
        lat: clickPosition.lat,
        lng: clickPosition.lng,
        createdBy: 'admin',
        createdAt: new Date().toISOString()
      });
      setShowAddModal(false);
      clearClickPosition();
    } catch (error) {
      console.error('Failed to add location:', error);
      alert('Failed to add location. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading map data...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏙️ Admin Dashboard</h1>
        <div className="admin-controls">
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
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
            onCenterChange={setMapCenter}
            onZoomChange={setMapZoom}
          >
            {/* Your map content */}
            {roads.map(road => (
              <Polyline
                key={road.id}
                path={road.coordinates}
                strokeColor={road.color}
                strokeWeight={3}
                strokeOpacity={0.8}
              />
            ))}

            {locations.map(location => (
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
                      {selectedLocation.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="action-buttons">
                    <button 
                      className="btn-delete" 
                      onClick={() => deleteLocation(selectedLocation.id)}
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