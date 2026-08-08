// src/components/user/LocationActionModal.jsx
import React, { useState } from 'react';
import './LocationActionModal.css';

const LocationActionModal = ({ 
  location, 
  onClose, 
  onAddInfo, 
  onAddImage, 
  onAddBoth 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Small delay to show selection feedback
    setTimeout(() => {
      switch(option) {
        case 'info':
          onAddInfo();
          break;
        case 'image':
          onAddImage();
          break;
        case 'both':
          onAddBoth();
          break;
        default:
          break;
      }
    }, 200);
  };

  return (
    <div className="location-action-overlay" onClick={onClose}>
      <div className="location-action-modal" onClick={(e) => e.stopPropagation()}>
        <button className="action-close-btn" onClick={onClose}>✕</button>
        
        <div className="action-header">
          <div className="action-location-pin">📍</div>
          <h3>Add Location Details</h3>
          <p className="action-coords">
            {location?.lat?.toFixed(6)}, {location?.lng?.toFixed(6)}
          </p>
        </div>

        <div className="action-options">
          <div 
            className={`action-option ${selectedOption === 'info' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('info')}
          >
            <div className="option-icon">📝</div>
            <div className="option-content">
              <h4>Add Info Only</h4>
              <p>Add name, category, description, and details</p>
            </div>
            <div className="option-arrow">→</div>
          </div>

          <div 
            className={`action-option ${selectedOption === 'image' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('image')}
          >
            <div className="option-icon">📸</div>
            <div className="option-content">
              <h4>Add Image Only</h4>
              <p>Upload photos without additional info</p>
            </div>
            <div className="option-arrow">→</div>
          </div>

          <div 
            className={`action-option ${selectedOption === 'both' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('both')}
          >
            <div className="option-icon">✨</div>
            <div className="option-content">
              <h4>Add Both</h4>
              <p>Add complete location info with images</p>
            </div>
            <div className="option-arrow">→</div>
          </div>
        </div>

        <div className="action-footer">
          <button className="action-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LocationActionModal;