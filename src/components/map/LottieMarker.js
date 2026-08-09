// src/components/map/LottieMarker.jsx
import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { useMap } from 'googlemaps-react-primitives';
import { Overlay } from 'googlemaps-react-primitives';

// Import your Lottie animations
import locationPinAnimation from '../../animations/location-pin.json';
import userLocationAnimation from '../../animations/user-location.json';
import pulseAnimation from '../../animations/pulse.json';

const LottieMarker = ({ 
  position, 
  animationData, 
  onClick, 
  size = 60,
  loop = true,
  autoPlay = true,
  className = '',
  title = ''
}) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef(null);

  if (!map) return null;

  // Calculate pixel position on map
  const getPixelPosition = () => {
    if (!map) return { x: 0, y: 0 };
    
    const projection = map.getProjection();
    if (!projection) return { x: 0, y: 0 };
    
    const latLng = new window.google.maps.LatLng(position.lat, position.lng);
    const point = projection.fromLatLngToDivPixel(latLng);
    
    return {
      x: point.x - size / 2,
      y: point.y - size
    };
  };

  // Update position on map events
  useEffect(() => {
    if (!map) return;

    const updatePosition = () => {
      setIsVisible(true);
    };

    // Listen to map events
    const listeners = [
      map.addListener('bounds_changed', updatePosition),
      map.addListener('zoom_changed', updatePosition),
      map.addListener('center_changed', updatePosition)
    ];

    return () => {
      listeners.forEach(listener => window.google.maps.event.removeListener(listener));
    };
  }, [map]);

  // Get animation based on props or use default
  const getAnimation = () => {
    if (animationData) return animationData;
    return locationPinAnimation;
  };

  return (
    <div
      className={`lottie-marker-wrapper ${className}`}
      style={{
        position: 'absolute',
        left: getPixelPosition().x,
        top: getPixelPosition().y,
        width: size,
        height: size + 20,
        cursor: 'pointer',
        pointerEvents: 'auto',
        zIndex: 1000,
        transition: 'transform 0.2s ease',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)'
      }}
      onClick={() => onClick && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={getAnimation()}
        loop={loop}
        autoPlay={autoPlay}
        style={{
          width: size,
          height: size,
          pointerEvents: 'none'
        }}
      />
      
      {/* Pulse ring effect */}
      <div className="lottie-pulse-ring" style={{
        position: 'absolute',
        top: size / 2 - 20,
        left: size / 2 - 20,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(66, 133, 244, 0.1)',
        border: '2px solid rgba(66, 133, 244, 0.2)',
        pointerEvents: 'none',
        animation: 'pulse-ring 2s ease-out infinite',
        opacity: 0.5
      }} />
      
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ── Custom User Location Marker with Lottie ──
export const UserLocationLottieMarker = ({ position, onClick, isUsingFallback }) => {
  const map = useMap();
  const [positionStyle, setPositionStyle] = useState({ x: 0, y: 0 });

  if (!map) return null;

  // Use custom animation for user location
  const animation = isUsingFallback ? 
    require('../../animations/user-location-fallback.json') : 
    require('../../animations/user-location.json');

  return (
    <LottieMarker
      position={position}
      animationData={animation}
      onClick={onClick}
      size={50}
      title="You are here — tap to add details"
      className="user-location-marker"
    />
  );
};

// ── Camera Pin Marker with Lottie ──
export const CameraLottieMarker = ({ position, onClick, count }) => {
  const map = useMap();

  if (!map) return null;

  return (
    <LottieMarker
      position={position}
      animationData={require('../../animations/camera-pin.json')}
      onClick={onClick}
      size={40}
      title={`${count} photo${count > 1 ? 's' : ''}`}
      className="camera-marker"
    />
  );
};

export default LottieMarker;