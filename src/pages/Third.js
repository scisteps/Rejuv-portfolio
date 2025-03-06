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
import redascension from '../anims/Shadow.webm';
import newyears from '../anims/optimizedNewYear.mp4';
import supernormal from '../anims/ab_optimized.webm';
import migu2 from '../anims/Migu & Feathers_optimized2.mp4';
import migu3 from '../anims/migu3.2.webm';
import miguim2 from '../images/m&f.png';
import miguim3 from '../images/migu3.png';
import scistepsquare from '../images/scistepsquare.png';
import me from '../images/Rejuv dp.jpg';
import Header from "./Header";
import rejuveblack from '../images/black.png';
import me2 from '../images/samred2.png';
import me3 from '../images/Samred.jpg';

import silent from '../anims/optimized_silent.mp4';
import bball from '../anims/improved.webm';
import youtube from '../jsons/youtube.json';
import crown from '../jsons/crown.json';
import videojs from "video.js";
import { Link } from "react-router-dom";
import "video.js/dist/video-js.css"; // Import Video.js default styles
import { Player } from '@lottiefiles/react-lottie-player';
import EmojiPanel from "../emojis/EmojiPanel";
import VideoPlayer from './VideoPlayer'; // Import the VideoPlayer component
import Mainloading from "../Loaders/Mainloading";
import Theteam from "./Theteam";
import { FaTimes } from 'react-icons/fa';
import xmas from '../videos/xmas2.webm';
import syd1 from '../images/syd1.jpg';
import syd2 from '../images/syd2.jpg';
import syd3 from '../images/syd3.jpg';
import shanetemp from '../images/shane.jpg';
import timejourney from '../anims/timejourney3.webm';
import chill from '../images/avunie.jpg';
import caroline from'../videos/Carolle.mp4';
import hero from '../still/hero.jpg';
import motion from '../still/motion.png';
import father from '../still/father.png';
import provider from '../still/father.png';
import riyadh from '../still/riyadh.jpg';
import hands from '../still/hands.png';
import overcome from '../still/overcome.png';
import faith from '../still/faith front white.jpg';
import me4 from '../still/me4.png';



const Third = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("#440006");
  const images = [me,me4,me3 ]; // Add more images or videos as needed
  const images2 = [migudp, miguim2]; // Add more images or videos as needed
  const imagesb = [shanetemp, shanetemp,shanetemp]; // Add more images or videos as needed
  const xmasref = useRef(null);
  const canvasRef = useRef(null);
  const imagess = [me,me2,me3 ]; // Add more images or videos as needed
  const imagessyd = [syd1,syd2,syd3 ]; // Add more images or videos as needed
  const imageschill = [chill,chill,chill ]; // Add more images or videos as needed

  const newyearsref = useRef(null);
  const redref = useRef(null);
  const silentref = useRef(null);
  const snormalref = useRef(null);
  const carolref = useRef(null);

  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fontColor, setFontColor] = useState("white"); // Default font color
  const [highlightColor, setHighlightColor] = useState("yellow"); // Default highlight color
  const animref = useRef(null);
  const [emojistroke, setemojistroke] = useState("white"); // Default highlight color
  const [emojitxt, setemojitxt] = useState("white"); // Default highlight color
  const [emojibg, setemojibg] = useState('#440006');
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [isContentBlurred, setIsContentBlurred] = useState(false); // To blur the background content
  const [aliass, setaliass] = useState(null); // To blur the background content
  const [imagesf, setimagesf] = useState(null); // To blur the background content
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  
  const handleShowPopup = (value,imagesb) => {
    setShowTeamPopup(true);
    setIsContentBlurred(true);
    setaliass(value); // Blurs the rest of the content
    setimagesf(imagesb)
  };

  const handleClosePopup = () => {
    setShowTeamPopup(false);
    setIsContentBlurred(false); // Removes blur from the background content
  }; 

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

const handleProgress = () => {
  if (videoRef.current) {
    const buffered = videoRefs.current.buffered;
    const duration = videoRefs.current.duration;

    if (buffered.length > 0 && duration > 0) {
      const loaded = buffered.end(buffered.length - 1); // Get the end of the last buffered range
      const percent = (loaded / duration) * 100;
      setLoadingPercentage(percent);
    }
  }
};
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
};

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 5000);

  return () => clearTimeout(timer);
}, []);



