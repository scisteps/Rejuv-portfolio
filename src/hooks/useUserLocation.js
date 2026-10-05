// src/hooks/useUserLocation.js
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Where the map starts before we know anything about the user (Makerere
 * University, Kampala).
 *
 * This is deliberately NOT used as a stand-in for a real fix. Resolving it
 * on failure used to make the app confidently fly the map to Kampala — and
 * report that as "your location" — whenever GPS was denied or unavailable.
 */
export const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };

// ─── Error codes ─────────────────────────────────────────────────────────
// PERMISSION_DENIED / POSITION_UNAVAILABLE / TIMEOUT are defined on the
// GeolocationPositionError *interface object*, not on the error instance,
// so comparing `error.PERMISSION_DENIED` never matches and every failure
// rendered as a raw browser string. Compare the spec numbers instead.
const CODE_UNSUPPORTED = 0;
const CODE_PERMISSION_DENIED = 1;
const CODE_POSITION_UNAVAILABLE = 2;
const CODE_TIMEOUT = 3;

const ERROR_MESSAGES = {
  [CODE_UNSUPPORTED]:
    'This browser cannot read your location. Try Chrome, Edge or Safari.',
  [CODE_PERMISSION_DENIED]:
    'Location access is blocked. Allow location for this site in your browser settings, then press Retry.',
  [CODE_POSITION_UNAVAILABLE]:
    'No GPS fix available yet. Move somewhere with a clearer view of the sky and press Retry.',
  [CODE_TIMEOUT]:
    'Timed out waiting for a GPS fix. Move to an open area and press Retry.',
};

const UNKNOWN_ERROR_MESSAGE =
  "We couldn't work out where you are. Press Retry to try again.";

// ─── Tuning ───────────────────────────────────────────────────────────────
// Anything worse than this counts as "approximate" for the UI.
const POOR_ACCURACY_METERS = 100;

// Pass 1: cheap network/wifi fix, normally sub-second. Gets the map moving
// immediately instead of staring at a spinner while GPS acquires.
const FAST_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 60000,
};

// Pass 2: real GPS. Used when the fast fix was too coarse, or on demand.
const PRECISE_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const WATCH_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 2000,
};

const MAX_ATTEMPTS = 2; // fast fix + one GPS retry
const RETRY_DELAY_MS = 800;

export function geolocationSupported() {
  return typeof navigator !== 'undefined' && !!navigator.geolocation;
}

function describeError(error) {
  if (!error) return UNKNOWN_ERROR_MESSAGE;
  if (ERROR_MESSAGES[error.code]) return ERROR_MESSAGES[error.code];
  return error.message || UNKNOWN_ERROR_MESSAGE;
}

function toLocation(position) {
  const coords = position.coords || {};
  const num = (value) => (Number.isFinite(value) ? value : null);

  return {
    lat: coords.latitude,
    lng: coords.longitude,
    accuracy: num(coords.accuracy),
    altitude: num(coords.altitude),
    speed: num(coords.speed),
    heading: num(coords.heading),
    timestamp: position.timestamp || Date.now(),
  };
}

export function getAccuracyStatus(accuracy) {
  if (!Number.isFinite(accuracy)) {
    return { label: 'Unknown', color: '#999', icon: '📡' };
  }
  if (accuracy < 20) return { label: 'Excellent', color: '#2e7d32', icon: '📍' };
  if (accuracy < 50) return { label: 'Good', color: '#4caf50', icon: '📍' };
  if (accuracy < POOR_ACCURACY_METERS) {
    return { label: 'Fair', color: '#ff9800', icon: '📍' };
  }
  if (accuracy < 500) return { label: 'Poor', color: '#f44336', icon: '⚠️' };
  if (accuracy < 1000) return { label: 'Very Poor', color: '#d32f2f', icon: '⚠️' };
  return { label: 'No GPS', color: '#999', icon: '❌' };
}

