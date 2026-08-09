// src/services/firestoreService.js
//
// CRUD helpers for the "geofencer" Firestore database.
// Collections: users, categories, images
//
// Import db + primitives from your existing Firebase.js so we only ever
// initialize the app once.
import {
  db,
  storage,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '../../Firebase';

/* ──────────────────────────────────────────────────────────
   USERS
   Doc ID = Firebase Auth uid
   Fields: uid, email, displayName, photoURL, createdAt, updatedAt
   ────────────────────────────────────────────────────────── */

// Call this right after signup (and it's safe to call on every login too,
// since it merges rather than overwrites).
export async function upsertUserProfile(uid, { email, displayName = '', photoURL = '' } = {}) {
  if (!uid) throw new Error('upsertUserProfile: uid is required');
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);

  const payload = {
    uid,
    email: email ?? null,
    displayName,
    photoURL,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
  return payload;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

/* ──────────────────────────────────────────────────────────
   CATEGORIES
   Fields: name, color, icon, createdBy, createdAt
   Shared list — every signed-in user can add one and everyone sees it.
   ────────────────────────────────────────────────────────── */

const categoriesCol = collection(db, 'categories');

export async function addCategory({ name, color = '#636E72', icon = '📍', createdBy }) {
  if (!name || !createdBy) throw new Error('addCategory: name and createdBy are required');
  const docRef = await addDoc(categoriesCol, {
    name: name.trim(),
    color,
    icon,
    createdBy,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCategories() {
  const q = query(categoriesCol, orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Live-updating subscription — use this in the useGeoData/useCategories
// hook so new categories show up for every user without a refresh.
export function subscribeToCategories(callback) {
  const q = query(categoriesCol, orderBy('name'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function updateCategory(categoryId, data) {
  await updateDoc(doc(db, 'categories', categoryId), data);
}

export async function deleteCategory(categoryId) {
  await deleteDoc(doc(db, 'categories', categoryId));
}

/* ──────────────────────────────────────────────────────────
   IMAGES
   Storage: images/{uid}/{timestamp}_{filename}
   Firestore fields: url, storagePath, fileName, size, uploadedBy,
                     locationId (optional), categoryId (optional), createdAt
   ────────────────────────────────────────────────────────── */

const imagesCol = collection(db, 'images');

export async function uploadImage(file, { uploadedBy, locationId = null, categoryId = null } = {}) {
  if (!file || !uploadedBy) throw new Error('uploadImage: file and uploadedBy are required');

  const storagePath = `images/${uploadedBy}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const docRef = await addDoc(imagesCol, {
    url,
    storagePath,
    fileName: file.name,
    size: file.size,
    uploadedBy,
    locationId,
    categoryId,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, url, storagePath };
}

export async function getImages({ locationId, uploadedBy } = {}) {
  const clauses = [];
  if (locationId) clauses.push(where('locationId', '==', locationId));
  if (uploadedBy) clauses.push(where('uploadedBy', '==', uploadedBy));

  const q = clauses.length ? query(imagesCol, ...clauses) : imagesCol;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteImage(imageId, storagePath) {
  // Remove the Firestore record and the underlying Storage file together.
  await deleteDoc(doc(db, 'images', imageId));
  if (storagePath) {
    await deleteObject(ref(storage, storagePath));
  }
}