// src/services/imageService.js
import {
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  onSnapshot,
  increment  // ← ADD THIS IMPORT
} from '../Firebase';

const IMAGES_COLLECTION = 'images';

/**
 * Upload an image to Firebase Storage and save metadata to Firestore
 * 
 * @param {File} file - The image file to upload
 * @param {Object} metadata - Additional metadata
 * @param {string} metadata.uploadedBy - User UID (required)
 * @param {string} metadata.locationId - Optional location ID
 * @param {string} metadata.categoryId - Optional category ID
 * @param {string} metadata.description - Optional description
 * @param {Array} metadata.tags - Optional tags
 * @param {boolean} metadata.isPublic - Whether the image is public
 * @returns {Promise<Object>} - The saved image document data
 */
export async function uploadImage(file, metadata = {}) {
  const { 
    uploadedBy, 
    locationId = null, 
    categoryId = null, 
    description = '',
    tags = [],
    isPublic = true 
  } = metadata;

  if (!file) throw new Error('uploadImage: file is required');
  if (!uploadedBy) throw new Error('uploadImage: uploadedBy (user UID) is required');

  try {
    // 1. Create a unique storage path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `images/${uploadedBy}/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, storagePath);

    // 2. Upload file to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // 3. Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    // 4. Save metadata to Firestore
    const imageData = {
      url: downloadURL,
      storagePath: storagePath,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedBy: uploadedBy,
      locationId: locationId,
      categoryId: categoryId,
      description: description,
      tags: tags,
      isPublic: isPublic,
      downloadCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Store image dimensions if needed
      width: 0,
      height: 0
    };

    // Get image dimensions (optional)
    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await getImageDimensions(file);
        imageData.width = dimensions.width;
        imageData.height = dimensions.height;
      } catch (err) {
        console.warn('Could not get image dimensions:', err);
      }
    }

    const docRef = await addDoc(collection(db, IMAGES_COLLECTION), imageData);
    
    return {
      id: docRef.id,
      ...imageData
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Helper to get image dimensions
 */
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get all images with optional filters
 * 
 * @param {Object} filters - Optional filters
 * @param {string} filters.uploadedBy - Filter by user
 * @param {string} filters.locationId - Filter by location
 * @param {string} filters.categoryId - Filter by category
 * @param {boolean} filters.publicOnly - Only show public images
 * @returns {Promise<Array>} - Array of image documents
 */
export async function getImages(filters = {}) {
  const { uploadedBy, locationId, categoryId, publicOnly = false } = filters;
  
  try {
    const conditions = [];
    
    if (uploadedBy) {
      conditions.push(where('uploadedBy', '==', uploadedBy));
    }
    
    if (locationId) {
      conditions.push(where('locationId', '==', locationId));
    }
    
    if (categoryId) {
      conditions.push(where('categoryId', '==', categoryId));
    }
    
    if (publicOnly) {
      conditions.push(where('isPublic', '==', true));
    }
    
    // Always order by newest first
    conditions.push(orderBy('createdAt', 'desc'));
    
    const q = query(collection(db, IMAGES_COLLECTION), ...conditions);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting images:', error);
    throw error;
  }
}

/**
 * Get images for a specific location
 */
export async function getLocationImages(locationId) {
  return getImages({ locationId, publicOnly: true });
}

/**
 * Get a single image by ID
 */
export async function getImageById(imageId) {
  try {
    const docRef = doc(db, IMAGES_COLLECTION, imageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting image:', error);
    throw error;
  }
}

/**
 * Delete an image (removes from both Storage and Firestore)
 */
export async function deleteImage(imageId, storagePath = null) {
  try {
    // If no storage path provided, fetch it first
    if (!storagePath) {
      const imageDoc = await getImageById(imageId);
      if (!imageDoc) {
        throw new Error('Image not found');
      }
      storagePath = imageDoc.storagePath;
    }
    
    // Delete from Storage
    if (storagePath) {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    }
    
    // Delete from Firestore
    await deleteDoc(doc(db, IMAGES_COLLECTION, imageId));
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(imageId, updates) {
  try {
    const docRef = doc(db, IMAGES_COLLECTION, imageId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw error;
  }
}

/**
 * Increment download count for an image
 */
export async function incrementDownloadCount(imageId) {
  try {
    const docRef = doc(db, IMAGES_COLLECTION, imageId);
    await updateDoc(docRef, {
      downloadCount: increment(1)
    });
    return true;
  } catch (error) {
    console.error('Error incrementing download count:', error);
    throw error;
  }
}

/**
 * Subscribe to images in real-time
 */
export function subscribeToImages(callback, filters = {}) {
  const { uploadedBy, locationId, categoryId } = filters;
  
  const conditions = [];
  
  if (uploadedBy) {
    conditions.push(where('uploadedBy', '==', uploadedBy));
  }
  
  if (locationId) {
    conditions.push(where('locationId', '==', locationId));
  }
  
  if (categoryId) {
    conditions.push(where('categoryId', '==', categoryId));
  }
  
  conditions.push(orderBy('createdAt', 'desc'));
  
  const q = query(collection(db, IMAGES_COLLECTION), ...conditions);
  
  return onSnapshot(q, (snapshot) => {
    const images = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(images);
  });
}

/**
 * Upload multiple images at once
 */
export async function uploadMultipleImages(files, metadata = {}) {
  const { uploadedBy, locationId, categoryId } = metadata;
  
  if (!uploadedBy) {
    throw new Error('uploadMultipleImages: uploadedBy is required');
  }
  
  const uploadPromises = files.map(file => 
    uploadImage(file, { uploadedBy, locationId, categoryId })
  );
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}