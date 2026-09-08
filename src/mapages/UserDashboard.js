// src/mapages/UserDashboard.jsx
import React from 'react';
import MapDashboard from '../components/dashboard/MapDashboard';

// View-only: browse locations, filter by category, rate/like, view
// photos, track a path, see elevation vs. your position. No add/edit/
// delete controls — those live in AdminDashboard.
export default function UserDashboard() {
  return <MapDashboard mode="user" />;
}
