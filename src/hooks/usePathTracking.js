// src/hooks/usePathTracking.js
import { useCallback, useEffect, useRef, useState } from 'react';

const EARTH_RADIUS_M = 6371e3;

export function haversineDistance(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ─── Filtering ───────────────────────────────────────────────────────────
// Consumer GPS receivers wander by several metres while you stand still.
// Feeding every raw fix into the distance total made "0.00 km" tick up into
// hundreds of metres on a stationary phone.
const MIN_STEP_METERS = 3; // below this it is jitter, not movement
const MAX_STEP_METERS = 200; // above this it is a bad fix, not a sprint
const MAX_USABLE_ACCURACY_METERS = 65; // ignore fixes that are simply bad

// Hard cap so a long walk can't grow the array (and every re-render that
// maps over it) without bound.
const MAX_POINTS = 5000;

const EMPTY_STATS = {
  distanceMeters: 0,
  durationSeconds: 0,
  speedMps: 0,
  points: 0,
};

/**
 * Records the user's walking path.
 *
 * Fixes are filtered before they are counted: jitter and teleports are
 * dropped, bad-accuracy fixes are ignored, and the running totals live in
 * refs so each accepted point produces exactly one state update.
 *
 *   pathStats === {
 *     distanceMeters,  // total metres walked
 *     durationSeconds, // wall-clock seconds since startTracking()
 *     speedMps,        // smoothed speed in metres/second
 *     points,          // number of accepted points
 *   }
 */
export function usePathTracking() {
  const [path, setPath] = useState([]);
  const [pathStats, setPathStats] = useState(EMPTY_STATS);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);

  const watchIdRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pointsRef = useRef([]);
  const distanceRef = useRef(0);
  const speedRef = useRef(0);
  const aliveRef = useRef(true);

  const clearNativeWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    }
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // One publish point for path + stats, so the two can never disagree and
  // we never call setState from inside another setState updater.
  const publish = useCallback(() => {
    setPath(pointsRef.current.slice());
    setPathStats({
      distanceMeters: distanceRef.current,
      durationSeconds: startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0,
      speedMps: speedRef.current,
      points: pointsRef.current.length,
    });
  }, []);

  const handleFix = useCallback(
    (position) => {
      if (!aliveRef.current) return;

      const { latitude, longitude, accuracy } = position.coords || {};
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

      const point = {
        lat: latitude,
        lng: longitude,
        accuracy: Number.isFinite(accuracy) ? accuracy : null,
        timestamp: position.timestamp || Date.now(),
      };

      // The marker follows every fix, even ones we refuse to count, so the
      // blue dot never looks frozen while a poor signal is rejected.
      setCurrentPoint(point);

      if (
        point.accuracy != null &&
        point.accuracy > MAX_USABLE_ACCURACY_METERS
      ) {
        setError('Weak GPS signal — holding still to get a better fix.');
        return;
      }

      const points = pointsRef.current;

      if (points.length > 0) {
        const previous = points[points.length - 1];
        const step = haversineDistance(previous, point);

        if (step < MIN_STEP_METERS) return; // jitter
        if (step > MAX_STEP_METERS) return; // teleport / glitched fix

        const seconds = (point.timestamp - previous.timestamp) / 1000;
        if (seconds > 0) {
          const instant = step / seconds;
          // Exponential smoothing: raw GPS speed is far too jumpy to show.
          speedRef.current = speedRef.current
            ? speedRef.current * 0.7 + instant * 0.3
            : instant;
        }

        distanceRef.current += step;
      }

      points.push(point);

      // Bounded memory: drop the oldest samples, keep the most recent ones.
      if (points.length > MAX_POINTS) {
        points.splice(0, points.length - MAX_POINTS);
      }

      publish();
    },
    [publish]
  );

  const stopTracking = useCallback(() => {
    // Always tear the old watch/timer down first: pressing Start twice used
    // to leave a second watchPosition and a second interval running forever.
    clearNativeWatch();
    setIsTracking(false);
    if (aliveRef.current) publish(); // freeze the duration counter
  }, [clearNativeWatch, publish]);

  const startTracking = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('This browser cannot record a path — location is unavailable.');
      return false;
    }

    stopTracking();

    pointsRef.current = [];
    distanceRef.current = 0;
    speedRef.current = 0;
    startTimeRef.current = Date.now();
    setError(null);
    setIsTracking(true);
    publish();

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleFix,
      (err) => {
        if (!aliveRef.current) return;
        if (err?.code === 1) {
          setError(
            'Location access is blocked — recording is paused. Allow location for this site and press Start again.'
          );
          stopTracking();
        } else {
          setError('Lost GPS signal — waiting for it to come back.');
        }
      },
      {
        enableHighAccuracy: true,
        // A 2s cache window keeps the dot moving smoothly without the fix
        // rate dropping to one sample every few seconds indoors.
        maximumAge: 2000,
        timeout: 20000,
      }
    );

    // Keeps the elapsed-time readout live while standing still.
    timerRef.current = setInterval(publish, 1000);

    return true;
  }, [handleFix, publish, stopTracking]);

  const clearPath = useCallback(() => {
    stopTracking();
    pointsRef.current = [];
    distanceRef.current = 0;
    speedRef.current = 0;
    startTimeRef.current = null;
    setCurrentPoint(null);
    setError(null);
    publish();
  }, [publish, stopTracking]);

  // Without this the watch and interval survived navigation entirely —
  // the GPS radio stayed on and setState fired on an unmounted component.
  useEffect(() => {
    aliveRef.current = true;

    return () => {
      aliveRef.current = false;
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return {
    isTracking,
    path,
    pathStats,
    currentPoint,
    error,
    startTracking,
    stopTracking,
    clearPath,
  };
}