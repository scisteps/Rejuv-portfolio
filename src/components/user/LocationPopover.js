// src/components/User/LocationPopover.jsx
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover.tsx';
import { CATEGORY_TYPES, CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/geoData';
import { useGeoData } from '../../hooks/useGeoData';
import './LocationPopover.css';

const LocationPopover = ({ 
  children, 
  lat, 
  lng, 
  onSuccess,
  position // 'bottom' or 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    image: null,
    imagePreview: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addLocation } = useGeoData();

  // Category subcategories
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // At least one field should be filled
    const hasContent = 
      formData.name.trim() || 
      formData.category || 
      formData.description.trim() || 
      formData.image;

    if (!hasContent) {
      setError('Add at least one detail (name, category, description, or image)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationData = {
        name: formData.name.trim() || 'Unnamed Location',
        category: formData.category || 'other',
        subcategory: formData.subcategory || '',
        description: formData.description.trim() || '',
        lat: lat,
        lng: lng,
        images: formData.imagePreview ? [formData.imagePreview] : [],
        createdBy: 'user',
        createdAt: new Date().toISOString()
      };

      await addLocation(locationData);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        description: '',
        image: null,
        imagePreview: null
      });
      
      setIsOpen(false);
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error('Failed to save location:', err);
      setError('Failed to save. Please try again.');
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="location-popover-content"
        side={position || 'bottom'}
        align="center"
        sideOffset={8}
      >
        <div className="popover-header">
          <h3>📍 Add Location</h3>
          <button 
            className="popover-close" 
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="popover-form">
          {error && <div className="popover-error">{error}</div>}

          {/* Name */}
          <div className="form-field">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Location name (optional)"
              className="field-input"
            />
          </div>

          {/* Category + Subcategory */}
          <div className="form-row">
            <div className="form-field half">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="field-select"
                style={{
                  borderColor: formData.category ? CATEGORY_COLORS[formData.category] : '#ddd'
                }}
              >
                <option value="">Category</option>
                {Object.entries(CATEGORY_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {CATEGORY_ICONS[value]} {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field half">
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="field-select"
                disabled={!formData.category}
              >
                <option value="">
                  {formData.category ? 'Subcategory' : 'Pick category first'}
                </option>
                {getSubcategories().map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description (optional)"
              className="field-textarea"
              rows="2"
            />
          </div>

          {/* Image Upload */}
          <div className="form-field">
            {formData.imagePreview ? (
              <div className="image-preview-container">
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  className="image-preview-thumb"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="image-upload-label">
                <span className="upload-icon">📸</span>
                <span>Add image (optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="popover-submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save'}
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default LocationPopover;