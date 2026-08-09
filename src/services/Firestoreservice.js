// src/services/firestoreService.js
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
  deleteObject,
  increment,
  arrayUnion,
  arrayRemove
} from '../Firebase';

/* ──────────────────────────────────────────────────────────
   USERS
   ────────────────────────────────────────────────────────── */
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
   ────────────────────────────────────────────────────────── */
const categoriesCol = collection(db, 'categories');

export async function addCategory({ name, color = '#636E72', icon = '📍', createdBy, subcategories = [] }) {
  if (!name || !createdBy) throw new Error('addCategory: name and createdBy are required');
  const docRef = await addDoc(categoriesCol, {
    name: name.trim(),
    color,
    icon,
    createdBy,
    subcategories: subcategories || [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCategories() {
  const q = query(categoriesCol, orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

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
   LOCATIONS
   ────────────────────────────────────────────────────────── */
const locationsCol = collection(db, 'locations');

export async function addLocation(locationData) {
  const { 
    name, 
    description = '', 
    category, 
    subcategory = '', 
    lat, 
    lng, 
    createdBy,
    address = '',
    phone = '',
    website = '',
    hours = '',
    tags = [],
    isPublic = true
  } = locationData;

  if (!name || !category || !createdBy) {
    throw new Error('addLocation: name, category, and createdBy are required');
  }

  const docRef = await addDoc(locationsCol, {
    name: name.trim(),
    description: description.trim(),
    category,
    subcategory: subcategory.trim(),
    location: {
      lat: typeof lat === 'number' ? lat : parseFloat(lat),
      lng: typeof lng === 'number' ? lng : parseFloat(lng)
    },
    address: address.trim(),
    phone: phone.trim(),
    website: website.trim(),
    hours: hours.trim(),
    tags: tags || [],
    isPublic: isPublic,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    rating: 0,
    ratingCount: 0,
    views: 0,
    likes: 0
  });

  return docRef.id;
}

export async function getLocations(filters = {}) {
  const { category, subcategory, createdBy, searchTerm } = filters;
  const conditions = [];

  if (category) conditions.push(where('category', '==', category));
  if (subcategory) conditions.push(where('subcategory', '==', subcategory));
  if (createdBy) conditions.push(where('createdBy', '==', createdBy));
  
  // Always get public locations and user's own private ones
  const q = query(locationsCol, ...conditions, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  let locations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  // Filter by search term client-side
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    locations = locations.filter(loc => 
      loc.name.toLowerCase().includes(term) ||
      loc.description.toLowerCase().includes(term) ||
      loc.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  return locations;
}

export function subscribeToLocations(callback, filters = {}) {
  const { category, subcategory, createdBy } = filters;
  const conditions = [];

  if (category) conditions.push(where('category', '==', category));
  if (subcategory) conditions.push(where('subcategory', '==', subcategory));
  if (createdBy) conditions.push(where('createdBy', '==', createdBy));

  const q = query(locationsCol, ...conditions, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getLocationById(locationId) {
  const snap = await getDoc(doc(db, 'locations', locationId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateLocation(locationId, data) {
  await updateDoc(doc(db, 'locations', locationId), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteLocation(locationId) {
  await deleteDoc(doc(db, 'locations', locationId));
}

export async function incrementLocationViews(locationId) {
  await updateDoc(doc(db, 'locations', locationId), {
    views: increment(1)
  });
}

export async function rateLocation(locationId, rating) {
  const locRef = doc(db, 'locations', locationId);
  const snap = await getDoc(locRef);
  if (!snap.exists()) throw new Error('Location not found');
  
  const data = snap.data();
  const newRatingCount = (data.ratingCount || 0) + 1;
  const newRating = ((data.rating || 0) * (data.ratingCount || 0) + rating) / newRatingCount;
  
  await updateDoc(locRef, {
    rating: newRating,
    ratingCount: newRatingCount
  });
  
  return { rating: newRating, ratingCount: newRatingCount };
}

export async function toggleLikeLocation(locationId, userId) {
  const locRef = doc(db, 'locations', locationId);
  const snap = await getDoc(locRef);
  if (!snap.exists()) throw new Error('Location not found');
  
  const data = snap.data();
  const likedBy = data.likedBy || [];
  const isLiked = likedBy.includes(userId);
  
  await updateDoc(locRef, {
    likes: increment(isLiked ? -1 : 1),
    likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
  });
  
  return !isLiked;
}

/* ──────────────────────────────────────────────────────────
   IMAGES (Updated for Locations)
   ────────────────────────────────────────────────────────── */
const imagesCol = collection(db, 'images');

export async function uploadImage(file, { 
  uploadedBy, 
  locationId = null, 
  categoryId = null,
  description = '',
  tags = [],
  isPublic = true,
  isMain = false
} = {}) {
  if (!file || !uploadedBy) throw new Error('uploadImage: file and uploadedBy are required');

  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const storagePath = `images/${uploadedBy}/${timestamp}_${sanitizedFileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const imageData = {
    url,
    storagePath,
    fileName: file.name,
    size: file.size,
    fileType: file.type,
    uploadedBy,
    locationId,
    categoryId,
    description: description.trim(),
    tags: tags || [],
    isPublic,
    isMain,
    downloadCount: 0,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(imagesCol, imageData);

  // If this is the main image, update the location
  if (isMain && locationId) {
    await updateDoc(doc(db, 'locations', locationId), {
      mainImage: url,
      mainImageId: docRef.id
    });
  }

  return { id: docRef.id, url, storagePath, ...imageData };
}

export async function uploadMultipleImages(files, metadata = {}) {
  const { uploadedBy, locationId, categoryId } = metadata;
  if (!uploadedBy) throw new Error('uploadMultipleImages: uploadedBy is required');
  
  const uploadPromises = files.map((file, index) => 
    uploadImage(file, {
      ...metadata,
      isMain: index === 0 // First image becomes main
    })
  );
  
  return await Promise.all(uploadPromises);
}

export async function getImages(filters = {}) {
  const { locationId, uploadedBy, categoryId, publicOnly = false } = filters;
  const conditions = [];

  if (locationId) conditions.push(where('locationId', '==', locationId));
  if (uploadedBy) conditions.push(where('uploadedBy', '==', uploadedBy));
  if (categoryId) conditions.push(where('categoryId', '==', categoryId));
  if (publicOnly) conditions.push(where('isPublic', '==', true));

  conditions.push(orderBy('createdAt', 'desc'));

  const q = query(imagesCol, ...conditions);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteImage(imageId, storagePath) {
  await deleteDoc(doc(db, 'images', imageId));
  if (storagePath) {
    await deleteObject(ref(storage, storagePath));
  }
}

export async function setMainImage(locationId, imageId) {
  // Remove main flag from all images for this location
  const images = await getImages({ locationId });
  const updates = images.map(img => 
    updateDoc(doc(db, 'images', img.id), { isMain: false })
  );
  await Promise.all(updates);
  
  // Set the new main image
  const imgRef = doc(db, 'images', imageId);
  const imgSnap = await getDoc(imgRef);
  if (imgSnap.exists()) {
    await updateDoc(imgRef, { isMain: true });
    await updateDoc(doc(db, 'locations', locationId), {
      mainImage: imgSnap.data().url,
      mainImageId: imageId
    });
  }
}