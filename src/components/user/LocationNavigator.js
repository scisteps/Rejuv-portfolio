// src/components/map/LocationNavigator.jsx
import React from 'react';
import './LocationNavigator.css';

/**
 * A row of three buttons rendered below the map:
 *   [ ◀ Prev ]   [ 🎯 My Location ]   [ Next ▶ ]
 *
 * Prev/Next loop through `locations` in order, firing onSelectIndex
 * with the new index — the parent is expected to fly the map to that
 * location and open its info window. The middle button re-centers on
 * the user's own GPS position via onCenterUser.
 */
export default function LocationNavigator({
  locations,
  currentIndex,
  onSelectIndex,
  onCenterUser,
  isCenteringUser,
  routeInfo,
  routeLoading,
}) {
  const hasLocations = locations && locations.length > 0;

  const goPrev = () => {
    if (!hasLocations) return;
    const next = currentIndex <= 0 ? locations.length - 1 : currentIndex - 1;
    onSelectIndex(next);
  };

  const goNext = () => {
    if (!hasLocations) return;
    const next = currentIndex >= locations.length - 1 ? 0 : currentIndex + 1;
    onSelectIndex(next);
  };

  const activeLocation =
    hasLocations && currentIndex >= 0 ? locations[currentIndex] : null;

  return (
    <div className="location-navigator">
      <div className="location-navigator-row">
        <button
          type="button"
          className="nav-btn nav-btn-side"
          onClick={goPrev}
          disabled={!hasLocations}
          aria-label="Previous location"
          title="Previous location"
        >
          ◀ Prev
        </button>

        <button
          type="button"
          className={`nav-btn nav-btn-center ${isCenteringUser ? 'is-loading' : ''}`}
          onClick={onCenterUser}
          disabled={isCenteringUser}
          aria-label="Center on my location"
          title="Center on my location"
        >
          {isCenteringUser ? '⏳ Locating…' : '🎯 My Location'}
        </button>

        <button
          type="button"
          className="nav-btn nav-btn-side"
          onClick={goNext}
          disabled={!hasLocations}
          aria-label="Next location"
          title="Next location"
        >
          Next ▶
        </button>
      </div>

      {activeLocation && (
        <div className="nav-current-label">
          📍 {activeLocation.name}
          {hasLocations && (
            <span className="nav-current-count">
              {' '}
              ({currentIndex + 1}/{locations.length})
            </span>
          )}
          {routeLoading && <span className="nav-route-info"> · finding route…</span>}
          {!routeLoading && routeInfo?.distanceText && (
            <span className="nav-route-info">
              {' '}
              · 🚶 {routeInfo.distanceText} ({routeInfo.durationText})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
