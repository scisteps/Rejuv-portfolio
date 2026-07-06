// src/components/AdminMap/AdminMap.jsx
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Lottie from 'lottie-react';
import './AdminMap.css';

const AdminMap = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 37.360, lng: -122.065 });
  const [mapZoom, setMapZoom] = useState(16);
  const [selectedRoads, setSelectedRoads] = useState([]);
  const [selectedHalls, setSelectedHalls] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedGates, setSelectedGates] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [lottieAnimations, setLottieAnimations] = useState({});
  const [showImages, setShowImages] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Sample data structure - replace with your actual data
  const [mapData, setMapData] = useState({
    roads: [
      { id: 'road1', name: 'Main Road', coordinates: [], color: '#FF6B6B' },
      { id: 'road2', name: 'Campus Drive', coordinates: [], color: '#4ECDC4' },
      // Add more roads
    ],
    halls: [
      { id: 'hall1', name: 'Dining Hall', lat: 37.361, lng: -122.065 },
      { id: 'hall2', name: 'Lecture Hall A', lat: 37.362, lng: -122.067 },
    ],
    colleges: [
      { id: 'college1', name: 'Engineering College', lat: 37.363, lng: -122.068 },
      { id: 'college2', name: 'Science College', lat: 37.359, lng: -122.064 },
    ],
    gates: [
      { id: 'gate1', name: 'Main Gate', lat: 37.357, lng: -122.069 },
      { id: 'gate2', name: 'South Gate', lat: 37.356, lng: -122.063 },
    ],
    locations: [
      { 
        id: 'loc1', 
        name: 'Campus Center', 
        lat: 37.3605, 
        lng: -122.0655,
        images: ['/images/campus-center-1.jpg', '/images/campus-center-2.jpg'],
        lottieAnimation: null // You'll import and add Lottie animations here
      }
    ]
  });

  // Handle road color change
  const handleRoadColorChange = (roadId, color) => {
    setMapData(prev => ({
      ...prev,
      roads: prev.roads.map(road => 
        road.id === roadId ? { ...road, color } : road
      )
    }));
  };

  // Handle filter changes
  const handleFilterChange = (type, value, checked) => {
    const setters = {
      roads: setSelectedRoads,
      halls: setSelectedHalls,
      colleges: setSelectedColleges,
      gates: setSelectedGates,
      locations: setSelectedLocations
    };
    
    const setter = setters[type];
    if (setter) {
      setter(prev => 
        checked 
          ? [...prev, value]
          : prev.filter(item => item !== value)
      );
    }
  };

  // Handle location click
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowImages(true);
  };

  // Render road polylines with colors
  const renderRoads = () => {
    return mapData.roads.map(road => (
      <Polyline
        key={road.id}
        path={road.coordinates}
        strokeColor={road.color}
        strokeWeight={3}
        strokeOpacity={0.8}
        visible={selectedRoads.includes(road.id)}
      />
    ));
  };

  return (
    <div className="admin-map-container">
      <div className="admin-controls">
        <h3>Admin Map Controls</h3>
        
        {/* Roads Dropdown */}
        <div className="dropdown-group">
          <label>Roads</label>
          {mapData.roads.map(road => (
            <div key={road.id} className="filter-item">
              <input
                type="checkbox"
                checked={selectedRoads.includes(road.id)}
                onChange={(e) => handleFilterChange('roads', road.id, e.target.checked)}
              />
              <span style={{ color: road.color }}>●</span>
              <span>{road.name}</span>
              <input
                type="color"
                value={road.color}
                onChange={(e) => handleRoadColorChange(road.id, e.target.value)}
                className="color-picker"
              />
            </div>
          ))}
        </div>

        {/* Halls Dropdown */}
        <div className="dropdown-group">
          <label>Halls</label>
          {mapData.halls.map(hall => (
            <div key={hall.id} className="filter-item">
              <input
                type="checkbox"
                checked={selectedHalls.includes(hall.id)}
                onChange={(e) => handleFilterChange('halls', hall.id, e.target.checked)}
              />
              <span>{hall.name}</span>
            </div>
          ))}
        </div>

        {/* Colleges Dropdown */}
        <div className="dropdown-group">
          <label>Colleges</label>
          {mapData.colleges.map(college => (
            <div key={college.id} className="filter-item">
              <input
                type="checkbox"
                checked={selectedColleges.includes(college.id)}
                onChange={(e) => handleFilterChange('colleges', college.id, e.target.checked)}
              />
              <span>{college.name}</span>
            </div>
          ))}
        </div>

        {/* Gates Dropdown */}
        <div className="dropdown-group">
          <label>Gates</label>
          {mapData.gates.map(gate => (
            <div key={gate.id} className="filter-item">
              <input
                type="checkbox"
                checked={selectedGates.includes(gate.id)}
                onChange={(e) => handleFilterChange('gates', gate.id, e.target.checked)}
              />
              <span>{gate.name}</span>
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
            disableDefaultUI={false}
            mapId={process.env.REACT_APP_MAP_ID}
          >
            {/* Render roads */}
            {renderRoads()}

            {/* Render halls */}
            {mapData.halls
              .filter(hall => selectedHalls.includes(hall.id))
              .map(hall => (
                <Marker
                  key={hall.id}
                  position={{ lat: hall.lat, lng: hall.lng }}
                  title={hall.name}
                />
              ))}

            {/* Render colleges */}
            {mapData.colleges
              .filter(college => selectedColleges.includes(college.id))
              .map(college => (
                <Marker
                  key={college.id}
                  position={{ lat: college.lat, lng: college.lng }}
                  title={college.name}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2
                  }}
                />
              ))}

            {/* Render gates */}
            {mapData.gates
              .filter(gate => selectedGates.includes(gate.id))
              .map(gate => (
                <Marker
                  key={gate.id}
                  position={{ lat: gate.lat, lng: gate.lng }}
                  title={gate.name}
                />
              ))}

            {/* Render locations with Lottie animations */}
            {mapData.locations
              .filter(loc => selectedLocations.includes(loc.id))
              .map(location => (
                <CustomMarker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  onClick={() => handleLocationClick(location)}
                  lottieAnimation={location.lottieAnimation}
                />
              ))}
          </Map>
        </APIProvider>
      </div>

      {/* Images Modal */}
      {showImages && selectedLocation && (
        <div className="images-modal">
          <div className="modal-content">
            <button onClick={() => setShowImages(false)}>Close</button>
            <h3>{selectedLocation.name}</h3>
            <div className="images-grid">
              {selectedLocation.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${selectedLocation.name} ${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Marker with Lottie
const CustomMarker = ({ position, onClick, lottieAnimation }) => {
  return (
    <Marker position={position} onClick={onClick}>
      {lottieAnimation && (
        <div className="lottie-marker">
          <Lottie animationData={lottieAnimation} loop={true} />
        </div>
      )}
    </Marker>
  );
};

export default AdminMap;