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
import blackcrown from '../jsons/crown.json';

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
import keepmovingforward from'../anims/Rejuv27.mp4';

import { gsap } from "gsap";

const First = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("#440006");
  const images = [rejuveblack,rejuveprofile ]; // Add more images or videos as needed
  const images2 = [migudp, miguim2]; // Add more images or videos as needed
  const imagesb = [shanetemp, shanetemp,shanetemp]; // Add more images or videos as needed
  const xmasref = useRef(null);
  const canvasRef = useRef(null);
  const imagess = [me,me2,me3 ]; // Add more images or videos as needed
  const imagessyd = [syd1,syd2,syd3 ]; // Add more images or videos as needed
  const imageschill = [chill,chill,chill ]; // Add more images or videos as needed
  
  const butref = useRef(null);

  const newyearsref = useRef(null);
  const redref = useRef(null);
  const keepref = useRef(null);

  const silentref = useRef(null);
  const snormalref = useRef(null);
  const carolref = useRef(null);
  const wordref = useRef(null);
  const picref = useRef(null);
  const shortsref = useRef(null);
  const [logoh, setlogoh] = useState(crown);

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
  const [isLoading, setIsLoading] = useState(true);
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
  const colorPalette = {
    primary:'#440006',
    secondary:'#FFBC00',
    dark:'#000000'
  };


  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
useEffect(() => {
  if(!isLoading){
    gsap.set( wordref.current, { 
      opacity: 0, 
      y: -50 // Start 50px above their current position 
    });
    gsap.set( shortsref.current, { 
      opacity: 0, 
    });
    
    gsap.set( picref.current, { 
      opacity: 0, 
      y: -50 // Start 50px above their current position 
    });
    gsap.set( butref.current, { 
      opacity: 0, 
      y: -50 // Start 50px above their current position 
    });
  
    gsap.to(picref.current, {
      duration: 1.7,
      opacity: 1,
      y: 0, // Move to original position
      ease: "power3.inOut",
      delay: 1.7,
    });
  
    gsap.to(shortsref.current, {
      duration: 1,
      opacity: 1,
      y: 0, // Move to original position
      ease: "power3.inOut",
      delay:2.6,
    });
    gsap.to(wordref.current, {
      duration: 1.5,
      opacity: 1,
      y: 0, // Move to original position
      ease: "power4.inOut",
      delay: 1,
    });
    gsap.to(butref.current, {
      duration: 1.5,
      opacity: 1,
      y: 0, // Move to original position
      ease: "power4.inOut",
      delay: 2.6,
    });
  }
  
}, [picref,shortsref,wordref,isLoading,butref]);



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
  }, 3600);

  return () => clearTimeout(timer);
}, []);



const [playingVideo, setPlayingVideo] = useState(null); // Track the currently playing video
const videoRefs = {
  1: useRef(null), // Rejuvenation
  2: useRef(null), // The journey of a Creative
  3: useRef(null), // New Years
  4: useRef(null), // Kobe Bryant Tribute
  5: useRef(null), // Lip Sync Test
  6: useRef(null), // Merry Xmas
  7: useRef(null), // Journey Through Time
  8: useRef(null), // Carolle Skater
  9: useRef(null), // Migu & Feathers Episode 1
  10: useRef(null), // Migu & Feathers Episode 2
  11: useRef(null), // Migu & Feathers Episode 3
  12: useRef(null) // keep moving forward

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

      setMotivationalBackground("#FADDAD");
      setFontColor("black");
      setHighlightColor("maroon");
      setemojibg('#FADDAD');
      setemojistroke('white');
      setemojitxt('black');
    
    } else if (video === 1){

      setMotivationalBackground("#3B102A");
      setFontColor("white");
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
      setMotivationalBackground("#54A9E5");
      setFontColor("#42006F");
      setHighlightColor("black");
      setemojibg('#54A9E5');
      setemojistroke('white');
      setemojitxt('black');

    }
    else if (video === 5){
      setMotivationalBackground("#C05E49");
      setFontColor("black");
      setHighlightColor("white");
      setemojibg('#C05E49');
      setemojistroke('white');
      setemojitxt('black');

    }
    else if (video === 6){
      setMotivationalBackground("#812505");
      setFontColor("black");
      setHighlightColor("white");
      setemojibg('#812505');
      setemojistroke('white');
      setemojitxt('black');

    }
    else if (video === 7){
      setMotivationalBackground("#C2AD62");
      setFontColor("black");
      setHighlightColor("#531F22");
      setemojibg('#C2AD62');
      setemojistroke('#531F22');
      setemojitxt('black');

    }
  
  else if (video === 8){
    setMotivationalBackground("#887893");
    setFontColor("black");
    setHighlightColor("#531F22");
    setemojibg('#887893');
    setemojistroke('#531F22');
    setemojitxt('black');

  }
  else if (video === 12){
    setMotivationalBackground("#F5F4EB");
    setFontColor("black");
    setHighlightColor("black");
    setemojibg('#F5F4EB');
    setemojistroke('black');
    setemojitxt('black');
    setlogoh(blackcrown);
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
>      <div>
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
  autoplaySpeed={4000}
  infinite={true}
  slidesToShow={1}
  slidesToScroll={1}
  dots={true}
  fade={true}  // This enables the fade effect
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
  ref={picref}
  className="image-container">
   <Slider
  autoplay={true}
  autoplaySpeed={4000}
  infinite={true}
  slidesToShow={1}
  slidesToScroll={1}
  dots={true}
  fade={true}  // This enables the fade effect
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
        <div   ref={wordref}

         className="text-container"> 
        <p className="left-aligned">
  Welcome to <span className="highlight">Rejuv</span> —  We are a community of animators led and founded by  
   <span className="highlight bold"> Sam Nkurunungi.</span> "We work on different projects ranging from <span className="highlight"> animated short stories, animated explainers, music & lyric videos</span> and other passion projects, scroll down to view them.
  
</p>

  <p> <span className="highlight bold"> Contact us on +256 782240185</span> </p>
          <p> <span > email - rejuveanimation@gmail.com</span> </p>
          
      {showMore && (
        <>
         
          {/* <Link to="/brands">

          <button  className="read-more-btn2">
          Brand Animations & Explainers    
          </button>
          </Link> */}
          <br/>
        
          <br/>
          <p> <span className="highlight bold"> Contact us on +256 782240185</span> </p>
          <p> <span > email - rejuveanimation@gmail.com</span> </p>
          <p>
  <a 
    href="https://www.instagram.com/_rejuv_/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="highlight">
    click to view Instagram
  </a>
</p>
        </>
      )}

      {/* <button onClick={handleToggle} className="read-more-btn">
        {showMore ? "hide Contacts" : "show Contacts"}
      </button> */}
      <Link to='/profile'> 
      <br/>
      <div ref={butref}> <button 
  className="about-me-btn" 
  style={{
    color: 'black',
    backgroundColor: colorPalette.secondary
  }}
>
  Meet the founder
</button></div>
     

      </Link>
     
    </div>

      </div>

      {/* Motivational Shorts Section */}
      <div ref={shortsref}
        className="motivational-shorts-section"
        style={{ backgroundColor: motivationalBackground }}
      >
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <div style={{ position: 'relative', width: '250px', height: '150px' }}>
    <Player ref={animref} loop={true} autoplay={true} src={crown} style={{height:'200px',width:'250px'}}/>
  </div>
  
  <div style={{ marginTop: isMobile ? '10px' : '40px' }}>
    <h2 style={{ color: fontColor }}>Animated Shorts</h2>
  </div>
</div>

      
        </div>
        <div>
        <p style={{ color: fontColor }} >
        Have a look at some of our  <span style={{ color: highlightColor }}> passion projects below. </span> showcasing different themes and styles.</p> <p>  <span style={{ color: highlightColor }}>tap on a reaction below the video </span> 
        
          </p>
        </div>
        </div>
        <div ref={keepref}  className="video-container bordered">
       <h2 style={{ color: fontColor }} >1. Keep moving forward</h2>

       <p style={{ color: fontColor }}>
   Take a deep breath, 
   <span style={{ color: highlightColor }}>and keep moving forward</span> whether in time of plenty or scarcity, this too shall pass just like the mountains and lakes you have crossed in the past.
</p>

  <video
            ref={videoRefs[12]}

  preload="auto"

            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(12)}

          >
            <source src={keepmovingforward} type="video/webm" />
            Your browser does not support the video tag.
          </video>


  <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={12} />

  <h5  onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(1); }}
 
        style={{ cursor:'cell', color: 'blue' }}><span style={{ color: highlightColor }}>Created by Nkurunungi Samuel,</span><span style={{color:fontColor}}> August 7 2025</span></h5>
</div>

       <div ref={redref}  className="video-container bordered">
       <h2 style={{ color: fontColor }} >2. Rejuvenation</h2>

       <p style={{ color: fontColor }}>
   It reflects the:  
   <span style={{ color: highlightColor }}> strive to </span>  exceed your limits with every project in the creative field.
</p>

  <video
            ref={videoRefs[1]}

  preload="auto"
  controlsList="nodownload"

            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(1)}

          >
            <source src={redascension} type="video/webm" />
            Your browser does not support the video tag.
          </video>


  <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={1} />

  <h5  onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(1); }}
 
        style={{ cursor:'cell', color: 'blue' }}><span style={{ color: highlightColor }}>Created by Nkurunungi Samuel</span> <span style={{color:fontColor}}> May 11 2022</span> </h5>
