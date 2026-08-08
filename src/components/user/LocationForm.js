// src/components/User/LocationForm.jsx
import React, { useState } from 'react';
import { db, auth } from '../../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CATEGORY_TYPES, CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/geoData';
import './LocationForm.css';

const LocationForm = ({
  lat,
  lng,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
    image: null,
    imagePreview: null,
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get list of categories from CATEGORY_TYPES
  const categoryOptions = Object.values(CATEGORY_TYPES);

  // Subcategories based on selected category
  const getSubcategories = () => {
    const subcategories = {
      restaurant: ['Fast Food', 'Fine Dining', 'Cafe', 'Takeaway', 'Food Court'],
      park: ['Playground', 'Picnic Area', 'Walking Trail', 'Garden', 'Sports Field'],
      shopping: ['Mall', 'Boutique', 'Supermarket', 'Market', 'Convenience Store'],
      school: ['University', 'College', 'High School', 'Primary School', 'Library'],
      hospital: ['Clinic', 'Pharmacy', 'Health Center', 'Dental', 'Laboratory'],
      gym: ['Fitness Center', 'Yoga Studio', 'CrossFit', 'Swimming Pool', 'Dance Studio'],
      library: ['Public Library', 'Study Area', 'Archive', 'Reading Room'],
      community: ['Community Center', 'Town Hall', 'Meeting Space', 'Event Venue'],
      entertainment: ['Cinema', 'Theater', 'Concert Hall', 'Arcade', 'Amusement Park'],
      transport: ['Bus Stop', 'Train Station', 'Taxi Stand', 'Parking', 'Bike Station'],
      religious: ['Church', 'Mosque', 'Temple', 'Synagogue', 'Prayer Room'],
      other: ['Workspace', 'Co-working', 'Studio', 'Gallery', 'Workshop']
    };
    return subcategories[formData.category] || [];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
    // Reset new category when selecting existing
    if (name === 'category') {
      setShowNewCategory(false);
      setNewCategory('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        category: newCategory.trim().toLowerCase().replace(/\s+/g, '_')
      }));
      setShowNewCategory(false);
      setNewCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one field is filled
    const hasContent = 
      formData.category ||
      formData.description.trim() ||
      formData.image;

    if (!hasContent) {
      setError('Add at least one detail (category, description, or image)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to add a location.');
      }

      let imageUrl = null;
      let imageName = null;

      if (formData.image) {
        const storage = getStorage();
        const timestamp = Date.now();
        const fileName = `locations/${user.uid}/${timestamp}_${formData.image.name}`;
        const storageRef = ref(storage, fileName);

        const uploadResult = await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(uploadResult.ref);
        imageName = formData.image.name;
      }

      const locationData = {
        lat,
        lng,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        description: formData.description.trim() || null,
        ...(imageUrl ? { imageUrl, imageName } : {}),
      };

      const docRef = await addDoc(collection(db, 'locations'), locationData);

      onSuccess({ id: docRef.id, ...locationData });

      setFormData({
        category: '',
        subcategory: '',
        description: '',
        image: null,
        imagePreview: null,
      });
      setNewCategory('');
      setShowNewCategory(false);

    } catch (err) {
      console.error('Error adding location:', err);
      setError(err.message || 'Failed to add location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const subcategoryOptions = getSubcategories();

  return (
    <div className="location-form-overlay" onClick={onClose}>
      <div className="location-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-form-header">
          <h2>📍 Add Location</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          {error && <div className="form-error">{error}</div>}

          {/* Coordinates */}
          <div className="form-section">
            <div className="coord-display">
              <span>📍 {lat.toFixed(6)}, {lng.toFixed(6)}</span>
            </div>
          </div>

          {/* Category with Add New Option */}
          <div className="form-group">
            <label>Category <span className="optional-tag">(optional)</span></label>
            <div className="category-input-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="field-select"
                style={{
                  borderColor: formData.category ? CATEGORY_COLORS[formData.category] || '#ddd' : '#ddd'
                }}
              >
                <option value="">Select or add category…</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_ICONS[cat] || '📍'} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
                <option value="__add_new__">➕ Add new category</option>
              </select>
            </div>

            {/* Add New Category Input */}
            {showNewCategory && (
              <div className="new-category-input">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="field-input"
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={handleAddNewCategory}
                  className="btn-add-category"
                >
                  Add
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory('');
                  }}
                  className="btn-cancel-category"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Hint to add new category */}
            {!showNewCategory && (
              <small className="field-hint">
                Select "Add new category" to create your own
              </small>
            )}
          </div>

          {/* Subcategory */}
          <div className="form-group">
            <label>Subcategory <span className="optional-tag">(optional)</span></label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="field-select"
              disabled={!formData.category}
            >
              <option value="">
                {formData.category ? 'Select subcategory…' : 'Select a category first'}
              </option>
              {subcategoryOptions.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description <span className="optional-tag">(optional)</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this location..."
              className="field-textarea"
              rows="3"
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Image <span className="optional-tag">(optional)</span></label>
            <div className="image-upload-area">
              {formData.imagePreview ? (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeImage}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
                  <span>📸</span>
                  <p>Click to add image</p>
                  <small>JPEG, PNG, WebP (max 5MB)</small>
                </div>
              )}
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;