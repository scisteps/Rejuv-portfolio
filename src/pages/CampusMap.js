/**
 * Campus Navigation Map — React Component
 *
 * SETUP:
 *  1. npm install @react-google-maps/api
 *  2. Replace GOOGLE_MAPS_API_KEY with your key
 *  3. Replace CAMPUS_CENTER with your campus coordinates
 *  4. Swap placeholder image URLs with real campus photos
 *
 * Features:
 *  - Google Maps with custom dark/satellite styles
 *  - Animated custom SVG markers by category
 *  - Info panels with images that slide in on marker click
 *  - Animated route polyline between selected points
 *  - Search/filter bar for buildings
 *  - Campus boundary polygon overlay
 *  - Walking-time estimator
 *  - Category legend with toggle filters
 */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
  Polygon,
  OverlayView,
} from "@react-google-maps/api";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE"; // 🔑 replace this

const CAMPUS_CENTER = { lat: 0.3476, lng: 32.5825 }; // Makerere University, Kampala

// Campus boundary polygon (clockwise lat/lng pairs)
const CAMPUS_BOUNDARY = [
  { lat: 0.3510, lng: 32.5790 },
  { lat: 0.3510, lng: 32.5870 },
  { lat: 0.3445, lng: 32.5870 },
  { lat: 0.3445, lng: 32.5790 },
];

// ─── BUILDINGS DATA ────────────────────────────────────────────────────────────
const CATEGORIES = {
  academic:  { label: "Academic",    color: "#4F8EF7", icon: "🎓" },
  library:   { label: "Library",     color: "#7C3AED", icon: "📚" },
  admin:     { label: "Admin",       color: "#0EA5E9", icon: "🏛️" },
  dining:    { label: "Dining",      color: "#F59E0B", icon: "🍽️" },
  sports:    { label: "Sports",      color: "#10B981", icon: "⚽" },
  medical:   { label: "Medical",     color: "#EF4444", icon: "🏥" },
  residence: { label: "Residence",   color: "#EC4899", icon: "🏠" },
};

const BUILDINGS = [
  {
    id: 1,
    name: "Main Library",
    category: "library",
    position: { lat: 0.3482, lng: 32.5830 },
    description: "The central research hub with over 500,000 volumes, digital archives, and 24-hr study halls.",
    hours: "Mon–Fri 7am–10pm · Sat–Sun 9am–6pm",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    floor: "4 floors",
  },
  {
    id: 2,
    name: "Faculty of Computing",
    category: "academic",
    position: { lat: 0.3495, lng: 32.5845 },
    description: "Home to Computer Science, Software Engineering, and Information Systems departments.",
    hours: "Mon–Fri 8am–6pm",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80",
    floor: "3 floors",
  },
  {
    id: 3,
    name: "Main Hall",
    category: "admin",
    position: { lat: 0.3476, lng: 32.5825 },
    description: "Administrative headquarters, student services, and the historic great hall.",
    hours: "Mon–Fri 8am–5pm",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80",
    floor: "2 floors",
  },
  {
    id: 4,
    name: "Student Center & Cafeteria",
    category: "dining",
    position: { lat: 0.3460, lng: 32.5835 },
    description: "Full-service dining, student lounge, club offices, and event space.",
    hours: "Daily 6:30am–9pm",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80",
    floor: "1 floor",
  },
  {
    id: 5,
    name: "Sports Complex",
    category: "sports",
    position: { lat: 0.3450, lng: 32.5810 },
    description: "Olympic-size pool, football pitch, courts, gym, and athletics track.",
    hours: "Daily 6am–9pm",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80",
    floor: "Indoor / Outdoor",
  },
  {
    id: 6,
    name: "University Hospital",
    category: "medical",
    position: { lat: 0.3500, lng: 32.5805 },
    description: "Teaching hospital with emergency care, outpatient clinics, and pharmacy.",
    hours: "24 hours · Emergency always open",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    floor: "5 floors",
  },
  {
    id: 7,
    name: "Mitchell Hall Residence",
    category: "residence",
    position: { lat: 0.3465, lng: 32.5855 },
    description: "Student dormitories accommodating 800 students with common rooms and laundry.",
    hours: "Residents: 24h · Visitors: 8am–10pm",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    floor: "6 floors",
  },
  {
    id: 8,
    name: "School of Law",
    category: "academic",
    position: { lat: 0.3488, lng: 32.5800 },
    description: "East Africa's leading law faculty with moot court, legal aid clinic, and library.",
    hours: "Mon–Fri 8am–6pm",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&q=80",
    floor: "3 floors",
  },
];

