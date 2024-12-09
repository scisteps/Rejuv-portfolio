import React, { useState } from "react";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const AddVideo = () => {
  const [videoName, setVideoName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoName.trim()) {
      alert("Please enter a video name.");
      return;
    }

    setLoading(true);

    try {
      // Get current video id from the counter document
      const counterDocRef = doc(db, "counters", "video_counter");
      const counterDoc = await getDoc(counterDocRef);

      if (!counterDoc.exists()) {
        // If counter document doesn't exist, create it with initial value
        await setDoc(counterDocRef, { currentVideoId: 1 });
      }

      const currentVideoId = counterDoc.data().currentVideoId;

      // Increment the video id for the next video
      await updateDoc(counterDocRef, { currentVideoId: currentVideoId + 1 });

      // Add the new video with the current video id
      await addDoc(collection(db, "Videos"), {
        title: videoName,
        clown: 0,
        laugh: 0,
        smile: 0,
        dislike: 0,
        bored: 0,
        cool: 0,
        videoid: currentVideoId, // Use the current video id
      });

      alert("Video added successfully!");
      setVideoName(""); // Reset the input field
    } catch (error) {
      console.error("Error adding video: ", error);
      alert("Failed to add video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getValues = async (vidid) => {
    try {
      const videoDocRef = doc(db, "Videos", vidid);
      const videoDoc = await getDoc(videoDocRef);

      if (!videoDoc.exists()) {
        console.error("No video found with the provided ID.");
        return null;
      }

      const { clown, laugh, cool, smile, dislike, bored } = videoDoc.data();
      console.log({ clown, laugh, cool, smile, dislike, bored });
      return { clown, laugh, cool, smile, dislike, bored };
    } catch (error) {
      console.error("Error retrieving video data: ", error);
      return null;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add a Video</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="videoName" style={{ display: "block", marginBottom: "5px" }}>
            Video Name:
          </label>
          <input
            type="text"
            id="videoName"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Enter video name"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddVideo;
