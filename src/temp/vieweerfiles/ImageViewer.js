// src/components/user/ImageViewer.jsx
import React, { useState } from 'react';
import './ImageViewer.css';

export default function ImageViewer({ images, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const active = images[activeIndex];

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-UG', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <div>
            <h3>📸 Pinned Photo{images.length > 1 ? `s (${images.length})` : ''}</h3>
            <p className="viewer-coords">
              {active.lat?.toFixed(5)}, {active.lng?.toFixed(5)}
            </p>
          </div>
          <button className="viewer-close" onClick={onClose}>✕</button>
        </div>

        {/* Main image */}
        <div className="viewer-image-container">
          <img
            src={active.imageUrl}
            alt="Pinned location"
            className="viewer-image"
          />
        </div>

        {/* Image meta */}
        <div className="viewer-meta">
          <span>🕐 {formatDate(active.createdAt)}</span>
          {active.fileSize && <span>💾 {formatSize(active.fileSize)}</span>}
        </div>

        {/* Thumbnail strip if multiple images at same location */}
        {images.length > 1 && (
          <div className="viewer-thumbs">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`thumb ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                <img src={img.imageUrl} alt={`Photo ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
