import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import './map.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function SalesTracker() {
  const mapRef = useRef(null);
  const map = useRef(null);
  const routeLine = useRef(null);
  const markers = useRef([]);
  const path = useRef([]);

  const [info, setInfo] = useState("Tap 'Track' to begin");
  const [loading, setLoading] = useState(false);

  // Initialize map when DOM is ready
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    try {
      map.current = L.map(mapRef.current, {
        center: [39.8283, -98.5795],
        zoom: 5,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      routeLine.current = L.polyline([], {
        color: "#FF3B30",
        weight: 6,
        opacity: 0.9,
      }).addTo(map.current);

      map.current.on("click", (e) => {
        const latlng = e.latlng;
        addPin(latlng);
        path.current.push(latlng);
        updateRoute();
      });

      const saved = localStorage.getItem("salesDay");
      if (saved) {
        const { path: p, pins } = JSON.parse(saved);
        path.current = p.map(([lat, lng]) => L.latLng(lat, lng));
        pins.forEach(([lat, lng]) => addPin(L.latLng(lat, lng)));
        updateRoute();
      }
    } catch (err) {
      console.error("Leaflet init error:", err);
    }
  }, [mapRef.current]);

  const addPin = (latlng) => {
    const icon = L.divIcon({
      html: `<div style="background:#FF9500;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    const marker = L.marker(latlng, { icon }).addTo(map.current);
    markers.current.push(marker);
  };

  const updateRoute = () => {
    if (routeLine.current && path.current.length > 1) {
      routeLine.current.setLatLngs(path.current);
    }
  };

  useEffect(() => {
    const data = {
      path: path.current.map((l) => [l.lat, l.lng]),
      pins: markers.current
        .filter((m) => !m.options.zIndexOffset)
        .map((m) => [m.getLatLng().lat, m.getLatLng().lng]),
    };
    localStorage.setItem("salesDay", JSON.stringify(data));
  }, [path.current, markers.current]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, {
        headers: { "User-Agent": "SalesTrackerApp/1.0" },
      });
      const data = await res.json();
      const a = data.address || {};
      const town = a.city || a.town || a.village || "—";
      const street = a.road || a.path || "—";
      return { town, street };
    } catch {
      return { town: "—", street: "—" };
    }
  };

  const handleTrack = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        map.current.setView(latlng, 17);

        markers.current = markers.current.filter((m) => {
          if (m.options.zIndexOffset === 1000) m.remove();
          return m.options.zIndexOffset !== 1000;
        });

        const blueIcon = L.divIcon({
          html: `<div style="background:#007AFF;width:20px;height:20px;border-radius:50%;border:4px solid white;animation:pulse 1.5s infinite;"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const cur = L.marker(latlng, { icon: blueIcon, zIndexOffset: 1000 }).addTo(map.current);
        markers.current.push(cur);

        path.current.push(latlng);
        updateRoute();

        const { town, street } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setInfo(`${town} – ${street}`);
        setLoading(false);
      },
      (err) => {
        alert("GPS Error: " + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const resetDay = () => {
    markers.current.forEach((m) => m.remove());
    markers.current = [];
    path.current = [];
    routeLine.current.setLatLngs([]);
    localStorage.removeItem("salesDay");
    setInfo("Day reset");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        ref={mapRef}
        key="leaflet-map"
        style={{ width: "100%", height: "100%" }}
      />

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(255,255,255,0.95)",
          padding: "12px 16px",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 300,
          zIndex: 1000,
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Sales Route Tracker</h3>
        <p style={{ margin: "4px 0", fontSize: 14 }}>
          <strong>At:</strong> {info}
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={handleTrack}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              background: loading ? "#ccc" : "#007AFF",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "600",
            }}
          >
            {loading ? "Locating…" : "Track"}
          </button>
          <button
            onClick={resetDay}
            style={{
              padding: "10px 14px",
              background: "#FF3B30",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "600",
            }}
          >
            Reset
          </button>
        </div>

        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#666" }}>
          Click map to <strong>pin</strong> a stop.
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,122,255,0.7); }
          70% { box-shadow: 0 0 0 12px rgba(0,122,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,122,255,0); }
        }
      `}</style>
    </div>
  );
}