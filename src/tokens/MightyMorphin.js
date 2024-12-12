import mm from '../tokens/morphin.json';
import React, { useState,useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const MightyMorphin = () => {
  const [background, setBackground] = useState("white");
  const rangerref = useRef([]);
  const playerref = useRef([]);

  // Toggle background color between green and blue
  const toggleBackground = () => {
    setBackground((prev) => (prev === "green" ? "red" : "green"));
  };
  const playit = () => {
if(playerref){
    playerref.current.play();
}  };

  return (
    <div
      style={{
        backgroundColor: background,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.5s ease-in-out", // Smooth transition
      }}
    >
      {/* Centered Lottie Player */}
      <div ref={rangerref} onClick={playit}>
      <Player
      ref={(playerref)}
        src={mm}
        autoplay={false}
        loop={false}
        keepLastFrame={true}
        style={{ width: "500px", height: "500px" }}
      />
      </div>
     
      {/* Toggle Background Button */}
      <button
        onClick={toggleBackground}
        style={{
          position: "absolute",
          bottom: "20px",
          background: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Toggle Background
      </button>
    </div>
  );
};

export default MightyMorphin;
