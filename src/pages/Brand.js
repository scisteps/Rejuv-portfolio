import React, { useState, useEffect, useRef } from "react";
import "./Brand.css";
import wetech from "../images/wetech.png";
import paulisa from "../images/paulisa.jpg";
import maz from "../images/maz.jpg";
import wetechv from "../videos/wexmas.webm";
import mazvid from "../videos/maz.mp4";
import paulisae from "../jsons/paulisa.json";
import explainer1 from "../videos/Hcm.mp4"; // Add your explainer videos here
import explainer2 from "../videos/counterfeit.mp4";
import explainer3 from "../videos/phsplus.webm";
import { Player } from "@lottiefiles/react-lottie-player";
import Header2 from "./Header2";

const Brand = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [bgColor, setBgColor] = useState("white");
  const animref = useRef(null);
  const sectionRefs = useRef([]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
  
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = sectionRefs.current;
  
      // Reset background color to white when the explainer section is reached
      if (sections[1] && scrollY >= sections[1].offsetTop && scrollY < sections[2].offsetTop) {
        setBgColor("white"); // White for brand section
      } else if (sections[2] && scrollY >= sections[2].offsetTop && scrollY < sections[3].offsetTop) {
        setBgColor("#FE875C"); // Set the desired color for the section after brand
      } else if (sections[3] && scrollY >= sections[3].offsetTop) {
        setBgColor("white"); // White for the explainer section
      } else {
        setBgColor("white"); // Default color when above all sections
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const items = [
    {
      imgSrc: wetech,
      videoSrc: wetechv,
      caption: "Xmas message to clients from wetech.",
    },
    {
      imgSrc: maz,
      videoSrc: mazvid,
      caption: "Logo intro.",
    },
    {
      imgSrc: paulisa,
      animation: true, // Indicate it's a Lottie animation instead of a video
      caption: "Logo animation to emphasize brand strength.",
    },
  ];

  const explainerVideos = [
    {
      videoSrc: explainer1,
      caption: "HCM HUB is an app where Technical workers can find work, like a safeboda for technical services",
    },
    {
      videoSrc: explainer2,
      caption: "Explainer about the danger of counterfeit Drugs",
    },
    {
      videoSrc: explainer3,
      caption: "PHS plus app is a central Hub for medical records so that patients can access their records from any health facility",
    },
  ];

  return (
    <div
      className="brand-container"
      style={{
        backgroundColor: bgColor,
        borderRadius: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Header2 />
      <div ref={(el) => (sectionRefs.current[0] = el)} className="brand-definition">
        <h1 style={{ color: "black", textAlign: "center" }}>Brand Animation</h1>
        <p style={{ color: "black", fontSize: "20px", textAlign: "center" }}>
          Our animations bring the brand to life by showcasing its essence through movement and creativity. Each visual
          element reflects the core values and personality of our brand.
        </p>
      </div>

      {items.map((item, index) => (
        <div
          ref={(el) => (sectionRefs.current[index + 1] = el)}
          className="brand-item"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Adjust flexDirection based on mobile vs desktop
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            marginBottom: "30px",
            borderBottom: index < items.length - 1 ? "1px solid gray" : "none",
          }}
          key={index}
        >
          {/* Image */}
          <img
            src={item.imgSrc}
            alt={`Brand Image ${index + 1}`}
            className="brand-image"
            style={{
              height: "200px",
              width: "200px",
              marginBottom: isMobile ? "10px" : "0", // Respecting the original layout
              borderRadius: "15px",
            }}
          />

          {/* Video or Lottie Animation */}
          {item.animation ? (
            <Player
              ref={animref}
              style={{
                height: "300px",
                width: "300px",
                margin: isMobile ? "10px 0" : "0 10px",
              }}
              loop
              autoplay
              src={paulisae}
            />
          ) : (
            <video
              controlsList="nodownload"
              preload="metadata"
              controls
              className="brand-video"
              style={{
                height: "300px",
                width: "300px",
                margin: isMobile ? "10px 0" : "0 10px",
                borderRadius: "20px",
              }}
            >
              <source src={item.videoSrc} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Caption */}
          <p
            style={{
              color: "black",
              marginTop: isMobile ? "10px" : "0",
              textAlign: "center",
            }}
          >
            {item.caption}
          </p>
        </div>
      ))}

      {/* Explainer Section */}
      <div ref={(el) => (sectionRefs.current[items.length + 1] = el)} className="explainer-section">
        <h2 style={{ textAlign: "center", color: "black" }}>Explainer Videos</h2>
        <p style={{ color: "black", fontSize: "18px", textAlign: "center", marginBottom: "20px" }}>
          Watch our explainer videos to learn more about the brand and our services.
        </p>
        {explainerVideos.map((video, index) => (
          <div
            className="explainer-item"
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              marginBottom: "30px",
            }}
            key={index}
          >
            <video
              controlsList="nodownload"
              preload="metadata"
              controls
              className="explainer-video"
              style={{
                height: "300px",
                width: "300px",
                margin: isMobile ? "10px 0" : "0 10px",
                borderRadius: "20px",
              }}
            >
              <source src={video.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p
              style={{
                color: "black",
                marginTop: isMobile ? "10px" : "0",
                textAlign: "center",
              }}
            >
              {video.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
