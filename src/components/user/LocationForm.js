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
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    categoryText: '', // For custom category text
    subcategory: '',
    subcategoryText: '', // For custom subcategory text
  });
  
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
        categoryText: location.category || '',
        subcategory: location.subcategory || '',
        subcategoryText: location.subcategory || '',
      });
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
    
    // If selecting from dropdown, clear text input
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        categoryText: value === 'custom' ? prev.categoryText : value
      }));
    }
    
    if (name === 'subcategory') {
      setFormData(prev => ({
        ...prev,
        subcategory: value,
        subcategoryText: value === 'custom' ? prev.subcategoryText : value
      }));
    }
  };

  const handleCategoryTextChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      categoryText: value,
      category: value // Sync with category field
    }));
  };

  const handleSubcategoryTextChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      subcategoryText: value,
      subcategory: value // Sync with subcategory field
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

    // Get final category value (from dropdown or text input)
    const finalCategory = formData.category || formData.categoryText || '';
    const finalSubcategory = formData.subcategory || formData.subcategoryText || '';

    if (!finalCategory) {
      setError('Please select or enter a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const locationData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: finalCategory,
        subcategory: finalSubcategory,
        lat: lat || location?.lat,
        lng: lng || location?.lng,
        createdBy: currentUser.uid,
        images: uploadedImages.map(img => ({
          id: img.id,
          url: img.url,
          fileName: img.fileName
        }))
      };

      // If this is a new category, save it to the categories collection
      if (!categories.find(c => c.id === finalCategory || c.name === finalCategory)) {
        // Save new category
        const newCategoryData = {
          name: finalCategory,
          subcategories: finalSubcategory ? [finalSubcategory] : [],
          icon: '📍',
          createdBy: currentUser.uid,
          createdAt: new Date()
        };
        // You can save this to a 'categories' collection
        // await addCategory(newCategoryData);
      }

      if (location) {
        await updateLocation(location.id, locationData);
      } else {
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
  const selectedCategory = categories.find(c => c.id === formData.category || c.name === formData.category);
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

          {/* Category - Dropdown + Text Input */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Category *</label>
              <div className="category-input-group">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="category-select"
                  disabled={loading}
                >
                  <option value="">Select from saved categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon || '📍'} {cat.name}
                    </option>
                  ))}
                  <option value="custom">✏️ Enter custom category</option>
                </select>
                
                {formData.category === 'custom' && (
                  <div className="custom-input-wrapper">
                    <input
                      type="text"
                      value={formData.categoryText}
                      onChange={handleCategoryTextChange}
                      placeholder="Enter custom category name"
                      className="custom-input"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                )}
                
                {/* Or always show text input as alternative */}
                <div className="or-divider">
                  <span>OR</span>
                </div>
                <input
                  type="text"
                  value={formData.categoryText}
                  onChange={handleCategoryTextChange}
                  placeholder="Or type new category name"
                  className="text-input-alt"
                  disabled={loading}
                />
              </div>
              <small className="field-hint">Select from dropdown or type your own</small>
            </div>
          </div>

          {/* Subcategory - Dropdown + Text Input */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Subcategory</label>
              <div className="subcategory-input-group">
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="subcategory-select"
                  disabled={loading || !categories.length}
                >
                  <option value="">Select from saved subcategories</option>
                  {subcategories.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="custom">✏️ Enter custom subcategory</option>
                </select>
                
                {formData.subcategory === 'custom' && (
                  <div className="custom-input-wrapper">
                    <input
                      type="text"
                      value={formData.subcategoryText}
                      onChange={handleSubcategoryTextChange}
                      placeholder="Enter custom subcategory"
                      className="custom-input"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                )}
                
                <div className="or-divider">
                  <span>OR</span>
                </div>
                <input
                  type="text"
                  value={formData.subcategoryText}
                  onChange={handleSubcategoryTextChange}
                  placeholder="Or type new subcategory name"
                  className="text-input-alt"
                  disabled={loading}
                />
              </div>
              <small className="field-hint">Select from dropdown or type your own</small>
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