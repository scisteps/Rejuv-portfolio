// src/components/user/ImageUploadPanel.jsx
import React, { useRef, useState } from 'react';
import './ImageUploadPanel.css';

const MAX_MB = 5;

export default function ImageUploadPanel({
  lat,
  lng,
  onUpload,   // (file, lat, lng) => Promise
  onClose,
  uploading,
  uploadProgress,
  error,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLocalError(null);

    if (file.size > MAX_MB * 1024 * 1024) {
      setLocalError(`File too large — max ${MAX_MB}MB. This file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const result = await onUpload(selectedFile, lat, lng);
    if (result) {
      // Success — close the panel
      onClose();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = { target: { files: [file] } };
      handleFileChange(syntheticEvent);
    }
  };

  return (
    <div className="upload-panel-overlay" onClick={onClose}>
      <div
        className="upload-panel"
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="upload-panel-header">
          <div>
            <h3>📸 Add Photo Here</h3>
            <p className="coords-label">
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Drop zone / preview */}
        <div
          className={`drop-zone ${preview ? 'has-preview' : ''}`}
          onClick={() => !preview && inputRef.current.click()}
        >
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <button
                className="change-photo-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setSelectedFile(null);
                  inputRef.current.click();
                }}
              >
                Change photo
              </button>
            </div>
          ) : (
            <div className="drop-zone-placeholder">
              <span className="drop-icon">🖼️</span>
              <p>Tap to choose a photo</p>
              <p className="drop-hint">or drag and drop · max {MAX_MB}MB</p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Error */}
        {(error || localError) && (
          <div className="upload-error">⚠️ {error || localError}</div>
        )}

        {/* Progress bar */}
        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="progress-label">{uploadProgress}% uploading...</span>
          </div>
        )}

        {/* Actions */}
        <div className="upload-actions">
          <button className="btn-cancel" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button
            className="btn-upload"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? '⏳ Uploading...' : '📍 Pin This Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
