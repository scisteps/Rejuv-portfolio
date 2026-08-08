// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import MapWrapper from '../components/map/MapWrapper';
import { Marker, Polyline } from 'googlemaps-react-primitives';
import { useGeoData } from '../hooks/useGeoData';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/geoData';
import AddLocationModal from '../components/admin/AddLocationModal';
import './AdminDashboard.css';

const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };

function AdminDashboard() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(17);
  const [clickPosition, setClickPosition] = useState(null);

  const { locations, roads, loading, addLocation, deleteLocation } = useGeoData();

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setClickPosition({ lat, lng });
    setShowAddModal(true);
  };

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
      setClickPosition(null);
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
        <h1>🏛️ Admin Dashboard</h1>
        <div className="admin-controls">
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            ➕ Add Location
          </button>
        </div>
      </div>

      <div className="map-container">
        <MapWrapper
          center={mapCenter}
          zoom={mapZoom}
          onClick={handleMapClick}
        >
          {/* Roads */}
          {roads.map(road => (
            <Polyline
              key={road.id}
              path={road.coordinates}
              strokeColor={road.color}
              strokeWeight={3}
              strokeOpacity={0.8}
            />
          ))}

          {/* Locations */}
          {locations.map(location => (
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
                anchor: new window.google.maps.Point(0, 0)

              }}
              label={{
                text: CATEGORY_ICONS[location.category] || '📍',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            />
          ))}

          {/* Click Preview */}
          {clickPosition && (
            <Marker
              position={clickPosition}
              icon={{
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                fillColor: '#FF5722',
                fillOpacity: 0.7,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
                scale: 1.4,
                anchor:new window.google.maps.Point(0, 0)

              }}
              label={{ text: '➕', fontSize: '14px' }}
            />
          )}
        </MapWrapper>
      </div>

      {showAddModal && (
        <AddLocationModal
          position={clickPosition}
          onClose={() => {
            setShowAddModal(false);
            setClickPosition(null);
          }}
          onSave={handleAddLocation}
        />
      )}
    </div>
  );
}

export default AdminDashboard;