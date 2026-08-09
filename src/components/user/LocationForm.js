// src/components/user/LocationForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { addLocation, updateLocation, getCategories } from '../../services/Firestoreservice';
import { auth } from '../../Firebase';
import ImageUploadModal from './ImageUploadModal';
import './LocationForm.css';

const LocationForm = ({ 
  lat, 
  lng, 
  location = null, 
  onClose, 
  onSuccess 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
  });
  const [currentUser, setCurrentUser] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadCategories();
    if (location) {
      setFormData({
        name: location.name || '',
        description: location.description || '',
        category: location.category || '',
        subcategory: location.subcategory || '',
      });
      // Load existing images if any
      if (location.images) {
        setUploadedImages(location.images);
      }
    }
  }, [location]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUploadComplete = (images) => {
    setUploadedImages(prev => [...prev, ...images]);
    setShowImageUpload(false);
  };

  const handleRemoveImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to add a location');
      return;
    }

    if (!formData.name.trim()) {
      setError('Location name is required');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const locationData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory.trim(),
        lat: lat || location?.lat,
        lng: lng || location?.lng,
        createdBy: currentUser.uid,
        images: uploadedImages.map(img => ({
          id: img.id,
          url: img.url,
          fileName: img.fileName
        }))
      };

      if (location) {
        // Update existing location
        await updateLocation(location.id, locationData);
      } else {
        // Add new location
        await addLocation(locationData);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving location:', err);
      setError(err.message || 'Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  // Get subcategories for selected category
  const selectedCategory = categories.find(c => c.id === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="location-form-overlay" onClick={onClose}>
      <div className="location-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{location ? 'Edit Location' : 'Add New Location'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Location Name */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Location Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Central Park"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={loading || !subcategories.length}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description / Details */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Details / Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this location..."
                rows="4"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location Preview */}
          <div className="form-location-preview">
            <span>📍 Position: {lat?.toFixed(6) || location?.lat?.toFixed(6)}, {lng?.toFixed(6) || location?.lng?.toFixed(6)}</span>
          </div>

          {/* Image Upload Section */}
          <div className="form-image-section">
            <div className="image-section-header">
              <label>Images</label>
              <button
                type="button"
                className="add-image-btn"
                onClick={() => setShowImageUpload(true)}
                disabled={loading}
              >
                + Add Images
              </button>
            </div>

            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="image-preview-grid">
                {uploadedImages.map((img, index) => (
                  <div key={img.id || index} className="image-preview-item">
                    <img src={img.url} alt={img.fileName || 'Uploaded image'} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(img.id)}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadedImages.length === 0 && (
              <div className="image-placeholder">
                <span className="placeholder-icon">🖼️</span>
                <p>No images uploaded yet</p>
                <small>Click "Add Images" to upload</small>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                location ? 'Update Location' : 'Add Location'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          userId={currentUser?.uid}
          locationId={location?.id}
          categoryId={formData.category}
          onUploadComplete={handleImageUploadComplete}
        />
      )}
    </div>
  );
};

export default LocationForm;