// src/components/user/ImageUploadModal.jsx
import React, { useState, useRef } from 'react';
import { uploadImage, uploadMultipleImages } from '../../services/imageService';
import './ImageUploadModal.css';

const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  userId, 
  locationId = null, 
  categoryId = null,
  onUploadComplete 
}) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Create previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setError('');
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(previews[index]);
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError('Please select at least one image');
      return;
    }

    if (!userId) {
      setError('You must be logged in to upload images');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const metadata = {
        uploadedBy: userId,
        locationId: locationId,
        categoryId: categoryId,
        description: description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic: isPublic
      };

      let results;
      if (files.length === 1) {
        // Single upload
        const result = await uploadImage(files[0], metadata);
        results = [result];
      } else {
        // Multiple upload
        results = await uploadMultipleImages(files, metadata);
      }

      setProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete(results);
      }
      
      // Reset form after successful upload
      setTimeout(() => {
        onClose();
        setFiles([]);
        setPreviews([]);
        setDescription('');
        setTags('');
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="image-upload-overlay" onClick={onClose}>
      <div className="image-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-upload-header">
          <h2>📸 Upload Images</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="image-upload-body">
          {error && <div className="upload-error">{error}</div>}

          {/* File Input */}
          <div className="file-drop-zone" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={uploading}
            />
            <div className="drop-zone-content">
              <span className="upload-icon">📤</span>
              <p>Click to select images or drag & drop</p>
              <small>Supported formats: JPG, PNG, GIF, WebP</small>
            </div>
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="preview-grid">
              {previews.map((preview, index) => (
                <div key={index} className="preview-item">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button 
                    className="remove-image-btn"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading}
                  >
                    ✕
                  </button>
                  <span className="file-name">{files[index]?.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Metadata Fields */}
          <div className="metadata-fields">
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                disabled={uploading}
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. sunset, beach, vacation"
                disabled={uploading}
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={uploading}
                />
                Make images public
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="upload-actions">
            <button 
              className="cancel-btn" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              className="upload-btn" 
              onClick={handleUpload}
              disabled={uploading || !files.length}
            >
              {uploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;