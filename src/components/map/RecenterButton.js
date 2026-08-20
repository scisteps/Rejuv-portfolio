// src/components/map/RecenterButton.jsx
import React from 'react';
import './RecenterButton.css';

/**
 * Circular "locate me" button, positioned and styled like Google Maps'
 * own button (bottom-right, white circle, blue crosshair icon).
 *
 * - isLocating: shows a spinner while we're waiting on a GPS fix
 * - isActive:   tints the icon blue/filled to show "you're centered
 *               on your current location" (Google Maps does this too)
 */
export default function RecenterButton({ onClick, isLocating, isActive }) {
  return (
    <button
      type="button"
      className={`recenter-btn-gmaps ${isActive ? 'is-active' : ''}`}
      onClick={onClick}
      disabled={isLocating}
      aria-label="Center map on your location"
      title="Your location"
    >
      {isLocating ? (
        <span className="recenter-spinner" />
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle
            cx="12"
            cy="12"
            r="3.2"
            className="recenter-dot"
          />
          <path
            d="M12 2v3.5M12 18.5V22M22 12h-3.5M5.5 12H2"
            strokeWidth="2"
            strokeLinecap="round"
            className="recenter-ticks"
          />
        </svg>
      )}
    </button>
  );
}
