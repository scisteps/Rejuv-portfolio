// src/components/map/MapPanController.jsx
import { useEffect, useRef } from 'react';
import { useMap } from 'googlemaps-react-primitives';

/**
 * Lives inside <MapWrapper> as a child. It never renders anything —
 * it just watches for a new "fly to" request and animates the map
 * there with map.panTo(), which is what makes it feel like Google
 * Maps instead of teleporting.
 *
 * Usage from the parent:
 *   const [flyTarget, setFlyTarget] = useState(null);
 *   // to move the camera:
 *   setFlyTarget({ lat, lng, zoom, requestId: Date.now() });
 *   // in JSX, inside MapWrapper:
 *   <MapPanController target={flyTarget} />
 *
 * `requestId` (or any changing value) is required so the effect fires
 * again even if you fly to the exact same coordinates twice in a row.
 */
export default function MapPanController({ target }) {
  const map = useMap();
  const lastRequestId = useRef(null);

  useEffect(() => {
    if (!map || !target) return;
    if (target.requestId === lastRequestId.current) return;
    lastRequestId.current = target.requestId;

    map.panTo({ lat: target.lat, lng: target.lng });

    // panTo animates the pan; only bump the zoom afterwards if it's
    // actually different, otherwise we get an unnecessary extra
    // "snap" on top of the pan animation.
    if (typeof target.zoom === 'number' && target.zoom !== map.getZoom()) {
      // Let the pan animation start before changing zoom so the two
      // don't visually collide.
      const timeoutId = setTimeout(() => {
        map.setZoom(target.zoom);
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [map, target]);

  return null;
}