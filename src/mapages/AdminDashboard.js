// src/mapages/AdminDashboard.jsx
import React from 'react';
import MapDashboard from '../components/dashboard/MapDashboard';

// Everything UserDashboard has, plus the ability to add new locations
// (floating pin button + tapping your own position) and edit/delete
// locations you created.
export default function AdminDashboard() {
  return <MapDashboard mode="admin" />;
}
