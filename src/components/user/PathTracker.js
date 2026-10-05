// src/components/user/PathTracker.jsx
import React, { useMemo } from 'react';
import './PathTracker.css';

// The tracker used to read `pathStats.speed` / `pathStats.distance` from an
// object that never had those fields, so opening this panel threw a TypeError
// and blanked the screen. Everything below is null-safe and unit-explicit.

function formatDistance(meters) {
  if (!Number.isFinite(meters) || meters <= 0) return '0 m';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatDuration(seconds) {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const mins = Math.floor(total / 60);
  return `${mins}:${String(total % 60).padStart(2, '0')}`;
}

function formatSpeed(mps) {
  if (!Number.isFinite(mps) || mps < 0.14) return '—'; // ~0.5 km/h: treat as stopped
  return `${(mps * 3.6).toFixed(1)} km/h`;
}

/**
 * Projects the path onto a 0-100% box for the mini preview. The old version
 * hard-coded San Francisco bounds, so a path recorded in Kampala rendered as
 * a handful of dots parked far off-canvas.
 */
function projectPath(path) {
  if (!path || path.length === 0) return [];

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const point of path) {
    if (point.lat < minLat) minLat = point.lat;
    if (point.lat > maxLat) maxLat = point.lat;
    if (point.lng < minLng) minLng = point.lng;
    if (point.lng > maxLng) maxLng = point.lng;
  }

  // Pad a degenerate (standing still) path so dots land mid-box instead of
  // dividing by a zero span.
  const MIN_SPAN = 0.0004; // roughly 45 m
  if (maxLat - minLat < MIN_SPAN) {
    const mid = (minLat + maxLat) / 2;
    minLat = mid - MIN_SPAN / 2;
    maxLat = mid + MIN_SPAN / 2;
  }
  if (maxLng - minLng < MIN_SPAN) {
    const mid = (minLng + maxLng) / 2;
    minLng = mid - MIN_SPAN / 2;
    maxLng = mid + MIN_SPAN / 2;
  }

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const clamp = (value) => Math.min(100, Math.max(0, value));

  return path.map((point) => ({
    left: clamp(((point.lng - minLng) / lngSpan) * 100),
    top: clamp(((maxLat - point.lat) / latSpan) * 100),
  }));
}

const PathTracker = ({
  isTracking,
  path = [],
  pathStats,
  error,
  onStartTracking,
  onStopTracking,
  onClearPath,
}) => {
  // pathStats can legitimately be null before the first fix, so every read
  // is guarded and the units are explicit (metres / seconds / m-per-s).
  const stats = pathStats || {};
  const distanceMeters = Number.isFinite(stats.distanceMeters)
    ? stats.distanceMeters
    : 0;
  const durationSeconds = Number.isFinite(stats.durationSeconds)
    ? stats.durationSeconds
    : 0;
  const speedMps = Number.isFinite(stats.speedMps) ? stats.speedMps : 0;
  const pointCount = path.length;

  const projected = useMemo(() => projectPath(path), [path]);
  // Show the whole path when it fits, otherwise the most recent stretch —
  // the first 30 samples were all anyone ever saw before.
  const visible = useMemo(
    () => projected.slice(-60),
    [projected]
  );

  return (
    <div className="path-tracker">
      <h3>
        🚶 Path Tracker{' '}
        <span className="tracker-state">
          {isTracking ? '● Recording' : pointCount > 0 ? '⏸ Paused' : '—'}
        </span>
      </h3>

      <div className="tracker-stats">
        <div className="stat-item">
          <span className="stat-label">Distance</span>
          <span className="stat-value">{formatDistance(distanceMeters)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{formatDuration(durationSeconds)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{formatSpeed(speedMps)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Points</span>
          <span className="stat-value">{pointCount}</span>
        </div>
      </div>

      {error && <div className="tracker-error">⚠️ {error}</div>}

      <div className="tracker-actions">
        {!isTracking ? (
          <button className="btn-start" onClick={onStartTracking}>
            ▶️ Start Tracking
          </button>
        ) : (
          <button className="btn-stop" onClick={onStopTracking}>
            ⏹️ Stop Tracking
          </button>
        )}
        <button
          className="btn-clear"
          onClick={onClearPath}
          disabled={pointCount === 0}
        >
          🗑️ Clear
        </button>
      </div>

      {pointCount > 0 && (
        <div className="tracker-path-preview">
          <div className="path-mini-map">
            <div className="mini-map-dots">
              {visible.map((point, index) => (
                <div
                  key={`${index}-${point.left.toFixed(2)}-${point.top.toFixed(2)}`}
                  className={
                    index === 0 ? 'mini-dot mini-dot-start' : 'mini-dot'
                  }
                  style={{
                    left: `${point.left}%`,
                    top: `${point.top}%`,
                    opacity: 0.35 + (index / Math.max(visible.length - 1, 1)) * 0.65,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="tracker-preview-hint">
            {projected.length > visible.length
              ? `Showing the last ${visible.length} of ${projected.length} points`
              : 'Your recorded path'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PathTracker;