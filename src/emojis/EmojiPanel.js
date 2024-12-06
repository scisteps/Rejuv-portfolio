import React, { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { gsap } from "gsap";
import { getFirestore, doc, updateDoc, getDoc,query,collection,where,getDocs } from "firebase/firestore";
import cool from "../jsons/cool.json";
import love from "../jsons/loveemoji.json";
import clown from "../jsons/clown.json";
import laugh from "../jsons/laugh.json";
import smile from "../jsons/dono.json";

const EmojiPanel = ({ backgroundColor, strokecolor, textcolor, vidid }) => {
  const db = getFirestore(); // Initialize Firestore
  const emojiRefs = useRef([]);
  const playerRefs = useRef([]);
  const activeEmojis = useRef([]);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]);

  const emojis = [cool, love, clown, laugh, smile];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Query the "Videos" collection for a document where the videoid field matches vidid
        const q = query(collection(db, "Videos"), where("videoid", "==", vidid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error(`No video found with the provided videoid: ${vidid}`);
          return;
        }

        // Assuming there's only one document that matches the videoid, get the first one
        const videoDoc = querySnapshot.docs[0];
        const videoData = videoDoc.data();

        // Set the counts from Firestore data
        setCounts([
          videoData.cool || 0,
          videoData.love || 0,
          videoData.clown || 0,
          videoData.laugh || 0,
          videoData.smile || 0,
        ]);
      } catch (error) {
        console.error("Error fetching emoji counts: ", error);
      }
    };

    fetchCounts();
  }, [vidid]); // Re-fetch counts when vidid changes
  
  const handleEmojiClick = async (index) => {
    const currentEmoji = emojiRefs.current[index];
    
    if (activeEmojis.current.includes(index)) {
      // Emoji is already active, so scale it back to 1 and decrease the count
      gsap.to(currentEmoji, { scale: 1, duration: 0.3 });
      activeEmojis.current = activeEmojis.current.filter((i) => i !== index);
  
      // Stop animation
      if (playerRefs.current[index]) {
        playerRefs.current[index].stop();
      }
  
      // Decrease the count
      const newCounts = [...counts];
      newCounts[index] = Math.max(newCounts[index] - 1, 0);  // Ensure count doesn't go below 0
      setCounts(newCounts);
  
      // Update Firestore: Decrease the count
      const emojiFields = ["cool", "love", "clown", "laugh", "smile"];
      const fieldName = emojiFields[index];
      try {
        const videoQuerySnapshot = await getDocs(
          query(collection(db, "Videos"), where("videoid", "==", vidid))
        );
  
        if (!videoQuerySnapshot.empty) {
          const videoDocRef = videoQuerySnapshot.docs[0].ref;
          const videoData = videoQuerySnapshot.docs[0].data();
  
          const updatedData = {
            [fieldName]: Math.max(videoData[fieldName] - 1, 0),  // Decrease the field value by 1
          };
  
          await updateDoc(videoDocRef, updatedData);
          console.log(`Emoji count for ${fieldName} decreased successfully in Firestore`);
        } else {
          console.error(`No video found with videoid: ${vidid}`);
        }
      } catch (error) {
        console.error("Error updating emoji count: ", error);
      }
    } else {
      // Emoji is not active, so scale it up and increase the count
      gsap.to(currentEmoji, { scale: 1.5, duration: 0.3 });
      activeEmojis.current.push(index);
  
      // Start animation
      if (playerRefs.current[index]) {
        playerRefs.current[index].play();
      }
  
      // Update state: Increment the selected emoji count by 1
      const newCounts = [...counts];
      newCounts[index] += 1;  // Only increment the count for the clicked emoji
      setCounts(newCounts);
  
      // Update Firestore: Increment the count
      const emojiFields = ["cool", "love", "clown", "laugh", "smile"];
      const fieldName = emojiFields[index];
  
      try {
        const videoQuerySnapshot = await getDocs(
          query(collection(db, "Videos"), where("videoid", "==", vidid))
        );
  
        if (!videoQuerySnapshot.empty) {
          const videoDocRef = videoQuerySnapshot.docs[0].ref;
          const videoData = videoQuerySnapshot.docs[0].data();
  
          const updatedData = {
            [fieldName]: videoData[fieldName] + 1,  // Increment the field value by 1
          };
  
          await updateDoc(videoDocRef, updatedData);
          console.log(`Emoji count for ${fieldName} updated successfully in Firestore`);
        } else {
          console.error(`No video found with videoid: ${vidid}`);
        }
      } catch (error) {
        console.error("Error updating emoji count: ", error);
      }
    }
  };
  
  
  
  
  

  const addValues = async (index, count) => {
    try {
      const emojiNames = ["cool", "love", "clown", "laugh", "smile"];
      const emojiKey = emojiNames[index]; // Map index to emoji field

      // Convert videoid to string to ensure proper document reference
      const videoDocRef = doc(db, "Videos", vidid.toString());

      // Update the specific emoji count in Firestore
      await updateDoc(videoDocRef, { [emojiKey]: count });
      console.log(`${emojiKey} count updated to ${count} for video ID: ${vidid}`);
    } catch (error) {
      console.error("Error updating emoji count: ", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: backgroundColor || "lightblue",
        borderRadius: "10px",
        height: "80px",
        width: "90%",
        margin: "0 auto",
        border: `0px solid ${strokecolor || "black"}`,
        color: textcolor || "white",
      }}
    >
      Reactions
      {emojis.map((emoji, index) => (
        <div
          key={index}
          ref={(el) => (emojiRefs.current[index] = el)}
          onClick={() => handleEmojiClick(index)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transform: "scale(1)",
          }}
        >
          <Player
            ref={(player) => (playerRefs.current[index] = player)}
            autoplay={false}
            loop={false}
            keepLastFrame={true}
            src={emoji}
            style={{ height: "50px", width: "50px" }}
          />
          <span
            style={{
              color: textcolor || "white",
              marginTop: "-5px",
              marginBottom: "7px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            {counts[index]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default EmojiPanel;
