// src/components/ImageUpload/ImageUpload.jsx
import React, { useState } from 'react';
import { uploadImage, uploadMultipleImages } from '../../services/imageService';
import { useAuth } from '../../hooks/useAuth'; // Your auth hook

const ImageUpload = ({ locationId, categoryId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError('Please select at least one image');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to upload images');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Upload multiple images
      const results = await uploadMultipleImages(files, {
        uploadedBy: currentUser.uid,
        locationId: locationId,
        categoryId: categoryId,
        isPublic: true
      });

      setProgress(100);
      setFiles([]);
      
      if (onUploadComplete) {
        onUploadComplete(results);
      }
      
      // Reset file input
      document.getElementById('file-input').value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="upload-area">
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className="file-info">
          {files.length > 0 && (
            <p>{files.length} file(s) selected</p>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {uploading && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
          <span>{progress}%</span>
        </div>
      )}

      <button 
        onClick={handleUpload} 
        disabled={uploading || !files.length}
      >
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>
    </div>
  );
};

export default ImageUpload;