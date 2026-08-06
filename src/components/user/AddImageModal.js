// src/components/user/AddImageModal.jsx
import React, { useState } from 'react';
import './AddImageModal.css';

const AddImageModal = ({ location, onClose, onSave }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageData;
      
      if (uploadMethod === 'url' && imageUrl) {
        // Using URL
        imageData = imageUrl;
      } else if (uploadMethod === 'file' && imageFile) {
        // For demo, we'll convert file to base64
        // In production, you'd upload to a server and get back a URL
        imageData = preview;
      } else {
        alert('Please provide an image URL or select a file.');
        setLoading(false);
        return;
      }

      await onSave(imageData);
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content image-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📸 Add Image to {location.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Method</label>
            <div className="method-selector">
              <button
                type="button"
                className={`method-btn ${uploadMethod === 'url' ? 'active' : ''}`}
                onClick={() => setUploadMethod('url')}
              >
                🔗 Image URL
              </button>
              <button
                type="button"
                className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
                onClick={() => setUploadMethod('file')}
              >
                📁 Upload File
              </button>
            </div>
          </div>

          {uploadMethod === 'url' && (
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required={uploadMethod === 'url'}
              />
            </div>
          )}

          {uploadMethod === 'file' && (
            <div className="form-group">
              <label>Select Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={uploadMethod === 'file'}
              />
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : '📸 Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddImageModal;