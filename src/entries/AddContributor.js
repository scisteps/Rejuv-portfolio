import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyAuUZ0mJvFy177CFvTsmutS2bO0FsTJ_9M",
  authDomain: "rejuv-1d74f.firebaseapp.com",
  projectId: "rejuv-1d74f",
  storageBucket: "rejuv-1d74f.firebasestorage.app",
  messagingSenderId: "963584606168",
  appId: "1:963584606168:web:58ae46f67fb0294219fcad",
  measurementId: "G-EBNXBFTFYG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const AddContributor = () => {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [role, setRole] = useState("");
  const [info, setInfo] = useState("");
  const [selectedAnimations, setSelectedAnimations] = useState([]);
  const [videoTitles, setVideoTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // State to hold the uploaded image

  // Fetch video titles on component mount
  useEffect(() => {
    const fetchVideoTitles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Videos"));
        const titles = [];
        querySnapshot.forEach((doc) => {
          const videoData = doc.data();
          if (videoData.title) {
            titles.push(videoData.title);
          }
        });
        setVideoTitles(titles);
      } catch (error) {
        console.error("Error fetching video titles:", error);
      }
    };

    fetchVideoTitles();
  }, []);

  const handleCheckboxClick = (title) => {
    setSelectedAnimations((prevSelected) => {
      if (prevSelected.includes(title)) {
        return prevSelected.filter((t) => t !== title);
      } else {
        return [...prevSelected, title];
      }
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !role.trim()) {
      alert("Please enter Name and Role.");
      return;
    }

    setLoading(true);

    try {
      // Get current contributor id from the counter document
      const counterDocRef = doc(db, "counters", "contributor_counter");
      const counterDoc = await getDoc(counterDocRef);

      if (!counterDoc.exists()) {
        await setDoc(counterDocRef, { currentContributorId: 1 });
      }

      const currentContributorId = counterDoc.data()?.currentContributorId || 1;

      await updateDoc(counterDocRef, {
        currentContributorId: currentContributorId + 1,
      });

      let imageUrl = "";
      if (image) {
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `contributors/${name}_${alias}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Wait for the upload to complete
        await uploadTask;

        // Get the image URL after upload
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add the contributor to Firestore
      await addDoc(collection(db, "Contributors"), {
        name: name,
        alias: alias,
        role: role,
        info: info,
        animationsWorkedOn: selectedAnimations,
        contributorId: currentContributorId,
        imageUrl: imageUrl, // Store the image URL
      });

      alert("Contributor added successfully!");
      setName("");
      setAlias("");
      setRole("");
      setInfo("");
      setSelectedAnimations([]);
      setImage(null); // Reset the image state
    } catch (error) {
      console.error("Error adding contributor: ", error);
      alert("Failed to add contributor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add a Contributor</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        {/* Alias */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="alias">Alias:</label>
          <input
            type="text"
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Enter alias"
          />
        </div>

        {/* Role */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter role"
          />
        </div>

        {/* More Information */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="info">More Information:</label>
          <textarea
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Enter information"
            style={{
              width: "100%",
              height: "80px",
              padding: "10px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="image">Profile Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Checkboxes for Animations */}
        <div style={{ marginBottom: "15px" }}>
          <label>Animations Worked On:</label>
          <div>
            {videoTitles.map((title, index) => (
              <div key={index} style={{ margin: "5px 0" }}>
                <input
                  type="checkbox"
                  id={`animation-${index}`}
                  checked={selectedAnimations.includes(title)}
                  onChange={() => handleCheckboxClick(title)}
                />
                <label htmlFor={`animation-${index}`}>{title}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddContributor;
