// src/hooks/useDirections.js
import { useState, useEffect, useRef } from 'react';

/**
 * Fetches a route from `origin` to `destination` ({lat, lng} each)
 * using the Google Maps DirectionsService, and returns the polyline
 * path plus human-readable distance/duration.
 *
 *   const { route, loading, error } = useDirections(userLocation, selectedLocation);
 *   route === {
 *     path: [{lat, lng}, ...],
 *     distanceText: '2.3 km',
 *     durationText: '28 mins',
 *     distanceMeters: 2312,
 *     durationSeconds: 1680,
 *   }
 *
 * Pass travelMode as 'WALKING' (default), 'DRIVING', 'BICYCLING', or
 * 'TRANSIT'. Stale responses (a newer request already went out before
 * an older one resolves) are ignored.
 */
export function useDirections(origin, destination, travelMode = 'WALKING') {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!window.google?.maps?.DirectionsService) return;

    if (!origin || !destination) {
      setRoute(null);
      setError(null);
      return;
    }

    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode:
          window.google.maps.TravelMode[travelMode] ||
          window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        // A newer request has already been kicked off — ignore this
        // stale response so a slow first call can't clobber a later one.
        if (thisRequestId !== requestIdRef.current) return;

        if (status === 'OK' && result?.routes?.[0]) {
          const routeResult = result.routes[0];
          const leg = routeResult.legs?.[0];
          const path = (routeResult.overview_path || []).map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }));

          setRoute({
            path,
            distanceText: leg?.distance?.text ?? null,
            durationText: leg?.duration?.text ?? null,
            distanceMeters: leg?.distance?.value ?? null,
            durationSeconds: leg?.duration?.value ?? null,
          });
        } else {
          setRoute(null);
          setError(status);
        }
        setLoading(false);
      }
    );
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng, travelMode]);

  return { route, loading, error };
}
