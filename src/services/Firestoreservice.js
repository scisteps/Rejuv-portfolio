// src/services/Firestoreservice.js
import { db, auth } from '../Firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  getDoc,
  increment,
  arrayRemove,
  arrayUnion,
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy,
  where
} from 'firebase/firestore';

// ──────────────────────────────────────────────
// LOCATION FUNCTIONS
// ──────────────────────────────────────────────

// Add location
export const addLocation = async (locationData) => {
  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      ...locationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...locationData };
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};

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
// Update location
export const updateLocation = async (locationId, locationData) => {
  try {
    const docRef = doc(db, 'locations', locationId);
    await updateDoc(docRef, {
      ...locationData,
      updatedAt: serverTimestamp()
    });
    return { id: locationId, ...locationData };
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};
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

// Get all locations
export const getLocations = async () => {
  try {
    const q = query(collection(db, 'locations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const locations = [];
    querySnapshot.forEach((doc) => {
      locations.push({ id: doc.id, ...doc.data() });
    });
    return locations;
  } catch (error) {
    console.error('Error getting locations:', error);
    throw error;
  }
};

// Get location by ID
export const getLocationById = async (locationId) => {
  try {
    const docRef = doc(db, 'locations', locationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

// Delete location
export const deleteLocation = async (locationId) => {
  try {
    const docRef = doc(db, 'locations', locationId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};

// ──────────────────────────────────────────────
// CATEGORY FUNCTIONS
// ──────────────────────────────────────────────

// Add new category
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp()
    });
    return { id: categoryId, ...categoryData };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ──────────────────────────────────────────────
// IMAGE FUNCTIONS (optional)
// ──────────────────────────────────────────────

// Add image reference to location
export const addImageToLocation = async (locationId, imageData) => {
  try {
    const locationRef = doc(db, 'locations', locationId);
    await updateDoc(locationRef, {
      images: arrayUnion(imageData),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error adding image to location:', error);
    throw error;
  }
};

// Remove image from location
export const removeImageFromLocation = async (locationId, imageId) => {
  try {
    const locationRef = doc(db, 'locations', locationId);
    // You'll need to get the current images and filter
    const docSnap = await getDoc(locationRef);
    if (docSnap.exists()) {
      const currentImages = docSnap.data().images || [];
      const updatedImages = currentImages.filter(img => img.id !== imageId);
      await updateDoc(locationRef, {
        images: updatedImages,
        updatedAt: serverTimestamp()
      });
    }
    return true;
  } catch (error) {
    console.error('Error removing image from location:', error);
    throw error;
  }
};