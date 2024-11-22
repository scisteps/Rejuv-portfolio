import React from "react";
import "./First.css"; // CSS file for styling
import rejuvbanner from '../images/rejuv banner.png';
import rejuveprofile from '../images/rejuve main logo.png'
const First = () => {
  return (
    <div className="first-container">
      {/* Banner */}
      <div className="banner">
        <img
          src={rejuvbanner}
          alt="Rejuv Banner"
          className="banner-image"
        />
      </div>

      {/* Content Section */}
      <div className="content-section">
        {/* Left Image */}
        <div className="image-container">
          <img
            src={rejuveprofile} // Replace with the actual image file path
            alt="Rejuv"
            className="profile-image"
          />
        </div>

        {/* Right Text */}
        <div className="text-container">
          <h2>Rejuv: Animator for Hire</h2>
          <p>
            I am Rejuv, an experienced animator specializing in creating stunning
            animations using Adobe After Effects. Let me help you bring your ideas to life
            with creative and engaging visuals that stand out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default First;