</div>

        <br/>
        <br/>

        <div ref={newyearsref} onClick={() => handleVideoClick(4)} className="video-container bordered">
        <h2 style={{ color: fontColor }} >3.  Kobe Bryant Tribute </h2>

        <p style={{ color: fontColor }} >
        This animation is   Intended to pay <span style={{ color: highlightColor }}> tribute to the late Kobe bryant </span> who died on Jan 26 2020
          </p>
          <div data-vjs-player>
          <video
                      ref={videoRefs[4]}
                      controlsList="nodownload"
preload="metadata"

            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(4)}

          >
            <source src={bball} type="video/webm" />
            Your browser does not support the video tag.
          </video>
      </div>
          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={5}/>

          <span style={{ color: highlightColor, cursor: 'cell' }}>
  <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(4); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px' }}>
    Created by Nkurunungi Samuel,
  </h5>
  <h5 
    onClick={() => { handleShowPopup('Wisey',imagesb); handleVideoClick(4); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px' }}>
    Shanewise Rukundo &
  </h5>
  <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(4); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px' }}>
    Maxwell Aligawesa, 
  </h5>
</span> <span style={{color:fontColor}}>Dec 03 2024</span> 


        </div>
        <br/>
        <br/>
        <div ref={carolref} onClick={() => handleVideoClick(8)} className="video-container bordered || current-animation">
        <h2 style={{ color: fontColor }} >4.  Carolle Skater </h2>

        <p style={{ color: fontColor }}>

This animation is inspired by the talented & professional skater from Nairobi  <span style={{ color: highlightColor }}>Caroline Njeri </span> 
</p>

<div>

          <video
             ref={videoRefs[8]}
             preload="auto" // Changed from "metadata" to "auto"
             controls

            width="100%"
            className="motivational-video"
            onProgress={handleProgress}

            onPlay={() => handleVideoClick(8)}
          >
            <source src={caroline} type="video/webm" />
            Your browser does not support the video tag.
          </video>
    </div>
          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={13}/>

          <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(8); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px',color:highlightColor }}>
    Created by Nkurunungi Samuel,
  </h5>
  <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(8); }} 
    style={{ display: 'inline-block', margin: '0', paddingRight: '5px',color:highlightColor }}>
  & Njeri Caroline
   </h5>
<span style={{color:fontColor}}> Feb 23 2024</span>
        </div>
        <br/>
        <br/>
        <div ref={snormalref} onClick={() => handleVideoClick(2)} className="video-container bordered">
        <h2 style={{ color: fontColor }} >5.  The journey of a Creative </h2>

        <p style={{ color: fontColor }}>

This animation is designed to  <span style={{ color: highlightColor }}>inspire my animation students </span> to embrace their unique gifts and individuality.
</p>
          <video
             ref={videoRefs[2]}
preload="metadata"
            controls

            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(2)}
          >
            <source src={supernormal} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={6}/>

          <h5 onClick={() => { handleShowPopup('rejuv',imagess); handleVideoClick(2); }} > <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel </span><span style={{color:fontColor}}> August 9 2023</span></h5>


        </div>
        <br/>
        <br/>
        <div ref={newyearsref} onClick={() => handleVideoClick(3)} className="video-container bordered">
        <h2 style={{ color: fontColor }} className="video-caption"> 6. New Years</h2>
        <p style={{ color: fontColor }}>
This animation is   Intended to  <span style={{ color: highlightColor }}> Tell the story of a new year </span> And give hope to the world.
</p>
          <video
           ref={videoRefs[3]}
preload="metadata"
controlsList="nodownload"

            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(3)}
          >
            <source src={newyears} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={7}/>

          <h5  onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(3); }}> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel</span><span style={{color:fontColor}}> 1 Jan 2023 </span></h5>


        </div>
        <div ref={silentref} onClick={() => handleVideoClick(7)} className="video-container bordered ">
        <h2 style={{ color: fontColor }}>7. A journey through time </h2>
        <p style={{ color: fontColor }} >
Going through the different <span style={{ color: highlightColor }}> generations  </span> through time.
</p>

<video
  ref={videoRefs[7]}
  controlsList="nodownload"
  preload="metadata"
  controls
  width="100%"
  className="motivational-video"
  onPlay={() => handleVideoClick(7)}
>
  <source src={timejourney} type="video/webm" />
  Your browser does not support the video tag.
</video>

          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={12}/>

          <h5 >
            <span className="highlight" style={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
  <p 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(7); }} 
    style={{fontSize:'15px', color: highlightColor,marginRight:'10px' }}>
        Created by Nkurunungi Samuel  
         
  </p>
  <br/>
  <br/>

  <p 
    onClick={() => { handleShowPopup('Elvis',imageschill); handleVideoClick(7); }} 
    style={{fontSize:'15px', color: highlightColor }}>
       & Avuni Elvis
  </p>
