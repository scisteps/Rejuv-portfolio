// src/components/User/LocationDetails.jsx
import React, { useState } from 'react';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/geoData';
import './LocationDetails.css';

const LocationDetails = ({ location }) => {
  const [showAllImages, setShowAllImages] = useState(false);

  return (
    <div className="location-details">
      <div className="details-header">
        <h3>{location.name}</h3>
        <span 
          className="category-badge"
          style={{ backgroundColor: CATEGORY_COLORS[location.category] }}
        >
          {CATEGORY_ICONS[location.category]} {location.category}
        </span>
      </div>

      {location.description && (
        <p className="details-description">{location.description}</p>
      )}

      {location.tags && location.tags.length > 0 && (
        <div className="details-tags">
          {location.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      {location.images && location.images.length > 0 && (
        <div className="details-images">
          <div className="image-grid">
            {(showAllImages ? location.images : location.images.slice(0, 3)).map((img, index) => (
              <div key={index} className="image-item">
                <img src={img} alt={`${location.name} ${index + 1}`} />
              </div>
            ))}
          </div>
          {location.images.length > 3 && !showAllImages && (
            <button 
              className="btn-show-more"
              onClick={() => setShowAllImages(true)}
            >
              + {location.images.length - 3} more
            </button>
          )}
        </div>
      )}

      <div className="details-meta">
        <span>📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
        <span>🕐 {new Date(location.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default LocationDetails;