// ─── MAP STYLE (dark academic) ─────────────────────────────────────────────────
const MAP_STYLE = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#c8d0d8" }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#1a1e28" }, { weight: 2 }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a2f3d" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#1e2330" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#252c3f" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2e25" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2e3650" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#38415a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a5478" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3548" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1b2a" }] },
];

// ─── CUSTOM ANIMATED MARKER ────────────────────────────────────────────────────
function AnimatedMarker({ building, isSelected, onClick, isRoutePoint }) {
  const cat = CATEGORIES[building.category];
  const pulse = isSelected || isRoutePoint;

  return (
    <OverlayView
      position={building.position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={onClick}
        style={{
          position: "relative",
          transform: "translate(-50%, -100%)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Pulse ring */}
        {pulse && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: cat.color + "33",
              border: `2px solid ${cat.color}`,
              animation: "markerPulse 1.5s ease-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
        {/* Pin body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            filter: isSelected ? `drop-shadow(0 0 8px ${cat.color})` : "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
            transition: "filter 0.3s ease",
            animation: isSelected ? "markerBounce 0.4s ease" : "none",
          }}
        >
          <div
            style={{
              width: isSelected ? 44 : 36,
              height: isSelected ? 44 : 36,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: isSelected ? cat.color : cat.color + "cc",
              border: `2px solid ${isSelected ? "#fff" : cat.color + "88"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <span style={{ transform: "rotate(45deg)", fontSize: isSelected ? 20 : 16 }}>
              {cat.icon}
            </span>
          </div>
          {/* Pin tip */}
          <div style={{ width: 2, height: 8, background: cat.color, marginTop: -1 }} />
        </div>
        {/* Label */}
        <div
          style={{
            position: "absolute",
            top: isSelected ? -32 : -24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,13,25,0.85)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            border: `1px solid ${cat.color}55`,
            opacity: isSelected ? 1 : 0,
            transition: "opacity 0.2s, top 0.3s",
            pointerEvents: "none",
          }}
        >
          {building.name}
        </div>
      </div>
    </OverlayView>
  );
}

// ─── INFO PANEL ────────────────────────────────────────────────────────────────
function InfoPanel({ building, onClose, onSetRoute }) {
  if (!building) return null;
  const cat = CATEGORIES[building.category];

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 320,
        background: "#0d1117",
        borderLeft: `1px solid #1e2330`,
        display: "flex",
        flexDirection: "column",
        animation: "slideInRight 0.35s cubic-bezier(.16,1,.3,1)",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 180, flexShrink: 0 }}>
        <img
          src={building.image}
          alt={building.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, #0d1117)",
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: 6,
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            background: cat.color + "22",
            border: `1px solid ${cat.color}55`,
            color: cat.color,
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {cat.icon} {cat.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20, flex: 1, overflowY: "auto" }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          {building.name}
        </h2>
        <p style={{ color: "#8b9cb0", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          {building.description}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <InfoRow icon="🕐" label="Hours" value={building.hours} />
          <InfoRow icon="🏗️" label="Size" value={building.floor} />
          <InfoRow
            icon="📍"
            label="Coordinates"
            value={`${building.position.lat.toFixed(4)}, ${building.position.lng.toFixed(4)}`}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2330", display: "flex", gap: 10 }}>
        <button
          onClick={() => onSetRoute(building)}
          style={{
            flex: 1,
            padding: "10px 0",
            background: cat.color,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Set as Destination
        </button>
        <button
          style={{
            padding: "10px 16px",
            background: "#1a2030",
            color: "#8b9cb0",
            border: "1px solid #2a3040",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Share
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ color: "#546070", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ color: "#c8d8e8", fontSize: 13 }}>{value}</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CampusMap() {
  const { isLoaded } = useJsApiLoader({
    id: "campus-map",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState(
    Object.keys(CATEGORIES).reduce((acc, k) => ({ ...acc, [k]: true }), {})
  );
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDest, setRouteDest] = useState(null);
  const [mapStyle, setMapStyle] = useState("dark"); // "dark" | "satellite"

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Filter buildings
  const filtered = BUILDINGS.filter(
    (b) =>
      activeCategories[b.category] &&
      b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Route path
  const routePath =
    routeOrigin && routeDest
      ? [routeOrigin.position, routeDest.position]
      : null;

  // Walking time (approx 5km/h)
  const walkingTime = (() => {
    if (!routePath) return null;
    const R = 6371e3;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(routePath[1].lat - routePath[0].lat);
    const dLng = toRad(routePath[1].lng - routePath[0].lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(routePath[0].lat)) *
        Math.cos(toRad(routePath[1].lat)) *
        Math.sin(dLng / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.ceil((dist / 1000 / 5) * 60);
  })();

  const toggleCategory = (key) =>
    setActiveCategories((prev) => ({ ...prev, [key]: !prev[key] }));

  const panTo = (pos) => {
    if (mapRef.current) {
      mapRef.current.panTo(pos);
      mapRef.current.setZoom(17);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#060c12", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes markerPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
        }
        @keyframes markerBounce {
          0%   { transform: translateY(0); }
          40%  { transform: translateY(-12px); }
          70%  { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes routeDash {
          to { stroke-dashoffset: -30; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a3a50; border-radius: 2px; }
      `}</style>

      {/* ── MAP ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={CAMPUS_CENTER}
            zoom={16}
            onLoad={onLoad}
            options={{
              styles: mapStyle === "dark" ? MAP_STYLE : [],
              mapTypeId: mapStyle === "satellite" ? "satellite" : "roadmap",
              disableDefaultUI: true,
              zoomControl: true,
              zoomControlOptions: { position: 7 },
              gestureHandling: "greedy",
            }}
          >
            {/* Campus boundary */}
            <Polygon
              paths={CAMPUS_BOUNDARY}
              options={{
                fillColor: "#4F8EF7",
                fillOpacity: 0.04,
                strokeColor: "#4F8EF7",
                strokeOpacity: 0.5,
                strokeWeight: 2,
              }}
            />

            {/* Route polyline */}
            {routePath && (
              <Polyline
                path={routePath}
                options={{
                  strokeColor: "#4F8EF7",
                  strokeOpacity: 0.9,
                  strokeWeight: 4,
                  icons: [
                    {
                      icon: { path: 1, scale: 6, strokeColor: "#fff", strokeWeight: 2 },
                      offset: "50%",
                    },
                  ],
                }}
              />
            )}

            {/* Markers */}
            {filtered.map((b) => (
              <AnimatedMarker
                key={b.id}
                building={b}
                isSelected={selected?.id === b.id}
                isRoutePoint={routeOrigin?.id === b.id || routeDest?.id === b.id}
                onClick={() => {
                  setSelected(b);
                  panTo(b.position);
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          // Placeholder when API not loaded
          <div style={{ width: "100%", height: "100%", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 40 }}>🗺️</div>
            <p style={{ color: "#546070", fontSize: 14 }}>
              Add your Google Maps API key to <code style={{ color: "#4F8EF7" }}>GOOGLE_MAPS_API_KEY</code>
            </p>
          </div>
        )}
      </div>

      {/* ── TOP BAR ── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: selected ? 336 : 16,
          display: "flex",
          gap: 10,
          alignItems: "center",
          animation: "slideDown 0.4s ease",
          transition: "right 0.35s cubic-bezier(.16,1,.3,1)",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            background: "rgba(13,17,23,0.92)",
            border: "1px solid #1e2a3a",
            borderRadius: 10,
            padding: "10px 16px",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            whiteSpace: "nowrap",
            backdropFilter: "blur(10px)",
          }}
        >
          🎓 CampusNav
        </div>

        {/* Search */}
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buildings, departments…"
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              background: "rgba(13,17,23,0.92)",
              border: "1px solid #1e2a3a",
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              outline: "none",
              backdropFilter: "blur(10px)",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Map style toggle */}
        <button
          onClick={() => setMapStyle((s) => (s === "dark" ? "satellite" : "dark"))}
          style={{
            background: "rgba(13,17,23,0.92)",
            border: "1px solid #1e2a3a",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#8b9cb0",
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
            backdropFilter: "blur(10px)",
          }}
        >
          {mapStyle === "dark" ? "🛰 Satellite" : "🌑 Dark"}
        </button>
      </div>

      {/* ── CATEGORY FILTERS ── */}
      <div
        style={{
          position: "absolute",
          top: 76,
          left: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          maxWidth: selected ? "calc(100% - 356px)" : "calc(100% - 32px)",
          transition: "max-width 0.35s cubic-bezier(.16,1,.3,1)",
          zIndex: 10,
        }}
      >
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => toggleCategory(key)}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              border: `1px solid ${activeCategories[key] ? cat.color + "66" : "#1e2a3a"}`,
              background: activeCategories[key] ? cat.color + "22" : "rgba(13,17,23,0.85)",
              color: activeCategories[key] ? cat.color : "#546070",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── BUILDINGS LIST (left panel) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          width: 240,
          maxHeight: 360,
          background: "rgba(13,17,23,0.92)",
          border: "1px solid #1e2a3a",
          borderRadius: 12,
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e2a3a" }}>
          <p style={{ color: "#546070", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            {filtered.length} buildings
          </p>
        </div>
        <div style={{ overflowY: "auto", maxHeight: 300 }}>
          {filtered.map((b) => {
            const cat = CATEGORIES[b.category];
            const isActive = selected?.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => { setSelected(b); panTo(b.position); }}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #111820",
                  background: isActive ? cat.color + "18" : "transparent",
                  borderLeft: isActive ? `3px solid ${cat.color}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ color: "#d0dde8", fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                <div style={{ color: cat.color, fontSize: 11, marginTop: 2 }}>
                  {cat.icon} {cat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROUTE BANNER ── */}
      {routePath && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(13,17,23,0.95)",
            border: "1px solid #4F8EF7",
            borderRadius: 12,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 10,
            animation: "slideDown 0.3s ease",
            backdropFilter: "blur(10px)",
          }}
        >
          <div>
            <div style={{ color: "#8b9cb0", fontSize: 11 }}>From → To</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
              {routeOrigin.name} → {routeDest.name}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "0 16px", borderLeft: "1px solid #1e2a3a", borderRight: "1px solid #1e2a3a" }}>
            <div style={{ color: "#4F8EF7", fontSize: 22, fontWeight: 700 }}>{walkingTime}m</div>
            <div style={{ color: "#546070", fontSize: 11 }}>walking</div>
          </div>
          <button
            onClick={() => { setRouteOrigin(null); setRouteDest(null); }}
            style={{
              background: "#1a2030",
              border: "1px solid #2a3040",
              color: "#8b9cb0",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* ── INFO PANEL ── */}
      <InfoPanel
        building={selected}
        onClose={() => setSelected(null)}
        onSetRoute={(b) => {
          if (!routeOrigin) {
            setRouteOrigin(b);
          } else {
            setRouteDest(b);
          }
        }}
      />
    </div>
  );
}
