import React, { useState, useEffect } from "react";
import "./First.css"; // CSS file for styling
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"
import rejuvbanner from '../images/rejuv banner.png';
import rejuveprofile from '../images/rejuve main logo.png';
import migu1 from '../anims/migu1.mp4';
import migudp from '../images/migudp.png';
import redascension from '../anims/optimizedShadowAnimation.mp4';
import newyears from '../anims/optimizedNewYear.mp4';
import supernormal from '../anims/Web Optimized Abnomal Samuel.mp4';
import migu2 from '../anims/Migu & Feathers_optimized2.mp4';
import migu3 from '../anims/migu3.mp4';
import miguim2 from '../images/m&f.png';
import miguim3 from '../images/ep3.png';
import scistepsquare from '../images/scistepsquare.png';
import me from '../images/Rejuv dp.jpg';
import Header from "./Header";

const First = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("maroon");
  const images = [me, rejuveprofile, scistepsquare]; // Add more images or videos as needed
  const images2 = [migudp, miguim2, miguim3]; // Add more images or videos as needed

  const handleVideoClick = (video) => {
    if (video === "supernormal") {
      setMotivationalBackground("#FADDAD");
    } else if (video === "newyears"){
      setMotivationalBackground("#3B102A");
    } else {
      setMotivationalBackground("#B4A88F");
    }
  };
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite loop of images
    speed: 500, // Speed of transition
    slidesToShow: 1, // Show one image at a time
    slidesToScroll: 1, // Scroll one image at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Speed of autoplay (3 seconds)
    arrows: false, // Disable previous/next arrows
    pauseOnHover: true, // Pause autoplay on hover (optional)
  };
  

  return (
    <div className="first-container">
      <div>
        <Header/>
      </div>
      {/* Banner */}
      <div className="banner-section">
        <div className="banner">
          <img src={rejuvbanner} alt="Rejuv Banner" className="banner-image" />
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {/* Left Image */}
        <div className="image-container">
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
        <img src={image} alt={`Slideshow ${index}`} className="profile-image" />
      </div>
    ))}
  </Slider>
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
          <p className="video-caption">Supernormal</p>
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
        <div className="content-section">
        <div className="image-container">
        <Slider
    autoplay={true}
    autoplaySpeed={3000}
    infinite={true}
    slidesToShow={1}
    slidesToScroll={1}
    dots={true}
    className="slick-carousel-container"
  >
    {images2.map((image, index) => (
      <div key={index}>
        <img src={image} alt={`Slideshow ${index}`} className="profile-image" />
      </div>
    ))}
  </Slider>
          <p className="story-description">
            *Migu and Feathers* is a short animated series set in prehistoric times, exploring the rivalry and eventual bond between a determined man and a mighty prehistoric bird, reminiscent of an ostrich.
          </p>
        </div>
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
