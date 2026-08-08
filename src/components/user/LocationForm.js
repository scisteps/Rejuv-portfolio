import React, { useState } from 'react';
import { db, auth } from '../../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './LocationForm.css';

// ── Placeholder category/subcategory map ──────────────────────────────────
// Replace with your real CATEGORY_TYPES from utils/geoData.js if it already
// defines categories — this is just a working default.
const CATEGORY_OPTIONS = {
  academic:   { label: '🎓 Academic',   subcategories: ['Lecture Hall', 'Library', 'Laboratory', 'Department Office'] },
  dining:     { label: '🍽️ Dining',     subcategories: ['Cafeteria', 'Restaurant', 'Café', 'Food Stall'] },
  residence:  { label: '🏠 Residence',  subcategories: ['Hall of Residence', 'Hostel'] },
  recreation: { label: '⚽ Recreation', subcategories: ['Sports Field', 'Gym', 'Park'] },
  services:   { label: '🛠️ Services',   subcategories: ['Bank', 'Health Center', 'ICT Center', 'Bookshop'] },
  other:      { label: '📍 Other',      subcategories: [] },
};

const LocationForm = ({
  lat,
  lng,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // reset subcategory whenever category changes
      ...(name === 'category' ? { subcategory: '' } : {}),
    }));
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

    // Everything is optional — no validation gate. We just make sure
    // the user didn't submit a completely empty form by accident.
    const hasAnyContent =
      formData.name.trim() ||
      formData.category ||
      formData.description.trim() ||
      formData.image;

    if (!hasAnyContent) {
      setError('Add at least one detail (name, category, description, or image) before saving.');
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
        status: 'pending',
        views: 0,
        likes: 0,
        name: formData.name.trim() || null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        description: formData.description.trim() || null,
        contactInfo: formData.contactInfo.trim() || null,
        website: formData.website.trim() || null,
        hours: formData.hours.trim() || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        ...(imageUrl ? { imageUrl, imageName } : {}),
      };

      const docRef = await addDoc(collection(db, 'locations'), locationData);

      onSuccess({ id: docRef.id, ...locationData });

      setFormData({
        name: '',
        category: '',
        subcategory: '',
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

  const subcategoryOptions = formData.category
    ? CATEGORY_OPTIONS[formData.category]?.subcategories || []
    : [];

  return (
    <div className="location-form-overlay" onClick={onClose}>
      <div className="location-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-form-header">
          <h2>📍 Add Location Details</h2>
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

          <div className="form-group">
            <label htmlFor="name">Location Name <span className="optional-tag">(optional)</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Main Library, Student Center"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category <span className="optional-tag">(optional)</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select category…</option>
                {Object.entries(CATEGORY_OPTIONS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Subcategory <span className="optional-tag">(optional)</span></label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                disabled={!formData.category || subcategoryOptions.length === 0}
              >
                <option value="">
                  {formData.category ? 'Select subcategory…' : 'Pick a category first'}
                </option>
                {subcategoryOptions.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="optional-tag">(optional)</span></label>
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
            <label htmlFor="contactInfo">Contact Information <span className="optional-tag">(optional)</span></label>
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
            <label htmlFor="website">Website <span className="optional-tag">(optional)</span></label>
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
            <label htmlFor="hours">Operating Hours <span className="optional-tag">(optional)</span></label>
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
            <label htmlFor="rating">Rating (0-5) <span className="optional-tag">(optional)</span></label>
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

          <div className="form-group">
            <label>Image <span className="optional-tag">(optional)</span></label>
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

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;