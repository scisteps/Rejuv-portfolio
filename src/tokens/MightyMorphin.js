import React, { useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import mm from '../tokens/green2.json';

const MightyMorphin = () => {
  const lottieRef = useRef(null);
  const [isReversed, setIsReversed] = useState(false);

  const handleToggleAnimation = () => {
    if (lottieRef.current) {
      // Toggle play direction
      const newDirection = isReversed ? 1 : -1; // Forward: 1, Reverse: -1
      lottieRef.current.setPlayerDirection(newDirection);
      lottieRef.current.play();
      setIsReversed(!isReversed); // Update state
    }
  };

  return (
    <>
      {/* Reset Global Styles */}
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            background-color: white;
            height: 100%;
          }
        `}
      </style>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: "white",
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        onClick={handleToggleAnimation}
      >
        {/* Centered Lottie Player */}
        <Player
          ref={lottieRef}
          src={mm}
          autoplay={false}
          keepLastFrame={true}
          loop={false} // Ensure it doesn't loop infinitely
          style={{ width: "500px", height: "500px" }}
        />

        {/* Toggle Button */}
       
      </div>
    </>
  );
};

export default MightyMorphin;
