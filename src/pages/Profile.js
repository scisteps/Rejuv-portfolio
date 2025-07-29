import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./profile.css";
import gsap from "gsap";
import { FaHome } from "react-icons/fa";

// Import your images
import me from '../images/Rejuv dp.jpg';
import me3 from '../images/Samred.jpg';

import me4 from '../still/me4.png';
import me5 from '../still/mountains.jpg';
import celo from '../still/celo.jpg';
import formal from '../still/formal.jpg';
import poster1 from "../still/provider.jpg";
import poster2 from "../still/riyadh.jpg";
import poster3 from "../still/bombardier.jpg";
import brochure1 from "../still/brochure1.jpg";
import brochure2 from "../still/brochure2.jpg";
import businessCard1 from "../still/bizcard1.jpg";
import businessCard2 from "../still/bizcard2.jpg";
import animation1 from "../videos/phsplus.webm";
import animation2 from "../anims/redascension.mp4";
import animation3 from "../videos/counterfeit.mp4";
import animation4 from "../videos/hcm.webm";
import animation5 from "../anims/wexmas.mp4";
import animation6 from "../anims/mothers.mp4";
import { Link } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("animation");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const profileHeaderRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);
  const profileTextRef = useRef(null);
  const profileImages = [me,formal,me4,me3 ];
  const posters = [poster1, poster2, poster3];
  const brochures = [brochure1, brochure2];
  const businessCards = [businessCard1, businessCard2];
  const animations = [animation1, animation2, animation3, animation4, animation5, animation6];

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // GSAP Animations
  useEffect(() => {
    // First hide all elements initially
    gsap.set([
      profileHeaderRef.current,
      ...profileTextRef.current.children,
      tabsRef.current,
      contentRef.current
    ], { opacity: 0, y: 20 });

    // Create timeline
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
  </Link>
</div>


      {/* Profile Header with Circular Slideshow */}
      <div className="profile-header" ref={profileHeaderRef} >
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
          <h1>Sam Nkurunungi</h1>
          <h2>Software Engineer & Graphics Designer</h2>
          <p>
            With over 7 years of professional experience, I bridge the gap between 
            <span className="highlight"> web development and creative design</span>. My unique combination of 
            coding expertise and visual design skills allows me to create solutions 
            that cut across these fields and allow them to compliment each other in a variety of ways.
          </p>
          <p>
            As a software engineer, I specialize in building responsive web 
            applications with modern frameworks. As a graphics designer, I design compelling brand visuals that effectively communicate a company’s values.
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
          <p>
  <a 
    href="https://www.instagram.com/_rejuv_/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="highlight">
    click to view Instagram
  </a>
</p>
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
      <div className="profile-container"  ref={contentRef}>
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
            <h3>Animation Work</h3>
            <div className={`grid-container ${isMobile ? "mobile" : "desktop"}`}>
              {animations.map((animation, index) => (
                <div key={index} className="portfolio-item">
                  <video controls>
                    <source src={animation} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;