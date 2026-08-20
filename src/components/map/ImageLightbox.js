// src/components/map/ImageLightbox.jsx
import React, { useEffect } from 'react';
import './ImageLightbox.css';

/**
 * Fullscreen zoomed-in view of a location image.
 * Render this once near the bottom of your page/dashboard component
 * (outside the map), and control it with a piece of state like:
 *   const [lightboxImage, setLightboxImage] = useState(null);
 */
export default function ImageLightbox({ image, title, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="image-lightbox-overlay" onClick={onClose}>
      <button className="image-lightbox-close" onClick={onClose}>✕</button>
      <img
        src={image}
        alt={title || 'Location'}
        className="image-lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
      {title && <div className="image-lightbox-caption">{title}</div>}
    </div>
  );
}