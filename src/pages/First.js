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
import migu3 from '../anims/output_migu3.mp4';
import miguim2 from '../images/m&f.png';
import miguim3 from '../images/migu3.png';
import scistepsquare from '../images/scistepsquare.png';
import me from '../images/Rejuv dp.jpg';
import Header from "./Header";
import rejuveblack from '../images/black.png';
import me2 from '../images/samred2.png';
import me3 from '../images/Samred.jpg';
import silent from '../anims/optimized_silent.mp4';
import bball from '../anims/output_kobe7.mp4';
import youtube from '../jsons/youtube.json';
import { Player } from '@lottiefiles/react-lottie-player';

const First = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("maroon");
  const images = [me,rejuveblack,me2, rejuveprofile,me3 ]; // Add more images or videos as needed
  const images2 = [migudp, miguim2]; // Add more images or videos as needed
  const newyearsref = useRef(null);
  const redref = useRef(null);
  const silentref = useRef(null);
  const snormalref = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fontColor, setFontColor] = useState("white"); // Default font color
  const [highlightColor, setHighlightColor] = useState("yellow"); // Default highlight color
  const animref = useRef(null);

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
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
      setFontColor("black");
      setHighlightColor("maroon");
    
    } else if (video === 1){

      setMotivationalBackground("#3B102A");
      setFontColor("white");
      setHighlightColor("#F3930A");

    } else if (video === 3){

      setMotivationalBackground("#B4A88F");
      setFontColor("black");
      setHighlightColor("maroon");

    }
    else if (video === 4){
      setMotivationalBackground("#54A9E5");
      setFontColor("#42006F");
      setHighlightColor("black");
    }
    else if (video === 5){
      setMotivationalBackground("#C05E49");
      setFontColor("black");
      setHighlightColor("white");
    }
    
  };

  return (
    <div className="first-container">
      <div>
        <Header/>
      </div>
     <br/>
     <br/>
     <br/>
     <br/>

      {/* Content Section */}
      
<div className={isMobile ? "content-section2" : "content-section"}>
        {/* Left Image */}
        <>
        
        {isMobile ? (
  <div
    className={`mobile-profile ${showMore ? 'shrink' : ''}`}
  >
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
) : (
  <div 
  className="image-container">
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
)}

</>
       

        {/* Right Text */}
        <div className="text-container"> 
      <p className="left-aligned">
        Hi, I'm <span className="highlight">Sam Nkurunungi</span> creator and lead animator of 
        <span className="highlight bold"> Rejuv ,</span> a creative collective where I
       showcase animations I've have created in collaboration with other creatives
        and my students.
      </p>

      {showMore && (
        <>
          <p className="left-aligned">
            We create  <span className="highlight bold">professional animated explainers</span> and {" "}
            <span className="highlight">Lottie animations for apps and websites</span>, offering services to help businesses and individuals convey their messages effectively, and.
          </p>
          <p className="left-aligned">
            In my free time, I channel my creativity into crafting <span className="highlight bold">short, animated stories</span> that explore unique themes and characters, showcasing the limitless possibilities of animation.
          </p>
          <p className="left-aligned">
            Additionally, I share my expertise by <span className="highlight">teaching animation</span>, inspiring others to discover and develop their own creative potential. Whether you're seeking engaging explainers or looking to learn the art of animation, I'm here to help.
          </p>
          <br/>
          <p> <span className="highlight bold"> Contact me on +256 782240185</span> </p>
          <p> <span > email - rejuveanimation@gmail.com</span> </p>

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
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
        <div style={{position:'relative',width:'150px', height:'150px'}}>
        <Player ref={animref} loop={true} autoplay={true} src={youtube} />
        </div>
        <div   style={{
    marginTop: isMobile ? '10px' : '40px', // Set marginTop only when isMobile is true
  }}>
        <h2 style={{ color: fontColor }}>Animated Shorts</h2>
     
        </div>
      
        </div>
        <div>
        <p style={{ color: fontColor }} >
        There are limitless possibilities in the world of animation <span style={{ color: highlightColor }}>Limited only by your imagination. </span> Here are some of mine.
          </p>
        </div>
        </div>
       <br/>
     
        <div ref={redref}  onClick={() => handleVideoClick(1)}
  className="video-container bordered">

          <video
            controls
            width="90%"
            className="motivational-video"
            onPlay={() => handleVideoClick(1)}
          >  

            <source src={redascension} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h5> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel, May 11 2022</span></h5>

          <p style={{ color: fontColor }} >
          This animation symbolizes  essence of
          <span style={{ color: highlightColor }}> Rejuv</span> ,   which is the <span style={{ color: highlightColor }}>relentless drive to rise and take the next step. </span>
          </p>
        </div>
        <br/>
        <br/>

        <div ref={newyearsref} onClick={() => handleVideoClick(4)} className="video-container bordered">
        <h2 style={{ color: fontColor }} > Kobe Bryant Tribute </h2>

          <video
            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(4)}
          >
            <source src={bball} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h5> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel , Shane Katabazi & Maxwell Aligawesa, Dec 03 2024</span></h5>

          <p style={{ color: fontColor }} >
        This animation is   Intended to pay <span style={{ color: highlightColor }}> tribute to the late Kobe bryant </span> who died on Jan 26 2021
          </p>
        </div>
        <br/>
        <br/>
        <div ref={snormalref} onClick={() => handleVideoClick(2)} className="video-container bordered">

          <video
            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(2)}
          >
            <source src={supernormal} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h5> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel </span></h5>

<p style={{ color: fontColor }}>

This animation is designed to  <span style={{ color: highlightColor }}>inspire my animation students </span> to embrace their unique gifts and individuality.
</p>
        </div>
        <br/>
        <br/>
        <div ref={newyearsref} onClick={() => handleVideoClick(3)} className="video-container bordered">
        <p style={{ color: fontColor }} className="video-caption">New Years</p>

          <video
            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(3)}
          >
            <source src={newyears} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h5> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel </span></h5>

