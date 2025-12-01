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
  
    useEffect(() => {
      if (!mapRef.current || map.current) return;
  
      // Simple map initialization
      map.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map.current);
  
    }, []);
  
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <div 
          ref={mapRef} 
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    );
  }