import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import Player from "@lottiefiles/react-lottie-player";
import Header from "./Header";
import Mainloading from "../Loaders/Mainloading";
import Theteam from "./Theteam";
import wetech from '../images/wetech.png';
import paulisa from '../images/paulisa.jpg';
import maz from '../images/maz.jpg';

const Brand = ({ imagesf, aliass, isMobile, images }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);

  const handleClosePopup = () => setShowTeamPopup(false);

  const videoRefs = [useRef(null), useRef(null), useRef(null)];

  return (
    <>
      {isLoading ? (
        <Mainloading />
      ) : (
        <div style={{ userSelect: "none" }}>
          {showTeamPopup && (
            <div
              className="popup-overlay"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div className="popup-content">
                <FaTimes className="close-btn" onClick={handleClosePopup} />
                <span className="close-text" onClick={handleClosePopup}>Close</span>
                <Theteam alias={aliass} imagesa={imagesf} />
              </div>
            </div>
          )}

          <div
            className="brand-container"
            style={{
              filter: showTeamPopup ? "blur(20px) brightness(50%)" : "none",
              transition: "filter 0.3s ease",
            }}
          >
            <Header />
            <div className="content-section">
              <div className="text-container">
                <p className="left-aligned">
                  <span className="highlight">Brand Animation</span> is a powerful tool used by businesses to enhance their brand identity, effectively communicate their messages, and captivate their audiences.
                </p>
                <p className="left-aligned">
                  With our expertise, we transform concepts into visually stunning animations that bring your brand to life, making it memorable and impactful.
                </p>
              </div>
              <div className="video-gallery">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="video-item">
                    <div
                      className="picture-placeholder"
                      style={{ width: "300px", height: "300px", background: "#f0f0f0", marginBottom: "10px" }}
                    >
                      <img
                        src={wetech}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <video
                      ref={videoRefs[num - 1]}
                      controls
                      width="500px"
                      className="brand-video"
                      style={{ borderRadius: "10px" }}
                    >
                      <source src={`video${num}.mp4`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Brand;
