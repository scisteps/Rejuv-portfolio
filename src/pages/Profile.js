import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./profile.css";
import gsap from "gsap";
import { FaHome } from "react-icons/fa";

// Import your images
import me from '../images/headshot2.jpg';
import me3 from '../images/Samred.jpg';
import me4 from '../images/forestpic.jpg';
import me5 from '../still/mountains.jpg';
import celo from '../still/celo.jpg';
import formal from '../images/me green.jpg';
import poster1 from "../still/provider.jpg";
import poster2 from "../still/riyadh.jpg";
import poster3 from "../still/bombardier.jpg";
import brochure1 from "../still/brochure1.jpg";
import brochure2 from "../still/brochure2.jpg";
import businessCard1 from "../still/bizcard1.jpg";
import businessCard2 from "../still/bizcard2.jpg";
import animation3 from "../anims/wexmas.mp4";
import animation1 from "../anims/paulisa.mp4";
import animation5 from "../videos/phsplus.webm";
import animation2 from "../anims/hcmvoice.mp4";
import animation6 from "../anims/Phs2.mp4";
import animation8 from "../videos/counterfeit.mp4";
import animation7 from "../anims/Inypay2.mp4";
import animation4 from "../anims/farming.mp4";
import animation9 from "../anims/Alphabet.mp4";

