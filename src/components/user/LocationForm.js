// src/components/user/LocationForm.jsx
import React, { useState } from 'react';
import { db, auth } from '../../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './LocationForm.css';

const LocationForm = ({ 
  lat, 
  lng, 
  mode = 'both',
  onClose, 
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: null,
    contactInfo: '',
    website: '',
    hours: '',
    rating: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((mode === 'info' || mode === 'both') && !formData.name.trim()) {
      setError('Please enter a location name.');
      return;
    }

    if (mode === 'image' && !formData.image) {
      setError('Please select an image to upload.');
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
        lat: lat,
        lng: lng,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending',
        views: 0,
        likes: 0,
      };

      if (mode === 'info' || mode === 'both') {
        locationData.name = formData.name.trim();
        locationData.description = formData.description.trim() || null;
        locationData.contactInfo = formData.contactInfo.trim() || null;
        locationData.website = formData.website.trim() || null;
        locationData.hours = formData.hours.trim() || null;
        locationData.rating = parseFloat(formData.rating) || 0;
      }

      if (imageUrl) {
        locationData.imageUrl = imageUrl;
        locationData.imageName = imageName;
      }

      const docRef = await addDoc(collection(db, 'locations'), locationData);
      
      onSuccess({
        id: docRef.id,
        ...locationData
      });
      
      setFormData({
        name: '',
        description: '',
        image: null,
        imagePreview: null,
        contactInfo: '',
        website: '',
        hours: '',
        rating: 0,
      });
      
    } catch (err) {
      console.error('Error adding location:', err);
      setError(err.message || 'Failed to add location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showInfoFields = (mode === 'info' || mode === 'both');
  const showImageField = (mode === 'image' || mode === 'both');

  return (
    <div className="location-form-overlay" onClick={onClose}>
      <div className="location-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-form-header">
          <h2>
            {mode === 'info' && '📝 Add Location Info'}
            {mode === 'image' && '📸 Upload Image'}
            {mode === 'both' && '✨ Add Location with Image'}
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-section">
            <h3>📍 Location</h3>
            <div className="coord-display">
              <span>Lat: {lat.toFixed(6)}</span>
              <span>Lng: {lng.toFixed(6)}</span>
            </div>
          </div>

          {showInfoFields && (
            <>
              <div className="form-group">
                <label htmlFor="name">Location Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Library, Student Center"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this location..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactInfo">Contact Information</label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Phone number or email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours">Operating Hours</label>
                <input
                  type="text"
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Fri 8am-6pm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.5"
                  placeholder="0-5"
                />
              </div>
            </>
          )}

          {showImageField && (
            <div className="form-group">
              <label>Upload Image</label>
              <div className="image-upload-area">
                {formData.imagePreview ? (
                  <div className="image-preview">
                    <img src={formData.imagePreview} alt="Preview" />
                    <button 
                      type="button"
                      className="remove-image"
                      onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: null }))}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
                    <span>📸</span>
                    <p>Click to upload image</p>
                    <small>JPEG, PNG, or WebP (max 5MB)</small>
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
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;