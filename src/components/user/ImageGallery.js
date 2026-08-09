// src/components/user/ImageGallery.jsx
import React, { useState, useEffect } from 'react';
import { getImages, deleteImage, incrementDownloadCount } from '../../services/imageService';
import './ImageGallery.css';

const ImageGallery = ({ locationId, userId, onImageClick }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadImages();
  }, [locationId, userId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (locationId) filters.locationId = locationId;
      if (userId) filters.uploadedBy = userId;
      
      const result = await getImages(filters);
      setImages(result);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId, storagePath) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteImage(imageId, storagePath);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  const handleImageClick = async (image) => {
    setSelectedImage(image);
    if (onImageClick) {
      onImageClick(image);
    }
  };

  const handleDownload = async (image) => {
    try {
      // Increment download count
      await incrementDownloadCount(image.id);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  if (loading) {
    return (
      <div className="image-gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading images...</p>
      </div>
    );
  }

  if (error) {
    return <div className="image-gallery-error">{error}</div>;
  }

  if (images.length === 0) {
    return (
      <div className="image-gallery-empty">
        <span className="empty-icon">🖼️</span>
        <p>No images yet</p>
        <small>Upload your first image!</small>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img 
              src={image.url} 
              alt={image.description || image.fileName}
              onClick={() => handleImageClick(image)}
              loading="lazy"
            />
            <div className="gallery-item-overlay">
              <div className="image-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleImageClick(image)}
                  title="View Details"
                >
                  👁️
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={() => handleDownload(image)}
                  title="Download"
                >
                  ⬇️
                </button>
                {userId && image.uploadedBy === userId && (
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteImage(image.id, image.storagePath)}
                    disabled={deleting}
                    title="Delete"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            {image.fileType && (
              <span className="image-badge">
                {image.fileType.split('/')[1].toUpperCase()}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="image-detail-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="detail-close-btn"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="detail-content">
              <img src={selectedImage.url} alt={selectedImage.description} />
              <div className="detail-info">
                <h3>{selectedImage.description || selectedImage.fileName}</h3>
                <div className="detail-metadata">
                  <p><strong>File:</strong> {selectedImage.fileName}</p>
                  <p><strong>Size:</strong> {(selectedImage.fileSize / 1024).toFixed(1)} KB</p>
                  {selectedImage.width && selectedImage.height && (
                    <p><strong>Dimensions:</strong> {selectedImage.width} x {selectedImage.height}</p>
                  )}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="detail-tags">
                      <strong>Tags:</strong>
                      {selectedImage.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <p><strong>Uploaded:</strong> {new Date(selectedImage.createdAt?.toDate?.() || selectedImage.createdAt).toLocaleDateString()}</p>
                  <p><strong>Downloads:</strong> {selectedImage.downloadCount || 0}</p>
                  <p><strong>Visibility:</strong> {selectedImage.isPublic ? '🌍 Public' : '🔒 Private'}</p>
                </div>
                <div className="detail-actions">
                  <button onClick={() => handleDownload(selectedImage)}>⬇️ Download</button>
                  {userId && selectedImage.uploadedBy === userId && (
                    <button 
                      className="delete-btn"
                      onClick={() => {
                        handleDeleteImage(selectedImage.id, selectedImage.storagePath);
                        setSelectedImage(null);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;