import { Link } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("animation");
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const profileHeaderRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);
  const profileTextRef = useRef(null);
  const profileImages = [me,formal,me4,me3 ];
  const posters = [poster1, poster2, poster3];
  const brochures = [brochure1, brochure2];
  const businessCards = [businessCard1, businessCard2];
  const [expandedSections, setExpandedSections] = useState({
    passion: false,
    profession: false
  });
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  // Animation data with categories
  const animations = [
    { src: animation1, category: "Fashion & design", title: "Paulisa Prints" },
    { src: animation2, category: "Technical Services", title: "HCM Provider App" },
    { src: animation3, category: "Festive Season", title: "Wetech xmas Greetings" },
    { src: animation4, category: "Agriculture", title: "GHSmartfarm" },
    { src: animation5, category: "Healthcare", title: "PHS Plus 1" },
    { src: animation6, category: "Healthcare", title: "PHS Plus 2" },
    { src: animation7, category: "Finance", title: "Inypay" },
    { src: animation8, category: "Healthcare", title: "Counterfeit Drugs Warning" },
    { src: animation9, category: "Children", title: "Song for Alphabet in Luganda" }
  ];

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP Animations
  useEffect(() => {
    gsap.set([
      profileHeaderRef.current,
      ...profileTextRef.current.children,
      tabsRef.current,
      contentRef.current
    ], { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl.to(profileHeaderRef.current, { opacity: 1, y: 0 })
      .to(profileTextRef.current.children, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6
      }, "-=0.3")
      .to(tabsRef.current, { opacity: 1, y: 0 }, "-=0.2")
      .to(contentRef.current, { opacity: 1, y: 0 }, "-=0.2");
  }, []);

  return (
    <div className="profile-container">
   <div className="home-button-wrapper">
  <Link to="/" className="home-button">
    <FaHome className="home-icon" />
    <span className="home-text">Home</span>
  </Link>
</div>
<br/>
<br/>

      {/* Profile Header with Circular Slideshow */}
      <div className="profile-header" ref={profileHeaderRef}>
        <div className="slideshow-container">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {profileImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="circle-slide">
                  <img src={image} alt={`Profile ${index + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="profile-text" ref={profileTextRef}>
  <h1>Sam Nungi</h1>
  <h2>Founder & Lead animator</h2>

  {/* Passion Section */}
  <section className="passion">
    <h3>Passion</h3>
    <p className="summary">
      Creating animations that rejuvenate minds and inspire young creatives.
    </p>
    <div className={`expandable-content ${expandedSections.passion ? 'expanded' : ''}`}>
      <p>
        I am a <span className="highlight">Ugandan from Kampala </span>with a deep passion for art and computers from a very young age,
        I used to draw comic books in my childhood years, pursued software engineering at university and built a variety of web apps & programs.
      </p>
      <p>
        During the covid pandemic I started learning graphics design and soon went on to learn animation from various international online communities eventually creating brand <span className="highlight"> 'rejuv'</span>  which is short for <span className="highlight">Rejuvenation'. </span>
      </p>
      <p>
        I started rejuv because I want to rejuvenate the minds of young viewers as they watched my animations, show them something new and fill their hearts with joy and excitement as they watch the animations I created , but most of all I did it to inspire these young minds to believe in themselves and go beyond the limits
      </p>
      <p>
        And that's why I also teach animation to young creatives who have a burning passion for animation.
      </p>
    </div>
    <button 
      className={`read-more ${expandedSections.passion ? 'expanded' : ''}`}
      onClick={() => toggleSection('passion')}
    >
      {expandedSections.passion ? 'Read Less' : 'Read More'}
    </button>
  </section>

  {/* Profession Section */}
  <section className="profession">
    <h3>Profession</h3>
    <p className="summary">
      Bridging web development and creative design to build compelling digital experiences.
    </p>
    <div className={`expandable-content ${expandedSections.profession ? 'expanded' : ''}`}>
      <p>
        As a software engineer, I specialize in building responsive web 
        applications with modern frameworks. As a graphics designer, I design compelling brand visuals & animations that effectively communicate a company's values.
      </p>
      <p> With over 7 years of professional experience, I bridge the gap between 
        <span className="highlight"> web development and creative design</span>. My unique combination of 
        coding expertise and visual design skills allows me to create solutions 
        that cut across these fields and allow them to compliment each other in a variety of ways.
      </p>
      <p className="left-aligned">
        Additionally, I share my expertise by <span className="highlight">teaching animation</span>, inspiring others to discover and develop their own creative potential. Whether you're seeking engaging explainers or looking to learn the art of animation, I'm here to help.
      </p>
      <br/>
      <p><span> email - rejuveanimation@gmail.com</span></p>
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
    </div>
    <button 
      className={`read-more ${expandedSections.profession ? 'expanded' : ''}`}
      onClick={() => toggleSection('profession')}
    >
      {expandedSections.profession ? 'Read Less' : 'Read More'}
    </button>
  </section>
</div>

      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container" ref={tabsRef}>
        <button
          className={`tab-button ${activeTab === "animation" ? "active" : ""}`}
          onClick={() => setActiveTab("animation")}
        >
          Animation
        </button>
        <button
          className={`tab-button ${activeTab === "still" ? "active" : ""}`}
          onClick={() => setActiveTab("still")}
        >
          Still Graphics
        </button>
      </div>

      {/* Content Sections */}
      <div className="profile-container" ref={contentRef}>
        {activeTab === "still" ? (
          <>
            {/* Posters Section */}
            <div className="portfolio-section">
              <h3>Posters</h3>
              <div className="grid-container">
                {posters.map((poster, index) => (
                  <div key={index} className="portfolio-item">
                    <img src={poster} alt={`Poster ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Animation Section */
          <div className="portfolio-section">
            <h3>Animated Adverts & Explainers</h3>
            <div className={`grid-container ${isMobile ? "mobile" : "desktop"}`}>
         
{animations.map((animation, index) => (
  <div key={index} className="portfolio-item">
    <div className="animation-category">
      {animation.category}
    </div>
    <div className="animation-title">
      {animation.title}
    </div>
    <video 
      controls
      ref={(el) => (videoRefs.current[index] = el)}
      onClick={() => {
        // Pause all other videos when this one is clicked
        if (playingVideo !== null && playingVideo !== index) {
          videoRefs.current[playingVideo]?.pause();
        }
        setPlayingVideo(index);
      }}
      onPause={() => {
        if (playingVideo === index) {
          setPlayingVideo(null);
        }
      }}
    >
      <source src={animation.src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
))}
            </div>
          </div>
        )}
      </div>
      <div className="home-button-wrapper">
       <Link to="/" className="home-button">
         <FaHome className="home-icon" />
         <span className="home-text">Home</span>
       </Link>
     </div>
    </div>
      
  );
};

export default Profile;