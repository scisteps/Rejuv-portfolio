import React, { useState, useEffect } from "react";
import "./team.css"; // Updated import for the new CSS file
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import teamImage1 from '../images/samred2.png';
import teamImage2 from '../images/samtrees.png';
import teamImage3 from '../images/migu3.png';
import teamImage4 from '../images/migudp.png';
import Header from "./Header"; // Assuming Header is a reusable component

const Theteam = () => {
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const images = [teamImage1, teamImage2, teamImage3, teamImage4];

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="team-container">
      <br />
      <br />
      <br />

      <div className={isMobile ? "team-content-section2" : "team-content-section"}>
        {/* Left Image Section */}
        <div className={isMobile ? "mobile-profile" : "image-container"}>
          <Slider
            autoplay={true}
            autoplaySpeed={3000}
            infinite={true}
            slidesToShow={1}
            slidesToScroll={1}
            dots={true}
            className="slick-carousel-container"
          >
            {images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Team ${index}`} className="profile-image" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Text Section */}
        <div className="text-container">
          <p className="left-aligned">
            Name: <span className="highlight">Nkurunungi Sam</span>
          </p>
          <p className="left-aligned">
            Role: <span className="highlight">Lead Animator</span>
          </p>

          {showMore && (
            <>
              <p className="left-aligned">
                More about me: I have been passionate about animation for years, working on various projects to bring ideas to life through storytelling. 
                I love experimenting with different animation techniques to create visually stunning and emotionally impactful content.
              </p>
            </>
          )}

          <button onClick={handleToggle} className="read-more-btn">
            {showMore ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Theteam;
