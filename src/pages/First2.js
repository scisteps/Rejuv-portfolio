import React, { useState, useEffect, useRef } from "react";
import "./First.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// NOTE: Autoplay module must be imported and passed to <Swiper modules={[Autoplay]} />
// or Swiper's autoplay silently does nothing (this was the bug in the Lottie carousel).
import { Autoplay } from "swiper/modules";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"
import rejuveprofile from '../images/rejuve main logo.png';
import migu1 from '../anims/m1.mp4';
import migudp from '../images/migudp.png';
import redascension from '../anims/Shadow.webm';
import newyears from '../anims/optimizedNewYear.mp4';
import supernormal from '../anims/ab_optimized.webm';
import migu2 from '../anims/Migu & Feathers_optimized2.mp4';
import migu3 from '../anims/migu3.2.webm';
import miguim2 from '../images/m&f.png';
import me from '../images/Rejuv dp.jpg';
import Header from "./Header";
import rejuveblack from '../images/black.png';
import me2 from '../images/samred2.png';
import me3 from '../images/Samred.jpg';
import silent from '../anims/optimized_silent.mp4';
import bball from '../anims/mamba.mp4';
import crown from '../jsons/newrejuvlogo.json';
import crown2 from '../jsons/crown.json';
import blackcrown from '../jsons/newrejuvlogo.json';
import { useNavigate } from "react-router-dom";
import "video.js/dist/video-js.css";
import { Player } from '@lottiefiles/react-lottie-player';
import EmojiPanel from "../emojis/EmojiPanel";
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
import keepmovingforward from'../anims/keep.mp4';
import headshot2 from '../images/sun.jpg';
import syd2 from '../images/syd2.jpg';
import avuni from '../images/avuni.jpg';

import babs from'../anims/babsworld.mp4';
import blackpanther from'../anims/bpth4.mp4';
//trailers
import guardiansvid from'../anims/Guardiansmall.mp4';
import spaceatarahvid from'../anims/Spaceatarahvidsmall.mp4';

//banners
import guardiansbanner from '../banners/guard.jpg';
import migubanner from '../banners/migu.jpg';
import atarahbanner from '../banners/Space Atarah.jpg';

//for lottie carousel
import strikecrown from '../jsons/crown.json';
import atarah from '../jsons/atarah.json';
import face from '../jsons/talker2.json';

import { gsap } from "gsap";

