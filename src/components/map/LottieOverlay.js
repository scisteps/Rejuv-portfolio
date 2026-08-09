// src/components/map/LottieOverlay.jsx
import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import { Overlay } from 'googlemaps-react-primitives';

const LottieOverlay = ({ 
  position, 
  animationData, 
  onClick, 
  size = 50, 
  title = '',
  className = '',
  loop = true,
  autoplay = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef(null);

  if (!animationData) {
    console.warn('No animation data provided for LottieOverlay');
    return null;
  }

  return (
    <Overlay position={position}>
      <div
        className={`lottie-overlay-wrapper ${className}`}
        style={{
          transform: isHovered ? 'translate(-50%, -100%) scale(1.15)' : 'translate(-50%, -100%) scale(1)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          filter: 'drop-shadow(0 4px 12px rgba(66, 133, 244, 0.3))',
          width: size,
          height: size,
          position: 'relative'
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={title}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={loop}
          autoPlay={autoplay}
          style={{
            width: size,
            height: size,
            pointerEvents: 'none'
          }}
        />
        
        {/* Pulse ring effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size + 20,
          height: size + 20,
          borderRadius: '50%',
          background: 'rgba(66, 133, 244, 0.08)',
          border: '2px solid rgba(66, 133, 244, 0.15)',
          pointerEvents: 'none',
          animation: 'pulse-ring 2s ease-out infinite',
        }} />
      </div>
    </Overlay>
  );
};

export default LottieOverlay;