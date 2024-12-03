import React, { useState, useEffect,useRef } from "react";
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
import migu3 from '../anims/Migu & Feathers3_optimized2.mp4';
import miguim2 from '../images/m&f.png';
import miguim3 from '../images/migu3.png';
import scistepsquare from '../images/scistepsquare.png';
import me from '../images/Rejuv dp.jpg';
import Header from "./Header";
import rejuveblack from '../images/black.png';

import bball from '../anims/d19_optimized.mp4';

const First = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("maroon");
  const images = [me, rejuveprofile, rejuveblack]; // Add more images or videos as needed
  const images2 = [migudp, miguim2, miguim3]; // Add more images or videos as needed
  const newyearsref = useRef(null);
  const redref = useRef(null);
  const snormalref = useRef(null);
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

const [playingVideo, setPlayingVideo] = useState(null); // Track the currently playing video
const videoRefs = {
  1: useRef(null),
  2: useRef(null),
  3: useRef(null),
  4: useRef(null),
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

  const handleVideoClick = (video) => {
     
  
  // Play the selected video and update the state
    if (video === 2) {
      setMotivationalBackground("#FADDAD");
    
    
    } else if (video === 1){
      setMotivationalBackground("#3B102A");
    } else if (video === 3){
      setMotivationalBackground("#B4A88F");
    }
    else if (video === 4){
      setMotivationalBackground("#54A9E5");
    }
    
  };

  return (
    <div className="first-container">
      <div>
        <Header/>
      </div>
     <br/>
     <br/>

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
      <p className="left-aligned">
        Hi, I'm <span className="highlight">Sam Nkurunungi</span>, working under the brand{" "}
        <span className="highlight bold">Rejuv</span>. My passion for animation drives me to create{" "}
        <span className="highlight">diverse</span> and captivating pieces that bring ideas to life.
      </p>

      {showMore && (
        <>
          <p className="left-aligned">
            I specialize in <span className="highlight bold">professional animated explainers</span> and intricate{" "}
            <span className="highlight">Lottie animations</span>, offering services to help businesses and individuals convey their messages effectively.
          </p>
          <p className="left-aligned">
            In my free time, I channel my creativity into crafting <span className="highlight bold">short, animated stories</span> that explore unique themes and characters, showcasing the limitless possibilities of animation.
          </p>
          <p className="left-aligned">
            Additionally, I share my expertise by <span className="highlight">teaching animation</span>, inspiring others to discover and develop their own creative potential. Whether you're seeking engaging explainers or looking to learn the art of animation, I'm here to help.
          </p>
        </>
      )}

      <button onClick={handleToggle} className="read-more-btn">
        {showMore ? "Read Less" : "Read More"}
      </button>
    </div>

      </div>

      {/* Motivational Shorts Section */}
      <div
        className="motivational-shorts-section"
        style={{ backgroundColor: motivationalBackground }}
      >
        <h1>Animated Shorts</h1>
        <div ref={redref}  onClick={() => handleVideoClick(1)}
 className="video-container">
            <p className="video-caption">Red Ascension</p>

          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick(1)}
          >
            <source src={redascension} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div ref={newyearsref} onClick={() => handleVideoClick(4)} className="video-container">
        <p className="video-caption">Basketball dunk</p>

          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick(4)}
          >
            <source src={bball} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div ref={snormalref} onClick={() => handleVideoClick(2)} className="video-container">
        <p className="video-caption">Supernormal</p>

          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick(2)}
          >
            <source src={supernormal} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div ref={newyearsref} onClick={() => handleVideoClick(3)} className="video-container">
        <p className="video-caption">New Years</p>

          <video
            controls
            width="100%"
            className="motivational-video"
            onClick={() => handleVideoClick(3)}
          >
            <source src={newyears} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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
        <p className="video-caption">Episode 1: Pilot episode</p>

          <video controls width="100%" className="migu-video">
            <source src={migu1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-container">
        <p className="video-caption">Episode 2: Fruit Fight</p>

          <video controls width="100%" className="migu-video">
            <source src={migu2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-container">
        <p className="video-caption">Episode 3: Honey Hunt</p>

          <video controls width="100%" className="migu-video">
            <source src={migu3} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default First;
