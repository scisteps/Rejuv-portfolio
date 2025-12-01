import React, { useState, useEffect, useRef, useCallback } from "react";
import "./First.css"; // CSS file for styling
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"
import rejuvbanner from '../images/rejuv banner.png';
import rejuveprofile from '../images/rejuve main logo.png';
import migu1 from '../anims/m1.mp4';
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
import { Link, useNavigate } from "react-router-dom";
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
  const [showPersonalProjects, setShowPersonalProjects] = useState(false); // New state for personal projects
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
  const personalProjectsRef = useRef(null); // Ref for personal projects section
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
  const [isTripleClicked, setIsTripleClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  const navigate = useNavigate(); // For navigation

  // ... existing useEffect and other functions

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Handle Personal Projects button click
  const handlePersonalProjectsClick = () => {
    setShowPersonalProjects(true);
    
    // Scroll to personal projects section with animation
    setTimeout(() => {
      if (personalProjectsRef.current) {
        personalProjectsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Add animation to the section
        gsap.fromTo(personalProjectsRef.current, 
          { opacity: 0, y: 50 },
          {
            duration: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }
        );
      }
    }, 100);
  };

  // Handle Client Work button click
  const handleClientWorkClick = () => {
    navigate('/profile');
  };

  const handleShowPopup = (value,imagesb) => {
    setShowTeamPopup(true);
    setIsContentBlurred(true);
    setaliass(value); // Blurs the rest of the content
    setimagesf(imagesb)
  };

  const handleMobileProfileClick = () => {
    if (butref.current) {
      gsap.fromTo(butref.current, 
        { opacity: 0, y: -50 },
        {
          duration: 1.5,
          opacity: 1,
          y: 0,
          ease: "power4.inOut"
        }
      );
      setTimeout(() => {
        gsap.to(butref.current, {
          duration: 1.7,
          opacity: 0,
          ease: "power3.inOut",
        });
      
      }, 2500);
    }
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
      {isLoading ? (
        <Mainloading/>
      ) : (
        <div style={{userSelect:'none'}}>
          {showTeamPopup && (
            <div className="popup-overlay" style={{
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
                    onDoubleClick={handleMobileProfileClick}
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
                    onDoubleClick={handleMobileProfileClick}
                    ref={picref}
                    className="image-container"
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
                )}
              </>

              {/* Right Text */}
              <div ref={wordref} className="text-container"> 
                <p className="left-aligned">
                  Welcome to the world of <span className="highlight">Rejuv</span> —  A community of creatives led by <span className="highlight">Sam Nungi.</span> "We come gather occassionally to collaborate on different creative projects as well as hold  <span className="highlight"> classes </span> where we teach different skills in design & animation.<span className="highlight"> scroll down to view</span>  some of our past projects. 
                </p>

                <p> <span className="highlight bold"> Contact us via :</span> </p>
                <p> <span > email - rejuveanimation@gmail.com</span> </p>
                
                {showMore && (
                  <>
                    <br/>
                    <br/>
                    <p> <span className="highlight bold"> Contact us on +256 782240185</span> </p>
                    <p> <span > email - rejuveanimation@gmail.com</span> </p>
                    <p>
                      <a 
                        href="https://www.instagram.com/_rejuv_/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="highlight"
                      >
                        click to view Instagram
                      </a>
                    </p>
                  </>
                )}

                {/* Replace Founder button with two buttons */}
                <div style={{display:'flex',flexDirection:'row',padding:'20px'}} className="button-group">
    <button 
      className="about-me-btn2" 
      style={{
        color: '#FFBC00',
        backgroundColor: colorPalette.primary
      }}
      onClick={handlePersonalProjectsClick}
    >
      Personal Projects
    </button>
    
    <button 
      className="about-me-btn2" 
      style={{
        color: 'black',
        backgroundColor: colorPalette.secondary
      }}
      onClick={handleClientWorkClick}
    >
      Client Work
    </button>
  </div>
              </div>
            </div>

            {/* Personal Projects Section - Initially Hidden */}
            {showPersonalProjects && (
              <div ref={personalProjectsRef}>
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
                        Have a look at some of our  <span style={{ color: highlightColor }}> passion projects below. </span> showcasing different themes and styles.</p> <p>  <span style={{ color: highlightColor }}> Enjoy </span> 
                      </p>
                    </div>
                  </div>
                  
                  {/* Rest of your video sections remain the same */}
                  <div ref={keepref} className="video-container bordered">
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
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(1); }}
                      style={{ cursor:'cell', color: 'blue' }}><span style={{ color: highlightColor }}>Created by Nungi ,</span><span style={{color:fontColor}}> August 7 2025</span></h5>
                  </div>

                  {/* ... rest of your video containers remain exactly the same ... */}
                  <div ref={redref} className="video-container bordered">
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
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(1); }}
                      style={{ cursor:'cell', color: 'blue' }}><span style={{ color: highlightColor }}>Created by Nungi </span> <span style={{color:fontColor}}> May 11 2022</span> </h5>
                  </div>

                  {/* ... include all the other video containers exactly as they were ... */}

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
                  <div>
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
                          Created by Nungi 
                        </h5>
                        <h5 
                          onClick={() => { handleShowPopup('Waki',imagessyd); handleVideoClick(5); }} 
                          style={{ display: 'inline', margin: '0', paddingRight: '5px' }}>
                          & Waki
                        </h5>
                      </span>
                      <br/>
                      <br/>
                      <p className="story-description">
                        <span className="highlight"> Migu and Feathers  </span> is a short animated series set in prehistoric times, exploring the rivalry between a boy and a Crane.
                      </p>
                    </div>
                  </div>

                  {/* ... rest of your animated stories section remains the same ... */}
                  
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default First;