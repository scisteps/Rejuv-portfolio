// src/hooks/useLocationImages.js
//
// Handles:
//  - Uploading images to Firebase Storage
//  - Saving image metadata (lat, lng, url, size, userId) to Firestore
//  - Loading all pinned images from Firestore on mount
//  - Per-upload validation (type, size)
//  - Upload progress tracking

import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '../firebase'; // ← adjust if your firebase.js is elsewhere

// ── Limits ───────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per image
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ── Anonymous user identity ───────────────────────────────────────────────────
// Since there is no auth, we generate a stable ID per device using localStorage.
// The same device always gets the same "user" so their upload count is consistent.
function getAnonUserId() {
  const KEY = 'makerere_anon_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useLocationImages() {
  const [locationImages, setLocationImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0–100
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);

  const userId = getAnonUserId();

  // ── Load all images from Firestore on mount ─────────────────────────────
  useEffect(() => {
    loadAllImages();
  }, []);

  const loadAllImages = async () => {
    setLoadingImages(true);
    setLoadError(null);
    try {
      // FIRESTORE COLLECTION: "location_images"
      // Each document has: userId, lat, lng, imageUrl, fileName, fileSize,
      //                     storagePath, createdAt
      const q = query(
        collection(db, 'location_images'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocationImages(data);
    } catch (err) {
      console.error('[useLocationImages] Failed to load images:', err);

      // Friendly errors for common Firestore problems
      if (err.code === 'permission-denied') {
        setLoadError('Storage permission denied. Check your Firestore security rules.');
      } else if (err.code === 'unavailable') {
        setLoadError('Cannot reach Firebase. Check your internet connection.');
      } else {
        setLoadError('Failed to load pinned photos. Pull to retry.');
      }
    } finally {
      setLoadingImages(false);
    }
  };

  // ── Upload an image and save its metadata ───────────────────────────────
  const uploadImageAtLocation = async (file, lat, lng) => {
    setError(null);

    // ── Validation checks ──────────────────────────────────────────────────
    if (!file) {
      setError('No file selected.');
      return null;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Unsupported file type "${file.type}". Please use JPEG, PNG, WebP, or GIF.`);
      return null;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setError(`Image is too large (${sizeMB} MB). Maximum allowed size is 5 MB.`);
      return null;
    }

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      setError('Invalid location coordinates. Make sure GPS is active.');
      return null;
    }

    // ── Upload to Firebase Storage ─────────────────────────────────────────
    setUploading(true);
    setUploadProgress(0);

    try {
      // Storage path: location_images/{userId}/{timestamp}_{filename}
      // This keeps each user's images in their own folder
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `location_images/${userId}/${Date.now()}_${safeFileName}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track progress and wait for completion
      const downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const pct = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(pct);
          },
          (uploadErr) => {
            // Firebase Storage specific error codes
            if (uploadErr.code === 'storage/unauthorized') {
              reject(new Error('Upload not allowed. Check your Firebase Storage rules.'));
            } else if (uploadErr.code === 'storage/quota-exceeded') {
              reject(new Error('Firebase Storage quota exceeded. Contact the admin.'));
            } else if (uploadErr.code === 'storage/canceled') {
              reject(new Error('Upload was cancelled.'));
            } else {
              reject(new Error('Upload failed: ' + uploadErr.message));
            }
          },
          async () => {
            // Upload complete — get the public download URL
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // ── Save metadata to Firestore ────────────────────────────────────────
      // This is the document written to the "location_images" collection
      const docData = {
        userId,                           // anonymous device ID
        lat,                              // GPS latitude at time of upload
        lng,                              // GPS longitude at time of upload
        imageUrl: downloadURL,            // public Firebase Storage URL
        fileName: file.name,             // original filename
        fileSize: file.size,             // bytes — used for storage meter
        storagePath,                      // Storage path — useful for future deletion
        createdAt: new Date().toISOString(), // ISO timestamp
      };

      const docRef = await addDoc(collection(db, 'location_images'), docData);
      const newEntry = { id: docRef.id, ...docData };

      // Update local state immediately — no need to reload from Firestore
      setLocationImages(prev => [newEntry, ...prev]);

      console.log('[useLocationImages] Image pinned:', docRef.id);

      setUploading(false);
      setUploadProgress(0);
      return newEntry; // success — caller can use this to confirm

    } catch (err) {
      console.error('[useLocationImages] Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
      return null; // failure — caller keeps panel open
    }
  };

  // ── Helper: get images near a specific lat/lng ──────────────────────────
  // Used to check if the user is near an existing camera pin
  const getImagesAtLocation = (lat, lng, radiusDeg = 0.0001) => {
    return locationImages.filter(
      img =>
        Math.abs(img.lat - lat) < radiusDeg &&
        Math.abs(img.lng - lng) < radiusDeg
    );
  };

  // ── Per-user stats ──────────────────────────────────────────────────────
  const getUserStats = () => {
    const mine = locationImages.filter(img => img.userId === userId);
    const totalBytes = mine.reduce((sum, img) => sum + (img.fileSize || 0), 0);
    return {
      count: mine.length,
      totalBytes,
      totalMB: totalBytes / (1024 * 1024),
    };
  };

  return {
    locationImages,       // all pinned images (all users)
    uploading,            // true while upload is in progress
    uploadProgress,       // 0–100
    error,                // upload error string or null
    loadError,            // load error string or null
    loadingImages,        // true while initial Firestore load is happening
    userId,               // this device's anonymous ID
    uploadImageAtLocation,
    getImagesAtLocation,
    getUserStats,
    reload: loadAllImages,
  };
}