// __PART_2__
export function useUserLocation({ autoStart = true } = {}) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Everything mutable lives in a ref; state is only ever a mirror of it.
  // That is what keeps the returned callbacks referentially stable — an
  // unstable `getUserLocation` used to re-trigger the dashboard's
  // "fly to me on mount" effect on every single render, which turned into
  // an endless loop of GPS requests (re-prompting + battery drain).
  const aliveRef = useRef(true);
  const locationRef = useRef(null);
  const pendingRef = useRef(null); // in-flight getUserLocation promise
  const refiningRef = useRef(false); // background high-accuracy upgrade
  const retryTimerRef = useRef(null);
  const watchIdRef = useRef(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // Cancellable sleep between GPS attempts — cleared on unmount so we never
  // resume and setState on a dead component.
  const wait = useCallback(
    (ms) =>
      new Promise((resolve) => {
        retryTimerRef.current = setTimeout(() => {
          retryTimerRef.current = null;
          resolve();
        }, ms);
      }),
    []
  );

  const storeLocation = useCallback((location) => {
    locationRef.current = location;
    setUserLocation(location);
    setAccuracy(location.accuracy);
    setIsUsingFallback(
      location.accuracy == null || location.accuracy > POOR_ACCURACY_METERS
    );
    setError(null);
    return location;
  }, []);

  // Single funnel for every browser geolocation call, so options and error
  // shapes stay consistent across the hook.
  const requestPosition = useCallback((options) => {
    return new Promise((resolve, reject) => {
      if (!geolocationSupported()) {
        const unsupported = new Error(ERROR_MESSAGES[CODE_UNSUPPORTED]);
        unsupported.code = CODE_UNSUPPORTED;
        reject(unsupported);
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }, []);

  // Runs once a coarse fix is already on screen: quietly sharpens the pin if
  // the GPS radio can do better. Never blocks the UI, never surfaces errors.
  const refineInBackground = useCallback(
    (overrides) => {
      if (refiningRef.current || !aliveRef.current) return;
      refiningRef.current = true;

      requestPosition({ ...PRECISE_OPTIONS, ...overrides })
        .then((position) => {
          const candidate = toLocation(position);
          const current = locationRef.current;
          const isBetter =
            candidate.accuracy != null &&
            (current?.accuracy == null ||
              candidate.accuracy < current.accuracy);
          if (isBetter) storeLocation(candidate);
        })
        .catch(() => {
          // Not a user-facing error: we already have a usable (if coarse)
          // position on the map.
        })
        .finally(() => {
          refiningRef.current = false;
        });
    },
    [requestPosition, storeLocation]
  );

/**
   * Ask the browser where the user is.
   *
   * Always resolves — with a location object, or `null` when no fix could be
   * obtained. Callers MUST treat `null` as "unknown"; flying the map to a
   * guessed coordinate is what made a denied permission look like a fix.
   *
   * Options:
   *   precise     skip the fast pass and go straight for a GPS fix
   *   timeout     override the per-attempt timeout (ms)
   *   maximumAge  override the cache window (ms)
   */
  const getUserLocation = useCallback(
    ({ precise = false, ...overrides } = {}) => {
      // De-duplicate: concurrent callers share a single browser request
      // instead of each firing their own (and each possibly re-prompting).
      if (pendingRef.current) return pendingRef.current;

      clearRetryTimer();

      const run = async () => {
        setLoading(true);
        setError(null);

        let location = null;
        let lastError = null;

        for (let attempt = 0; attempt < MAX_ATTEMPTS && !location; attempt += 1) {
          if (!aliveRef.current) break;

          const useGps = precise || attempt > 0;
          const options = useGps
            ? { ...PRECISE_OPTIONS, ...overrides }
            : { ...FAST_OPTIONS, ...overrides };

          try {
            location = storeLocation(
              toLocation(await requestPosition(options))
            );
          } catch (err) {
            lastError = err;

            // A denied permission never resolves itself, and re-asking only
            // re-triggers the browser prompt — stop immediately.
            if (err?.code === CODE_PERMISSION_DENIED) break;

            if (attempt < MAX_ATTEMPTS - 1) {
              await wait(RETRY_DELAY_MS);
            }
          }
        }

        if (!aliveRef.current) return null;

        setLoading(false);

        if (!location) {
          setError(describeError(lastError));
          return null;
        }

        // A coarse fix is already on screen: keep a GPS request running in
        // the background so the pin sharpens without the user waiting on it.
        if (
          !precise &&
          location.accuracy != null &&
          location.accuracy > POOR_ACCURACY_METERS
        ) {
          refineInBackground({});
        }

        return location;
      };

      const promise = run();
      pendingRef.current = promise;
      // `run` never rejects, but keep this chain defensive so an unexpected
      // throw can never leave `pendingRef` latched and wedge the feature.
      promise.then(() => {
        if (pendingRef.current === promise) pendingRef.current = null;
      });

      return promise;
    },
    [clearRetryTimer, requestPosition, storeLocation, wait, refineInBackground]
  );

  /** Force a fresh high-accuracy fix, ignoring any cached position. */
  const refreshGPS = useCallback(
    () => getUserLocation({ precise: true, maximumAge: 0 }),
    [getUserLocation]
  );

  const clearWatch = useCallback(() => {
    // `watchId` is a ref, not state: the old implementation cleared the id
    // captured from a stale render, so a second startTracking() orphaned the
    // first watchPosition and left the GPS radio running forever.
    if (watchIdRef.current !== null) {
      if (geolocationSupported()) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    }
  }, []);

  /** Continuously track the user. Always stops any previous watch first. */
  const startWatching = useCallback(
    (onLocationUpdate) => {
      if (!geolocationSupported()) {
        setError(ERROR_MESSAGES[CODE_UNSUPPORTED]);
        return null;
      }

      clearWatch();

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (!aliveRef.current) return;
          const location = storeLocation(toLocation(position));
          if (typeof onLocationUpdate === 'function') {
            onLocationUpdate(location);
          }
        },
        (err) => {
          if (!aliveRef.current) return;
          if (err?.code === CODE_PERMISSION_DENIED) {
            clearWatch();
            setError(ERROR_MESSAGES[CODE_PERMISSION_DENIED]);
          } else {
            setError(
              'Lost GPS signal — hold still for a moment while we reconnect.'
            );
          }
        },
        WATCH_OPTIONS
      );

      return watchIdRef.current;
    },
    [clearWatch, storeLocation]
  );

  const stopWatching = useCallback(() => {
    clearWatch();
  }, [clearWatch]);

  // Release the GPS radio when the screen goes away — an orphaned
  // watchPosition keeps the phone's GPS chip lit indefinitely.
  useEffect(() => {
    aliveRef.current = true;

    return () => {
      aliveRef.current = false;
      clearRetryTimer();
      if (watchIdRef.current !== null && geolocationSupported()) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [clearRetryTimer]);

  // One request on mount. `getUserLocation` is stable, so this fires once.
  useEffect(() => {
    if (autoStart) getUserLocation();
  }, [autoStart, getUserLocation]);

  return {
    userLocation,
    loading,
    error,
    accuracy,
    isUsingFallback,
    getUserLocation,
    refreshGPS,
    startWatching,
    stopWatching,
    getAccuracyStatus,
    DEFAULT_CENTER,
  };
}