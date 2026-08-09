// src/components/user/LocationDetails.jsx
import React, { useState, useEffect } from 'react';
import ImageGallery from './ImageGallery';
import ImageUploadModal from './ImageUploadModal';
import { auth } from '../../Firebase';
import { getCategories, rateLocation, toggleLikeLocation } from '../../services/Firestoreservice';
import './LocationDetails.css';

const LocationDetails = ({ location, onUpdate }) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user && location) {
        // Check if user liked this location
        const likedBy = location.likedBy || [];
        setIsLiked(likedBy.includes(user.uid));
      }
    });
    return () => unsubscribe();
  }, [location]);

  useEffect(() => {
    if (location?.category) {
      loadCategory();
    }
  }, [location]);

  const loadCategory = async () => {
    try {
      const categories = await getCategories();
      const cat = categories.find(c => c.id === location.category);
      setCategoryData(cat);
    } catch (err) {
      console.error('Error loading category:', err);
    }
  };

  const handleRating = async (rating) => {
    if (!currentUser) {
      alert('Please login to rate this location');
      return;
    }
    
    try {
      setLoading(true);
      await rateLocation(location.id, rating);
      setUserRating(rating);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error rating:', err);
      alert('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please login to like this location');
      return;
    }
    
    try {
      setLoading(true);
      const liked = await toggleLikeLocation(location.id, currentUser.uid);
      setIsLiked(liked);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  if (!location) return null;

  return (
    <div className="location-details">
      <div className="location-header">
        <h3>{location.name}</h3>
        <div className="location-category-badge">
          <span className="category-icon">
            {categoryData?.icon || location.categoryIcon || '📍'}
          </span>
          <span className="category-name">
            {categoryData?.name || location.category || 'Uncategorized'}
          </span>
          {location.subcategory && (
            <span className="subcategory-badge">
              → {location.subcategory}
            </span>
          )}
        </div>
      </div>

      {location.mainImage && (
        <div className="location-main-image">
          <img src={location.mainImage} alt={location.name} />
        </div>
      )}

      <div className="location-description">
        <p>{location.description || 'No description provided'}</p>
      </div>

      <div className="location-meta-grid">
        {location.address && (
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span className="meta-text">{location.address}</span>
          </div>
        )}
        {location.phone && (
          <div className="meta-item">
            <span className="meta-icon">📞</span>
            <a href={`tel:${location.phone}`} className="meta-text">{location.phone}</a>
          </div>
        )}
        {location.website && (
          <div className="meta-item">
            <span className="meta-icon">🌐</span>
            <a href={location.website} target="_blank" rel="noopener noreferrer" className="meta-text">
              {location.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {location.hours && (
          <div className="meta-item">
            <span className="meta-icon">🕐</span>
            <span className="meta-text">{location.hours}</span>
          </div>
        )}
        <div className="meta-item">
          <span className="meta-icon">📌</span>
          <span className="meta-text">
            {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
          </span>
        </div>
      </div>

      {location.tags && location.tags.length > 0 && (
        <div className="location-tags">
          {location.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="location-actions">
        <div className="rating-section">
          <span className="rating-label">Rating:</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star ${star <= (hoverRating || userRating || location.rating || 0) ? 'active' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(star)}
                disabled={loading}
              >
                ★
              </button>
            ))}
          </div>
          <span className="rating-count">
            ({location.ratingCount || 0} reviews)
          </span>
        </div>

        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          {isLiked ? '❤️' : '🤍'} {location.likes || 0}
        </button>
      </div>

      {/* Images Section */}
      <div className="location-images-section">
        <div className="section-header">
          <h4>📸 Images</h4>
          {currentUser && (
            <button 
              className="upload-image-btn"
              onClick={() => setShowImageUpload(true)}
              disabled={loading}
            >
              + Add Image
            </button>
          )}
        </div>
        <ImageGallery locationId={location.id} userId={currentUser?.uid} />
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          userId={currentUser?.uid}
          locationId={location.id}
          categoryId={location.category}
          onUploadComplete={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}
    </div>
  );
};

export default LocationDetails;