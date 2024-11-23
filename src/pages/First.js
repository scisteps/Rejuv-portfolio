import React, { useState } from "react";
import "./First.css"; // CSS file for styling
import rejuvbanner from '../images/rejuv banner.png';
import rejuveprofile from '../images/rejuve main logo.png';
import migu1 from '../anims/migu1.mp4';
import migudp from '../images/migudp.png';
import redascension from '../anims/redascension.mp4';
import newyears from '../anims/newyear.mp4';
import supernormal from '../anims/supernormall.mp4';
import migu2 from '../anims/migu2.mp4';
import migu3 from '../anims/migu3.mp4';
import me from '../images/Rejuv dp.jpg';
const First = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("maroon");

  const handleVideoClick = (video) => {
    if (video === "supernormal") {
      setMotivationalBackground("#FADDAD");
    } else if (video === "newyears"){
      setMotivationalBackground("#3B102A");
    }
    else {
      setMotivationalBackground("#B4A88F");

    }
  };

  return (
    <div className="first-container">
      {/* Banner */}
      <div className="banner-section">
        <div className="banner">
          <img
            src={rejuvbanner}
            alt="Rejuv Banner"
            className="banner-image"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {/* Left Image */}
        <div className="image-container">
          <img
            src={me}
            alt="Rejuv"
            className="profile-image"
          />
        </div>

        {/* Right Text */}
        <div className="text-container">
          <h2>Rejuv: Animator for Hire</h2>
          <p>
            Hi, I'm Sam Nkurunungi, a passionate Motion Designer with 5 years of experience in After Effects under the brand Rejuv. I specialize in animated explainers & Lotties. In my free time, I create short, animated stories.
          </p>
        </div>
      </div>

      {/* Motivational Shorts Section */}
      <div
        className="motivational-shorts-section"
        style={{ backgroundColor: motivationalBackground }}
      >
        <h1>Motivational Shorts</h1>
        <div className="video-container">
          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick("redascension")}
          >
            <source src={redascension} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">Red Ascension</p>
        </div>
        <div className="video-container">
          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick("supernormal")}
          >
            <source src={supernormal} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">Red Ascension</p>
        </div>
        <div className="video-container">
          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick("newyears")}
          >
            <source src={newyears} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">New Years</p>
        </div>
      </div>

      {/* Animated Stories Section */}
      <div className="animated-stories-section">
        <h1>Animated Stories</h1>
        <h2>Migu and Feathers</h2>
        <div className="description-container">
          <img
            src={migudp}
            alt="Migu and Feathers"
            className="migudp-image"
          />
          <p className="story-description">
            *Migu and Feathers* is a short animated series set in prehistoric times, exploring the rivalry and eventual bond between a determined man and a mighty prehistoric bird, reminiscent of an ostrich.
          </p>
        </div>
        <div className="video-container">
          <video controls width="100%" className="migu-video">
            <source src={migu1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">Episode 1</p>
        </div>
        <div className="video-container">
          <video controls width="100%" className="migu-video">
            <source src={migu2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">Episode 2</p>
        </div>
        <div className="video-container">
          <video controls width="100%" className="migu-video">
            <source src={migu3} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">Episode 3</p>
        </div>
      </div>
    </div>
  );
};

export default First;
