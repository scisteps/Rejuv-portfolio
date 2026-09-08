// src/hooks/useElevation.js
import { useState, useEffect, useRef } from 'react';

/**
 * Fetches elevation (in meters) for the user's current position and a
 * list of locations, using the Google Maps Elevation Service, then
 * returns each location's elevation *relative to the user*.
 *
 *   const { userElevation, elevationById } = useElevation(userLocation, locations);
 *   elevationById['loc123'] === { elevation: 1187, diffFromUser: 42 }
 *
 * diffFromUser > 0  -> that location sits above the user
 * diffFromUser < 0  -> that location sits below the user
 *
 * Requests are cached by rounded lat/lng so panning/re-rendering never
 * re-queries a coordinate we've already resolved, and results are
 * batched (the Elevation API accepts many points per call) instead of
 * firing one request per marker.
 */
export function useElevation(userLocation, locations) {
  const [userElevation, setUserElevation] = useState(null);
  const [elevationById, setElevationById] = useState({});
  const cacheRef = useRef(new Map()); // "lat,lng" -> elevation meters
  const locationsRef = useRef(locations);
  locationsRef.current = locations;

  const keyFor = (lat, lng) => `${lat.toFixed(5)},${lng.toFixed(5)}`;

  // Stable signature so the effect only re-runs when the *set* of
  // coordinates actually changes, not on every parent re-render.
  const signature = [
    userLocation ? keyFor(userLocation.lat, userLocation.lng) : 'none',
    ...(locations || []).map((l) => `${l.id}:${keyFor(l.lat, l.lng)}`),
  ].join('|');

  useEffect(() => {
    if (!window.google?.maps?.ElevationService) return;
    if (!userLocation) return;

    const currentLocations = locationsRef.current || [];
    const service = new window.google.maps.ElevationService();
    const userKey = keyFor(userLocation.lat, userLocation.lng);

    const pointsToFetch = [];
    const pointMeta = []; // 'user' or a location id, parallel to pointsToFetch

    if (!cacheRef.current.has(userKey)) {
      pointsToFetch.push({ lat: userLocation.lat, lng: userLocation.lng });
      pointMeta.push('user');
    }

    currentLocations.forEach((loc) => {
      const key = keyFor(loc.lat, loc.lng);
      if (!cacheRef.current.has(key)) {
        pointsToFetch.push({ lat: loc.lat, lng: loc.lng });
        pointMeta.push(loc.id);
      }
    });

    let cancelled = false;

    const recomputeDiffs = () => {
      const uElev = cacheRef.current.get(userKey);
      if (!cancelled) setUserElevation(uElev ?? null);

      const next = {};
      currentLocations.forEach((loc) => {
        const elev = cacheRef.current.get(keyFor(loc.lat, loc.lng));
        if (elev != null && uElev != null) {
          next[loc.id] = { elevation: elev, diffFromUser: elev - uElev };
        }
      });
      if (!cancelled) setElevationById(next);
    };

    if (pointsToFetch.length === 0) {
      recomputeDiffs();
      return () => {
        cancelled = true;
      };
    }

    // The Elevation API caps requests at 512 locations — batch just in
    // case there's a large pin list.
    const BATCH_SIZE = 500;
    const batches = [];
    for (let i = 0; i < pointsToFetch.length; i += BATCH_SIZE) {
      batches.push(pointsToFetch.slice(i, i + BATCH_SIZE));
    }

    (async () => {
      for (const batch of batches) {
        await new Promise((resolve) => {
          service.getElevationForLocations({ locations: batch }, (results, status) => {
            if (status === 'OK' && results) {
              results.forEach((result, i) => {
                const pt = batch[i];
                cacheRef.current.set(keyFor(pt.lat, pt.lng), result.elevation);
              });
            }
            resolve();
          });
        });
        if (cancelled) return;
      }
      recomputeDiffs();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return { userElevation, elevationById };
}