</span></h5>
<span style={{color:fontColor}}>Nov 30 2023
</span>

        </div>
        <div ref={xmasref} onClick={() => handleVideoClick(6)} className="video-container bordered">
        <h2 style={{ color: fontColor }} className="video-caption">8. Merry Christmas</h2>
        <p style={{ color: fontColor }}>
This animation is   Intended to  <span style={{ color: highlightColor }}> Tell the story of a new year </span> And give hope to the world.
</p>
          <video
             ref={videoRefs[6]}
preload="metadata"

            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(6)}
          >
            <source src={xmas} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={9}/>

          <h5  onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(3); }}> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel </span><span style={{color:fontColor}}> Dec 25 2022</span></h5>


        </div>
       
        {/* <div ref={silentref} onClick={() => handleVideoClick(5)} className="video-container bordered">
        <h2 style={{ color: fontColor }}>8. lip sync test</h2>
        <p style={{ color: fontColor }} >
        This <span style={{ color: highlightColor }}> Testing </span> Lip sync
        </p>
          <video
              ref={videoRefs[5]}
preload="metadata"
controlsList="nodownload"

            controls
            width="100%"
            className="motivational-video"
            onPlay={() => handleVideoClick(5)}
          >
            <source src={silent} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={8}/>

          <h5  onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(7); }}> <span style={{ color: highlightColor }}> Created by Nkurunungi Samuel </span></h5>


        </div> */}
      </div>

      {/* Animated Stories Section */}
      <div className="animated-stories-section">
        <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
        <div style={{position:'relative',width:'350px', height:'200px',marginTop:'10px'}}>
        <Player ref={animref} loop={true} autoplay={true} src={logoh} />
        </div>
        </div>
        <br/>
        <br/>

        <h2 style={{color:'yellow'}}>Animated Stories</h2>
        <h3>Migu and Feathers</h3>
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
  <br/>
  <span className="highlight">
  <h5 
    onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(5); }} 
    style={{ display: 'inline', margin: '0', paddingRight: '5px' }}>
        Created by Nkurunungi Samuel
  </h5>
  <h5 
    onClick={() => { handleShowPopup('Waki',imagessyd); handleVideoClick(5); }} 
    style={{ display: 'inline', margin: '0', paddingRight: '5px' }}>
      & Sydney Waki
  </h5>
</span>
<br/>
<br/>

          <p className="story-description">
          <span className="highlight"> Migu and Feathers  </span> is a short animated series set in prehistoric times, exploring the rivalry between a boy and a young ostrich.
          </p>
        </div>
</div>
       

        <div className="video-container bordered">
        <p className="story-description">
          <span className="highlight"> Episode 1: Pilot Episode </span> Introduces the characters of the show and the birth of their rivalry.
          </p>
          <video 
  ref={videoRefs[9]} 
  preload="auto"  
  controlsList="nodownload"

  controls 
  width="100%" 
  className="migu-video"
  onPlay={() => handleVideoClick(9)}
>
  <source src={migu1} type="video/mp4" />
  Your browser does not support the video tag.
</video>
          <EmojiPanel backgroundColor={'black'} strokecolor={emojistroke} textcolor={'white'} vidid={9}/>

        </div>
        <br/>
        <br/>

        <div className="video-container bordered">
        <p className="story-description">
          <span className="highlight"> Episode 2: Fruit Fight </span> Migu looks for revenge against feathers following the events of episode 1.
          </p>
          <video 
  ref={videoRefs[10]} 
  preload="auto" 
  controls 
  width="100%" 
  className="migu-video"
  onPlay={() => handleVideoClick(10)}
>
  <source src={migu2} type="video/webm" />
  Your browser does not support the video tag.
</video>
          <EmojiPanel backgroundColor={'black'} strokecolor={emojistroke} textcolor={'white'} vidid={10}/>

          
        </div>
        <br/>
          <br/>
        <div className="video-container bordered">
        <p className="story-description">
          <span className="highlight"> Episode 3:  Honey Hunt </span> Migu & Feathers fight over honey and face the consequences.
          </p>
          <video 
  ref={videoRefs[11]} 
  preload="metadata" 
  controls 
  width="100%"   
  controlsList="nodownload"
  className="migu-video"
  onPlay={() => handleVideoClick(11)}
>
  <source src={migu3} type="video/webm" />
  Your browser does not support the video tag.
</video>
          <EmojiPanel backgroundColor={'black'} strokecolor={emojistroke} textcolor={'white'} vidid={11}/>

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
  </div>
    
     )}
     </>
  );
};

export default First;