const [playingVideo, setPlayingVideo] = useState(null); // Track the currently playing video
const videoRefs = {
  1: useRef(null),
  2: useRef(null),
  3: useRef(null),
  4: useRef(null),
  6: useRef(null),
  7: useRef(null),
  8: useRef(null),
  9: useRef(null),
  10: useRef(null),


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

    Object.keys(videoRefs).forEach((key) => {
      if (parseInt(key) !== video && videoRefs[key].current) {
        videoRefs[key].current.pause();
      }
    });
  
  // Play the selected video and update the state
    if (video === 2) {

      setMotivationalBackground("#5d5f5c");
      setFontColor("black");
      setHighlightColor("maroon");
      setemojibg('#FADDAD');
      setemojistroke('white');
      setemojitxt('black');
    
    } else if (video === 1){

      setMotivationalBackground("#f1efe8");
      setFontColor("maroon");
      setHighlightColor("#F3930A");
      setemojibg('#3B102A');
      setemojistroke('white');
      setemojitxt('white');


    } else if (video === 3){

      setMotivationalBackground("#B4A88F");
      setFontColor("black");
      setHighlightColor("maroon");
      setemojibg('#B4A88F');
      setemojistroke('white');
      setemojitxt('maroon');

    }
    else if (video === 4){
      setMotivationalBackground("white");
      setFontColor("#42006F");
      setHighlightColor("black");
      setemojibg('#54A9E5');
      setemojistroke('white');
      setemojitxt('black');

    }
    else if (video === 5){
      setMotivationalBackground("#ceb69c");
      setFontColor("black");
      setHighlightColor("white");
      setemojibg('#C05E49');
      setemojistroke('white');
      setemojitxt('black');

    }
    else if (video === 6){
      setMotivationalBackground("#a9afb0");
      setFontColor("black");
      setHighlightColor("white");
      setemojibg('#812505');
      setemojistroke('white');
      setemojitxt('black');

    }
    else if (video === 7){
      setMotivationalBackground("#eeb171");
      setFontColor("black");
      setHighlightColor("#531F22");
      setemojibg('#C2AD62');
      setemojistroke('#531F22');
      setemojitxt('black');

    }
  
  else if (video === 8){
    setMotivationalBackground("#e3eae3");
    setFontColor("black");
    setHighlightColor("#531F22");
    setemojibg('#887893');
    setemojistroke('#531F22');
    setemojitxt('black');

  }
    
  };

  return (
    <>
    {isLoading? (
      <Mainloading/>
    ):(

  <div style={{userSelect:'none'}}>
   {showTeamPopup && (
        <div className="popup-overlay"   style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center', // Vertical center
          justifyContent: 'center', // Horizontal center
          zIndex: 9999, // To ensure it's on top of other content
        }}>
        <div className="popup-content">
  <FaTimes className="close-btn" onClick={handleClosePopup} />
  <span className="close-text" onClick={handleClosePopup}>Close</span> {/* Add the text here */}
  <Theteam alias={aliass} imagesa={imagesf}/>
</div>


        </div>
      )}
<div
  className="first-container"
  style={{
    filter: showTeamPopup ? 'blur(20px) brightness(50%)' : 'none', // Apply blur and reduce brightness
    transition: 'filter 0.3s ease', // Smooth transition for the blur effect
  }}
>     
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
        I am <span className="highlight">Sam Nkurunungi</span> — a graphics designer with 5 years of experience.
     "I specialize in creating visually compelling designs that bring ideas to life through creativity and precision."  
</p>


     

    </div>

      </div>

      {/* Motivational Shorts Section */}
      <div
        className="motivational-shorts-section"
        style={{ backgroundColor: motivationalBackground }}
      >
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
   
        <div   style={{
    marginTop: isMobile ? '10px' : '40px', // Set marginTop only when isMobile is true
  }}>
        <h2 style={{ color: fontColor }}>Posters</h2>
     
        </div>
      
        </div>
        <div>
    
        </div>
        </div>
     
       <div ref={redref} onClick={() => handleVideoClick(1)} className="video-container bordered">
       <h2 style={{ color: fontColor }} >1. </h2>



       <img
  src={hero} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>


</div>

        <br/>
        <br/>

        <div ref={newyearsref} onClick={() => handleVideoClick(4)} className="video-container bordered">
        <h2 style={{ color: fontColor }} >2.  </h2>

    
          <div data-vjs-player>
          <img
  src={motion} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>
      </div>

          <span style={{ color: highlightColor, cursor: 'cell' }}>
  <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(4); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px' }}>
Poster for Rejuv animated explainers  </h5>


</span>  


        </div>
        <br/>
        <br/>
        <div ref={carolref} onClick={() => handleVideoClick(8)} className="video-container bordered || current-animation">
        <h2 style={{ color: fontColor }} >3. </h2>

<div>
<img
  src={father} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>
    </div>

          <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(8); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px',color:highlightColor }}>
Poster for Father's day   </h5>


        </div>
        <br/>
        <br/>
        <div ref={snormalref} onClick={() => handleVideoClick(2)} className="video-container bordered">
        <h2 style={{ color: fontColor }} >4.   </h2>

    
<img
  src={riyadh} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>


        </div>
        <br/>
        <br/>
        <div ref={newyearsref} onClick={() => handleVideoClick(3)} className="video-container bordered">
        <h1 style={{ color: fontColor }} className="video-caption"> Tshirt Designs</h1>
  
         


        </div>
        <div ref={silentref} onClick={() => handleVideoClick(7)} className="video-container bordered ">
        <h2 style={{ color: fontColor }}>1.</h2>
    
<img
  src={hands} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>

          <h5 >
            <span className="highlight" style={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center'}}>

  <br/>
  <br/>


</span></h5>


        </div>
        <div ref={xmasref} onClick={() => handleVideoClick(6)} className="video-container bordered">
        <h2 style={{ color: fontColor }} className="video-caption">2. </h2>
    
<img
  src={overcome} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>



        </div>
       
        <div ref={silentref} onClick={() => handleVideoClick(5)} className="video-container bordered">
        <h2 style={{ color: fontColor }}>3.</h2>
      
        <img
  src={faith} // Replace with the actual image URL
  alt="Motivational Image"
  width="100%"
  className="motivational-video"
/>



        </div>
      </div>

   
    </div>
  </div>
    
     )}
     </>
  );
};

export default Third;
