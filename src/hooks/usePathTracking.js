// src/hooks/usePathTracking.js
import { useState, useEffect, useRef } from 'react';
import { locationService } from '../services/locationService';

export function usePathTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [path, setPath] = useState([]);
  const [pathStats, setPathStats] = useState({
    distance: 0,
    duration: 0,
    speed: 0
  });
  const watchIdRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTracking = () => {
    if (isTracking) return;
    setPath([]);
    setPathStats({ distance: 0, duration: 0, speed: 0 });
    startTimeRef.current = Date.now();
    setIsTracking(true);

    watchIdRef.current = locationService.watchPosition(
      (position) => {
        const newPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp
        };
        setPath(prev => [...prev, newPoint]);
        updatePathStats(position);
      },
      (error) => {
        console.error('Path tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      locationService.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    if (path.length > 0) {
      const duration = (Date.now() - startTimeRef.current) / 1000 / 60;
      setPathStats(prev => ({
        ...prev,
        duration: Math.round(duration)
      }));
    }
  };

  const updatePathStats = (position) => {
    if (path.length < 2) return;
    const lastPoint = path[path.length - 1];
    const currentPoint = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    const distance = calculateDistance(lastPoint, currentPoint);
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    setPathStats(prev => ({
      distance: prev.distance + distance,
      duration: Math.round(elapsed),
      speed: (prev.distance + distance) / (elapsed / 60)
    }));
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const clearPath = () => {
    setPath([]);
    setPathStats({ distance: 0, duration: 0, speed: 0 });
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        locationService.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    path,
    pathStats,
    startTracking,
    stopTracking,
    clearPath
  };
}