<p style={{ color: fontColor }}>
This animation is   Intended to  <span style={{ color: highlightColor }}> Tell the story of a new year </span> And give hope to the world.
</p>
        </div>
        <div ref={silentref} onClick={() => handleVideoClick(5)} className="video-container bordered">
        <p className="video-caption">Lip sync  / Talking animation</p>

          <video
            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(5)}
          >
            <source src={silent} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h5> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel </span></h5>

<p style={{ color: fontColor }} >
This <span style={{ color: highlightColor }}> Lip sync    </span> was a trial for animating a talking character.
</p>
        </div>
        
      </div>

      {/* Animated Stories Section */}
      <div className="animated-stories-section">
        <h1>Animated Stories</h1>
        <h2>Migu and Feathers</h2>
        <div >
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
  <h5> <span className="highlight"> Created by Nkurunungi Samuel & Sydney Wakisati </span></h5>

          <p className="story-description">
          <span className="highlight"> Migu and Feathers  is a short animated series </span> set in prehistoric times, exploring the rivalry between a boy and a young ostrich.
          </p>
        </div>
</div>
       

        <div className="video-container bordered">
        <p className="story-description">
          <span className="highlight"> Episode 1: Pilot Episode </span> Introduces the characters of the show and the birth of their rivalry.
          </p>
          <video controls width="100%" className="migu-video">
            <source src={migu1} type="video/mp4" />
            Your browser does not support the video tag.
            
          </video>
         
        </div>
        <br/>
        <br/>

        <div className="video-container bordered">
        <p className="story-description">
          <span className="highlight"> Episode 2: Fruit Fight </span> Migu looks for revenge against feathers following the events of episode 1.
          </p>
          <video controls width="100%" className="migu-video">
            <source src={migu2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        
          
        </div>
        <br/>
          <br/>
        <div className="video-container bordered">
        <p className="story-description">
          <span className="highlight"> Episode 3:  Honey Hunt </span> Migu & Feathers fight over honey and face the consequences.
          </p>
          <video controls width="100%" className="migu-video">
            <source src={migu3} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
         
        </div>
        <div  style={{
    position: 'relative',
    bottom: '0',
    left: '50%',
    transform: `translateX(${isMobile ? '-50%' : '-50%'})`,
    width: '100%',
  }} >
        <img src={rejuveblack} alt={rejuveblack} style={{width:'300px',height:'300px'}}  />
       

      </div>
      <div className="story-description">
        <p>WhatsApp - +256 782240185</p>
        <p>email - rejuveanimation@gmail.com</p>
      </div>
      </div>
    </div>
  );
};

export default First;
