// src/components/Admin/AddLocationModal.jsx
import React, { useState } from 'react';
import { CATEGORY_TYPES, CATEGORY_ICONS } from '../../utils/geoData';
import './AddLocationModal.css';

const AddLocationModal = ({ position, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    description: '',
    tags: '',
    images: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim());
      await onSave({
        ...formData,
        tags: tags.filter(tag => tag.length > 0)
      });
    } catch (error) {
      console.error('Failed to save location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📍 Add New Location</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Location Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter location name"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {Object.entries(CATEGORY_TYPES).map(([key, value]) => (
                <option key={value} value={value}>
                  {CATEGORY_ICONS[value]} {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this location"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., playground, picnic, walking"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;