const First2 = () => {
  const [motivationalBackground, setMotivationalBackground] = useState("#440006");
  const [showPersonalProjects, setShowPersonalProjects] = useState(false);
  const [activeShow, setActiveShow] = useState('atarah');

  const images = [headshot2,rejuveblack,me3,rejuveprofile,syd2,avuni];
  const images2 = [migudp, miguim2];
  const imagesb = [shanetemp, shanetemp,shanetemp];
  const xmasref = useRef(null);
  const imagess = [me,me2,me3];
  const imagessyd = [syd1,syd2,syd3];
  const imageschill = [chill,chill,chill];
  const butref = useRef(null);
  const newyearsref = useRef(null);
  const redref = useRef(null);
  const keepref = useRef(null);
  const babsref = useRef(null);
  const silentref = useRef(null);
  const snormalref = useRef(null);
  const carolref = useRef(null);
  const wordref = useRef(null);
  const picref = useRef(null);
  const blackpantherref = useRef(null);
  const shortsref = useRef(null);
  const personalProjectsRef = useRef(null);
  const [logoh, setlogoh] = useState(crown);
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fontColor, setFontColor] = useState("white");
  const [highlightColor, setHighlightColor] = useState("yellow");
  const animref = useRef(null);
  const [emojistroke, setemojistroke] = useState("white");
  const [emojitxt, setemojitxt] = useState("white");
  const [emojibg, setemojibg] = useState('#440006');
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [isContentBlurred, setIsContentBlurred] = useState(false);
  const [aliass, setaliass] = useState(null);
  const [imagesf, setimagesf] = useState(null);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const navigate = useNavigate();

  // --- Dynamic Stories header: shows + fixes itself once the Stories section is reached ---
  const [showStoriesHeader, setShowStoriesHeader] = useState(false);

  // Lottie animations array for carousel
  const lottieAnimations = [
    { id: 1, animation: strikecrown, name: "Rejuv Crown" },
    { id: 2, animation: atarah, name: "Space Atarah" },
    { id: 3, animation: face, name: "Character" }
  ];

  // Show data for the fixed bar with actual banner images - REORDERED: Space Atarah first, then Guardians, then Migu
  const shows = [
    { id: 'atarah', name: 'Space Atarah', banner: atarahbanner },
    { id: 'guardians', name: 'Guardians of Nature', banner: guardiansbanner },
    { id: 'migu', name: 'Migu and Feathers', banner: migubanner }
  ];

  // Content for each show with unique video IDs for each episode
  const showContent = {
    atarah: {
      title: "Space Atarah",
      description: "The adventures of Atarah in space with her companions.",
      episodes: [
        { title: "Trailer", description: "A preview of the short film in the making.", video: spaceatarahvid, videoId: 15 }
      ]
    },
    guardians: {
      title: "Guardians of Nature",
      description: "Follow the adventures of Blaze and the guardians of nature. based on comics by Cathy Nsibirwa",
      episodes: [
        { title: "Trailer:", description: "A Sneakpeak of guardians of nature shortfilm still in development.", video: guardiansvid, videoId: 16 }
      ]
    },
    migu: {
      title: "Migu and Feathers",
      description: "A short animated series set in prehistoric times, exploring the rivalry between a boy and a Crane.",
      episodes: [
        { title: "Episode 1: Pilot Episode", description: "Introduces the characters of the show and the birth of their rivalry.", video: migu1, videoId: 9 },
        { title: "Episode 2: Fruit Fight", description: "Migu looks for revenge against feathers following the events of episode 1.", video: migu2, videoId: 10 },
        { title: "Episode 3: Honey Hunt", description: "Migu & Feathers fight over honey and face the consequences.", video: migu3, videoId: 11 }
      ]
    }
  };

  const colorPalette = {
    primary:'#440006',
    secondary:'#FFBC00',
    dark:'#000000'
  };

  // Handle Personal Projects button click
  const handlePersonalProjectsClick = () => {
    setShowPersonalProjects(true);
    setTimeout(() => {
      if (personalProjectsRef.current) {
        personalProjectsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
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

  const handleClientWorkClick = () => {
    navigate('/profile');
  };

  const handleShowPopup = (value,imagesb) => {
    setShowTeamPopup(true);
    setIsContentBlurred(true);
    setaliass(value);
    setimagesf(imagesb);
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
      }, 2200);
    }
  };

  const handleClosePopup = () => {
    setShowTeamPopup(false);
    setIsContentBlurred(false);
  };

  const handleShowChange = (showId) => {
    setActiveShow(showId);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if(!isLoading){
      gsap.set(wordref.current, { opacity: 0, y: -50 });
      gsap.set(shortsref.current, { opacity: 0 });
      gsap.set(picref.current, { opacity: 0, y: -50 });
      gsap.set(butref.current, { opacity: 0, y: -50 });
    
      gsap.to(picref.current, {
        duration: 1.7,
        opacity: 1,
        y: 0,
        ease: "power3.inOut",
        delay: 1,
      });
      gsap.to(shortsref.current, {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power3.inOut",
        delay:2.6,
      });
      gsap.to(wordref.current, {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: "power4.inOut",
        delay: 0.5,
      });
    }
  }, [picref,shortsref,wordref,isLoading,butref]);

  const handleProgress = () => {
    if (videoRef.current) {
      const buffered = videoRef.current.buffered;
      const duration = videoRef.current.duration;
      if (buffered.length > 0 && duration > 0) {
        const loaded = buffered.end(buffered.length - 1);
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
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // FIXED: Dynamic Stories header visibility - using scroll listener with throttling
  useEffect(() => {
    if (!showPersonalProjects) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const storiesSection = document.getElementById('stories-section');
          if (storiesSection) {
            const rect = storiesSection.getBoundingClientRect();
            // Show header when the top of stories section reaches or passes the top of viewport
            if (rect.top <= 0) {
              setShowStoriesHeader(true);
            } else {
              setShowStoriesHeader(false);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showPersonalProjects]);

  const videoRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
    6: useRef(null),
    7: useRef(null),
    8: useRef(null),
    9: useRef(null),
    10: useRef(null),
    11: useRef(null),
    12: useRef(null),
    13: useRef(null),
    14: useRef(null),
    15: useRef(null), // Space Atarah Trailer
    16: useRef(null)  // Guardians Trailer
  };

  const handleVideoClick = (video) => {
    Object.keys(videoRefs).forEach((key) => {
      if (parseInt(key) !== video && videoRefs[key].current) {
        videoRefs[key].current.pause();
      }
    });
  
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
    } else if (video === 4){
      setMotivationalBackground("#54A9E5");
      setFontColor("#42006F");
      setHighlightColor("black");
      setemojibg('#54A9E5');
      setemojistroke('white');
      setemojitxt('black');
    } else if (video === 5){
      setMotivationalBackground("#C05E49");
      setFontColor("black");
      setHighlightColor("white");
      setemojibg('#C05E49');
      setemojistroke('white');
      setemojitxt('black');
    } else if (video === 6){
      setMotivationalBackground("#812505");
      setFontColor("black");
      setHighlightColor("white");
      setemojibg('#812505');
      setemojistroke('white');
      setemojitxt('black');
    } else if (video === 7){
      setMotivationalBackground("#C2AD62");
      setFontColor("black");
      setHighlightColor("#531F22");
      setemojibg('#C2AD62');
      setemojistroke('#531F22');
      setemojitxt('black');
    } else if (video === 8){
      setMotivationalBackground("#887893");
      setFontColor("black");
      setHighlightColor("#531F22");
      setemojibg('#887893');
      setemojistroke('#531F22');
      setemojitxt('black');
    } else if (video === 12){
      setMotivationalBackground("#F5F4EB");
      setFontColor("black");
      setHighlightColor("black");
      setemojibg('#F5F4EB');
      setemojistroke('black');
      setemojitxt('black');
      setlogoh(blackcrown);
    } else if (video === 13){
      setMotivationalBackground("#E8AC6D");
      setFontColor("black");
      setHighlightColor("black");
      setemojibg('#E8AC6D');
      setemojistroke('black');
      setemojitxt('black');
      setlogoh(blackcrown);
    } else if (video === 14){
      setMotivationalBackground("#1A1924");
      setFontColor("#A04EF2");
      setHighlightColor("white");
      setemojibg('#1A1924');
      setemojistroke('black');
      setemojitxt('white');
      setlogoh(blackcrown);
    } else if (video === 15){
      // Space Atarah video - custom colors
      setMotivationalBackground("#0a0a2e");
      setFontColor("#FF6B6B");
      setHighlightColor("#4ECDC4");
      setemojibg('#0a0a2e');
      setemojistroke('#4ECDC4');
      setemojitxt('#FF6B6B');
    } else if (video === 16){
      // Guardians video - custom colors
      setMotivationalBackground("#1a3a1a");
      setFontColor("#7CFC00");
      setHighlightColor("#FFD700");
      setemojibg('#1a3a1a');
      setemojistroke('#FFD700');
      setemojitxt('#7CFC00');
    }
  };

  return (
    <>
      <style>{`
        @keyframes rejuv-glow-pulse {
          0%, 100% { box-shadow: 0 0 14px rgba(255,188,0,0.35), 0 4px 20px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 26px rgba(255,188,0,0.65), 0 4px 24px rgba(0,0,0,0.55); }
        }
        .rejuv-professional-card {
          animation: rejuv-glow-pulse 3s ease-in-out infinite;
        }

        @keyframes rejuv-header-slide-down {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rejuv-nav-item-in {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rejuv-stories-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 28px;
          background: linear-gradient(180deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.9) 100%);
          border-bottom: 2px solid #FFBC00;
          box-shadow: 0 4px 24px rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          opacity: 0;
          transform: translateY(-100%);
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .rejuv-stories-header.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          pointer-events: auto !important;
          animation: rejuv-header-slide-down 0.5s ease;
        }
        .rejuv-stories-header__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #FFBC00;
          font-weight: bold;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .rejuv-stories-header__brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FFBC00;
          box-shadow: 0 0 10px rgba(255,188,0,0.9);
        }
        .rejuv-stories-header__nav {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .rejuv-stories-header__nav-item {
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          border: 2px solid transparent;
          font-size: 14px;
          font-weight: 500;
          background: rgba(255,255,255,0.05);
          transition: all 0.25s ease;
          opacity: 0;
          transform: translateY(-14px);
        }
        .rejuv-stories-header.visible .rejuv-stories-header__nav-item {
          animation: rejuv-nav-item-in 0.45s ease forwards;
        }
        .rejuv-stories-header.visible .rejuv-stories-header__nav-item:nth-child(1) { animation-delay: 0.05s; }
        .rejuv-stories-header.visible .rejuv-stories-header__nav-item:nth-child(2) { animation-delay: 0.15s; }
        .rejuv-stories-header.visible .rejuv-stories-header__nav-item:nth-child(3) { animation-delay: 0.25s; }
        .rejuv-stories-header__nav-item:hover {
          background: rgba(255,188,0,0.15);
        }
        .rejuv-stories-header__nav-item.active {
          background: #FFBC00;
          color: black;
          border-color: #FFBC00;
          font-weight: bold;
        }

        @keyframes rejuv-show-content-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rejuv-show-content {
          animation: rejuv-show-content-in 0.6s ease both;
        }
        @keyframes rejuv-banner-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .rejuv-show-banner {
          animation: rejuv-banner-in 0.7s ease both;
        }
        @keyframes rejuv-episode-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .rejuv-episode-card {
          animation: rejuv-episode-in 0.55s ease both;
        }

        @media (max-width: 768px) {
          .rejuv-stories-header {
            padding: 8px 10px;
            flex-direction: row;
            align-items: center;
            gap: 6px;
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .rejuv-stories-header__brand {
            font-size: 12px;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .rejuv-stories-header__brand-dot {
            width: 8px;
            height: 8px;
          }
          .rejuv-stories-header__nav {
            display: flex;
            gap: 4px;
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            flex: 1;
          }
          .rejuv-stories-header__nav-item {
            padding: 4px 10px;
            font-size: 10px;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }

        @media (max-width: 480px) {
          .rejuv-stories-header {
            padding: 6px 8px;
          }
          .rejuv-stories-header__brand {
            font-size: 10px;
          }
          .rejuv-stories-header__nav-item {
            padding: 3px 8px;
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .project-card { width: 100% !important; }
        }
      `}</style>

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
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}>
              <div className="popup-content">
                <FaTimes className="close-btn" onClick={handleClosePopup} />
                <span className="close-text" onClick={handleClosePopup}>Close it</span>
                <Theteam alias={aliass} imagesa={imagesf}/>
              </div>
            </div>
          )}

          {/* Dynamic Stories header - MOVED OUTSIDE the conditional rendering so it can be fixed */}
          {showPersonalProjects && (
            <div className={`rejuv-stories-header ${showStoriesHeader ? 'visible' : ''}`}>
              <div className="rejuv-stories-header__brand">
                <span className="rejuv-stories-header__brand-dot" />
                Rejuv Stories
              </div>
              <div className="rejuv-stories-header__nav">
                {shows.map((show) => (
                  <div
                    key={show.id}
                    className={`rejuv-stories-header__nav-item ${activeShow === show.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveShow(show.id);
                      // Scroll to stories section when clicking
                      const storiesSection = document.getElementById('stories-section');
                      if (storiesSection) {
                        storiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    {show.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div
            className="first-container"
            style={{
              filter: showTeamPopup ? 'blur(20px) brightness(50%)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          >      
            <div>
              {showPersonalProjects && <Header />}
            </div>
            <br/><br/><br/><br/>

            {/* Content Section with Cards */}
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
                      fade={true}
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
                      fade={true}
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

              {/* Right Text with Cards */}
              <div ref={wordref} className="text-container"> 
                <p className="left-aligned">
                  Step into a world of animation with <span className="highlight">Rejuv </span> — We create 2d animated shows and shorts. Led by <span className="highlight">Sam Nungi</span>, we create 2d animations & motion graphics in adobe aftereffects and blender greasepencil. We also create a variety of <span className="highlight">Lottie animations. </span> <p>Here is some of our work, enjoy !! </p> 
                </p>

                {showMore && (
                  <>
                    <br/><br/>
                    <p> <span> email - rejuveanimation@gmail.com</span> </p>
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

                {/* Cards instead of buttons */}
                <div style={{display:'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', padding: '20px', justifyContent: 'center'}}>
                  {/* Rejuv Projects Card */}
                  <div 
                    className="project-card"
                    style={{
                      backgroundColor: colorPalette.primary,
                      color: '#FFBC00',
                      borderRadius: '15px',
                      padding: '20px',
                      width: isMobile ? '100%' : '250px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      border: '2px solid #FFBC00'
                    }}
                    onClick={handlePersonalProjectsClick}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 30px rgba(255,188,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                    }}
                  >
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{
                        width: '100%', 
                        maxWidth: '200px',
                        aspectRatio: '1/1',
                        margin: '0 auto 10px auto',
                        overflow: 'hidden',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0,0,0,0.2)'
                      }}>
                        <Swiper
                          modules={[Autoplay]}
                          spaceBetween={0}
                          slidesPerView={1}
                          autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                          }}
                          loop={true}
                          style={{height: '100%', width: '100%'}}
                        >
                          {lottieAnimations.map((item) => (
                            <SwiperSlide key={item.id} style={{height: '100%', width: '100%'}}>
                              <Player
                                autoplay
                                loop
                                src={item.animation}
                                style={{
                                  height: '100%', 
                                  width: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                      <h3 style={{margin:'0', textAlign:'center', fontWeight:'bold'}}>Rejuv Projects</h3>
                      <p style={{margin:'5px 0 0 0', fontSize:'14px', opacity:'0.8', textAlign:'center'}}>Click to view</p>
                    </div>
                  </div>

                  {/* Professional Work Card */}
                  <div 
                    className="project-card rejuv-professional-card"
                    style={{
                      backgroundColor: '#0a0a0a',
                      color: '#FFBC00',
                      borderRadius: '15px',
                      padding: '20px',
                      width: isMobile ? '100%' : '250px',
                      cursor: 'pointer',
                      boxShadow: '0 0 14px rgba(255,188,0,0.35), 0 4px 20px rgba(0,0,0,0.5)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      border: '2px solid #FFBC00'
                    }}
                    onClick={handleClientWorkClick}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 32px rgba(255,188,0,0.75), 0 6px 30px rgba(0,0,0,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(255,188,0,0.35), 0 4px 20px rgba(0,0,0,0.5)';
                    }}
                  >
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'180px'}}>
                      <div style={{fontSize:'80px', marginBottom:'10px'}}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FFBC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{filter:'drop-shadow(0 0 6px rgba(255,188,0,0.8))'}}>
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </div>
                      <h3 style={{margin:'0', textAlign:'center', fontWeight:'bold', textShadow:'0 0 10px rgba(255,188,0,0.6)'}}>Professional Work</h3>
                      <p style={{margin:'5px 0 0 0', fontSize:'14px', opacity:'0.85', textAlign:'center'}}>View client projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Projects Section */}
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
                          <Player ref={animref} loop={true} autoplay={true} src={crown2} style={{height:'200px',width:'250px'}}/>
                        </div>
                        <div style={{ marginTop: isMobile ? '10px' : '40px' }}>
                          <h2 style={{ color: fontColor }}>Animated Shorts</h2>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p style={{ color: fontColor }}>
                        Have a look at some of our <span style={{ color: highlightColor }}> passion projects below. </span> showcasing different themes and styles.
                      </p>
                      <p> <span style={{ color: highlightColor }}> Enjoy </span> </p>
                    </div>
                  </div>
               
                  {/* Keep Moving Forward */}
                  <div ref={keepref} className="video-container bordered">
                    <h2 style={{ color: fontColor }}>1. Keep moving forward</h2>
                    <p style={{ color: fontColor }}>
                      Take a deep breath, <span style={{ color: highlightColor }}>and keep moving forward</span> whether in time of plenty or scarcity, this too shall pass just like the mountains and lakes you have crossed in the past.
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
                      style={{ cursor:'cell', color: 'blue' }}>
                      <span style={{ color: highlightColor }}>Created by Nungi Sam,</span>
                      <span style={{color:fontColor}}> August 7 2025</span>
                    </h5>
                  </div>

                  {/* Black Panther Animation */}
                  <div ref={blackpantherref} className="video-container bordered">
                    <h2 style={{ color: fontColor }}>2. Black Panther Animation</h2>
                    <p style={{ color: fontColor }}>
                      Inspired by Marvel's <span style={{ color: highlightColor }}>black panther.</span>
                    </p>
                    <video
                      ref={videoRefs[14]}
                      preload="auto"
                      controls
                      width="100%"
                      className="motivational-video"
                      onPlay={() => handleVideoClick(14)}
                    >
                      <source src={blackpanther} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={14} />
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(14); }}
                      style={{ cursor:'cell', color: 'blue' }}>
                      <span style={{ color: highlightColor }}>Created by Nungi Sam,</span>
                      <span style={{color:fontColor}}> December 14 2025</span>
                    </h5>
                  </div>

                  {/* Rejuvenation */}
                  <div ref={redref} className="video-container bordered">
                    <h2 style={{ color: fontColor }}>3. Rejuvenation</h2>
                    <p style={{ color: fontColor }}>
                      It reflects the: <span style={{ color: highlightColor }}> strive to </span> exceed your limits with every project in the creative field.
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
                      style={{ cursor:'cell', color: 'blue' }}>
                      <span style={{ color: highlightColor }}>Created by Nungi Sam</span>
                      <span style={{color:fontColor}}> May 11 2022</span>
                    </h5>
                  </div>
                  <br/><br/>

                  {/* Kobe Bryant Tribute */}
                  <div ref={newyearsref} onClick={() => handleVideoClick(4)} className="video-container bordered">
                    <h2 style={{ color: fontColor }}>4. Kobe Bryant Tribute</h2>
                    <p style={{ color: fontColor }}>
                      This animation is Intended to pay <span style={{ color: highlightColor }}> tribute to the late Kobe bryant </span> who died on Jan 26 2020
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={5} />
                    <span style={{ color: highlightColor, cursor: 'cell' }}>
                      <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(4); }} 
                        style={{ display: 'inline-block', margin: '0', paddingRight: '5px' }}>
                        Created by Nungi Sam,
                      </h5>
                      <h5 onClick={() => { handleShowPopup('Wisey',imagesb); handleVideoClick(4); }} 
                        style={{ display: 'inline-block', margin: '0', paddingRight: '5px' }}>
                        Shanewise Rukundo &
                      </h5>
                    </span>
                    <span style={{color:fontColor}}>Dec 03 2024</span>
                  </div>
                  <br/><br/>

                  {/* Carolle Skater */}
                  <div ref={carolref} onClick={() => handleVideoClick(8)} className="video-container bordered || current-animation">
                    <h2 style={{ color: fontColor }}>5. Carolle Skater</h2>
                    <p style={{ color: fontColor }}>
                      This animation is inspired by the talented & professional skater from Nairobi <span style={{ color: highlightColor }}>Caroline Njeri </span>
                    </p>
                    <div>
                      <video
                        ref={videoRefs[8]}
                        preload="auto"
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={13} />
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(8); }} 
                      style={{ display: 'inline-block', margin: '0', paddingRight: '5px', color:highlightColor }}>
                      Created by Nungi Sam,
                    </h5>
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(8); }} 
                      style={{ display: 'inline-block', margin: '0', paddingRight: '5px', color:highlightColor }}>
                      & Njeri Caroline
                    </h5>
                    <span style={{color:fontColor}}> Feb 23 2024</span>
                  </div>
                  <br/><br/>

                  {/* The journey of a Creative */}
                  <div ref={snormalref} onClick={() => handleVideoClick(2)} className="video-container bordered">
                    <h2 style={{ color: fontColor }}>6. The journey of a Creative</h2>
                    <p style={{ color: fontColor }}>
                      This animation is designed to <span style={{ color: highlightColor }}>inspire my animation students </span> to embrace their unique gifts and individuality.
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={6} />
                    <h5 onClick={() => { handleShowPopup('rejuv',imagess); handleVideoClick(2); }}>
                      <span style={{ color: highlightColor }}> Created by Nungi Sam </span>
                      <span style={{color:fontColor}}> August 9 2023</span>
                    </h5>
                  </div>
                  <br/><br/>

                  {/* New Years */}
                  <div ref={newyearsref} onClick={() => handleVideoClick(3)} className="video-container bordered">
                    <h2 style={{ color: fontColor }} className="video-caption">7. New Years</h2>
                    <p style={{ color: fontColor }}>
                      This animation is Intended to <span style={{ color: highlightColor }}> Tell the story of a new year </span> And give hope to the world.
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={7} />
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(3); }}>
                      <span style={{ color: highlightColor }}> Created by Nungi Sam</span>
                      <span style={{color:fontColor}}> 1 Jan 2023 </span>
                    </h5>
                  </div>

                  {/* A journey through time */}
                  <div ref={silentref} onClick={() => handleVideoClick(7)} className="video-container bordered ">
                    <h2 style={{ color: fontColor }}>8. A journey through time</h2>
                    <p style={{ color: fontColor }}>
                      Going through the different <span style={{ color: highlightColor }}> generations </span> through time.
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={12} />
                    <h5>
                      <span className="highlight" style={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <p onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(7); }} 
                          style={{fontSize:'15px', color: highlightColor,marginRight:'10px' }}>
                          Created by Nungi Sam  
                        </p>
                        <br/><br/>
                        <p onClick={() => { handleShowPopup('Elvis',imageschill); handleVideoClick(7); }} 
                          style={{fontSize:'15px', color: highlightColor }}>
                          & Avuni Elvis
                        </p>
                      </span>
                    </h5>
                    <span style={{color:fontColor}}>Nov 30 2023</span>
                  </div>

                  {/* Merry Christmas */}
                  <div ref={xmasref} onClick={() => handleVideoClick(6)} className="video-container bordered">
                    <h2 style={{ color: fontColor }} className="video-caption">9. Merry Christmas</h2>
                    <p style={{ color: fontColor }}>
                      This animation is Intended to <span style={{ color: highlightColor }}> Tell the story of a new year </span> And give hope to the world.
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={9} />
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(3); }}>
                      <span style={{ color: highlightColor }}> Created by Nungi Sam </span>
                      <span style={{color:fontColor}}> Dec 25 2022</span>
                    </h5>
                  </div>

                  {/* Lip sync test */}
                  <div ref={silentref} onClick={() => handleVideoClick(5)} className="video-container bordered">
                    <h2 style={{ color: fontColor }}>10. Lip sync test</h2>
                    <p style={{ color: fontColor }}>
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
                    <EmojiPanel backgroundColor={emojibg} strokecolor={emojistroke} textcolor={emojitxt} vidid={8} />
                    <h5 onClick={() => { handleShowPopup('Rejuv',imagess); handleVideoClick(7); }}>
                      <span style={{ color: highlightColor }}> Created by Nungi Sam </span>
                    </h5>
                  </div>
                </div>

                {/* Animated Stories Section with Fixed Bar */}
                <div id="stories-section" style={{ position: 'relative', minHeight: '100vh' }}>
                  {/* Fixed Navigation Bar - Sticky to bottom of stories section */}
                  <div style={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 100,
                    backgroundColor: '#1a1a1a',
                    borderTop: '3px solid #FFBC00',
                    padding: '10px 20px',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: isMobile ? '10px' : '30px',
                    flexWrap: 'wrap'
                  }}>
                    {shows.map((show) => (
                      <div
                        key={show.id}
                        onClick={() => handleShowChange(show.id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: activeShow === show.id ? '#FFBC00' : 'transparent',
                          color: activeShow === show.id ? 'black' : 'white',
                          transition: 'all 0.3s ease',
                          fontWeight: activeShow === show.id ? 'bold' : 'normal',
                          border: activeShow === show.id ? '2px solid #FFBC00' : '2px solid transparent',
                          textAlign: 'center',
                          fontSize: isMobile ? '12px' : '16px'
                        }}
                        onMouseEnter={(e) => {
                          if (activeShow !== show.id) {
                            e.currentTarget.style.backgroundColor = 'rgba(255,188,0,0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeShow !== show.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {show.name}
                      </div>
                    ))}
                  </div>

                  {/* Stories Content */}
                  <div className="animated-stories-section" style={{ paddingBottom: '80px' }}>
                    <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
                      <div style={{position:'relative',width:'350px', height:'200px',marginTop:'10px'}}>
                        <Player ref={animref} loop={true} autoplay={true} src={crown2} />
                      </div>
                    </div>
                    <br/><br/>

                    <h2 style={{color:'yellow'}}>Animated Stories</h2>

                    {/* Show content: keyed by activeShow so it replays a fade/slide-in
                        animation every time the person switches shows. */}
                    <div key={activeShow} className="rejuv-show-content">
                      {/* Show Banner - Now with proper image display */}
                      <div className="rejuv-show-banner" style={{
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '20px auto',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        aspectRatio: '16/9',
                        backgroundColor: '#2a2a2a',
                        position: 'relative'
                      }}>
                        <img 
                          src={shows.find(s => s.id === activeShow)?.banner} 
                          alt={showContent[activeShow]?.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            // If image fails to load, show a fallback
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            parent.style.backgroundColor = '#1a1a2e';
                            parent.style.display = 'flex';
                            parent.style.alignItems = 'center';
                            parent.style.justifyContent = 'center';
                            parent.innerHTML = `
                              <div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:#FFBC00;font-size:24px;background:linear-gradient(135deg,#1a1a2e,#16213e);padding:20px;text-align:center;">
                                <div>
                                  <div style="font-size:48px;margin-bottom:10px;">🎬</div>
                                  ${showContent[activeShow]?.title || 'No Banner Available'}
                                </div>
                              </div>
                            `;
                          }}
                        />
                      </div>

                      <h3 style={{color:'white', marginTop: '20px'}}>{showContent[activeShow]?.title}</h3>
                      <p style={{color:'#ccc', maxWidth: '800px', margin: '10px auto'}}>
                        {showContent[activeShow]?.description}
                      </p>

                      {/* Episodes - Using unique video IDs for each episode */}
                      {showContent[activeShow]?.episodes.map((episode, index) => (
                        <div
                          key={index}
                          className="video-container bordered rejuv-episode-card"
                          style={{ marginTop: '30px', animationDelay: `${0.1 + index * 0.12}s` }}
                        >
                          <p className="story-description">
                            <span className="highlight">{episode.title}</span> - {episode.description}
                          </p>
                          <video 
                            ref={videoRefs[episode.videoId]}
                            preload="auto"  
                            controlsList="nodownload"
                            controls 
                            width="100%" 
                            className="migu-video"
                            onPlay={() => handleVideoClick(episode.videoId)}
                          >
                            <source src={episode.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <EmojiPanel backgroundColor={'black'} strokecolor={emojistroke} textcolor={'white'} vidid={episode.videoId} />
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{
                      position: 'relative',
                      bottom: '0',
                      left: '50%',
                      transform: `translateX(${isMobile ? '-50%' : '-50%'})`,
                      width: '100%',
                      marginTop: '50px'
                    }}>
                      <img src={rejuveblack} alt={rejuveblack} style={{width:'300px',height:'300px'}} />
                    </div>
                    <div className="story-description">
                      <p>email - rejuveanimation@gmail.com</p>
                      <p><h3>Scisteps UG</h3></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default First2;