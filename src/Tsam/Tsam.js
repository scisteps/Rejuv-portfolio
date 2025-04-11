import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import Slider from 'react-slick';

import './tsam.css';
import sign from './jsons/sign.json';
import box from './pics/box.png';
import canvas from './pics/canvas.png';
import logoshirt from './pics/logoshirt.png';
import thinkoutsweat from './pics/thinkoutsweat.png';
import tsign from './pics/tsign.png';
import thinker from './pics/thinker.png';
import tjump from './pics/tjump.png';

import brown from './pics/brown.png';

const Tsam = () => {
  const lottieRef = useRef(null);
  const sliderRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const contref = useRef(null);
  const [showSlideshow, setshowSlideshow] = useState(true);

  // Preload images during the animation
  useEffect(() => {
    const imageUrls = [tsign, tjump, logoshirt, thinker];
    const loadPromises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
  
    Promise.all(loadPromises).then(() => {
      setImagesLoaded(true);
    });
  
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: sign,
    });
  
    return () => {
      anim.destroy(); // clean up the animation when the component unmounts or effect re-runs
    };
  }, [imagesLoaded]);
  
  useEffect(() => {
  setTimeout(() => {
    setshowSlideshow(false);
      

       gsap.to(contref.current, {
    opacity: 1,
    duration: 1, // 1 second
    delay: 0.2,    // Wait for 1 second before starting the animation
  });
  }, 2100);  

    
  }, [contref]);  

    



  const images = [tsign, thinker ,tjump , logoshirt ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    focusOnSelect: true,
    beforeChange: (current, next) => {
      gsap.to('.slick-center img', {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    },
    afterChange: (current) => {
      gsap.to('.slick-center img', {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ]
  };

  return (
    <div className="tsam-container">
      {showSlideshow && (
        <div style={{ position: 'absolute', zIndex: 5 }} ref={lottieRef} className="lottie-holder" />
      )}
  
      {/* Wrap heading and carousel together */}
<div
  ref={contref}
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // ensure content is centered
    width: '100%',        // important for full width
    opacity: 0,
    marginTop: '-180px',

  }}
>
        <div className="tsam-heading">
          <h1>Tsam shirts</h1>
          <div className="tsam-underline"></div>
        </div>
  
        <div className="carousel-container">
          <Slider {...settings} ref={sliderRef} className="centered-slider">
            {images.map((img, index) => (
              <div key={index} className="slide">
                <img src={img} alt={`img-${index}`} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
  
};

export default Tsam;