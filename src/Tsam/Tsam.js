import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import Slider from 'react-slick';

import './tsam.css';
import sign from './jsons/sign.json';
import tsign from './pics/tsign.png';
import tjump from './pics/tjump.png';
import logoshirt from './pics/logoshirt.png';
import thinker from './pics/thinker.png';

const Tsam = () => {
  const lottieRef = useRef(null);
  const sliderRef = useRef(null);
  const contref = useRef(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showSlideshow, setshowSlideshow] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedImage, setSelectedImage] = useState(null);

  const whatsappNumber = "256782240185";
  const defaultMessage = "Hi, I'm interested in your Tsam shirts!";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const imageUrls = [tsign, tjump, logoshirt, thinker];
    const loadPromises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
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

    return () => anim.destroy();
  }, [imagesLoaded]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setshowSlideshow(false);
      gsap.to(contref.current, {
        opacity: 1,
        duration: 1,
        delay: 0.2,
      });
    }, 2100);
    return () => clearTimeout(timeout);
  }, []);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
    setSelectedImage(null);
  };

  const handleDoubleClick = (index) => {
    setSelectedImage(selectedImage === index ? null : index);
  };

  const images = [tsign, thinker, tjump, logoshirt];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobile ? '5%' : '0',
    focusOnSelect: true,
    arrows: !isMobile,
    beforeChange: (current, next) => {
      gsap.to('.slick-slide img', {
        scale: isMobile ? 0.8 : 1,
        duration: 0.3,
        ease: 'power1.out'
      });
      setSelectedImage(null); // Deselect when sliding
    },
    afterChange: (current) => {
      gsap.to('.slick-center img', {
        scale: isMobile ? 1.5 : 1.3,
        duration: 0.5,
        ease: 'power4.in',
      });
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: '10%'
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '15%',
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="tsam-container" style={{ overflowY: 'auto' }}>
      {showSlideshow && (
        <div style={{ position: 'absolute', zIndex: 5 }} ref={lottieRef} className="lottie-holder" />
      )}
  
      <div
        ref={contref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          opacity: 0,
          marginTop: isMobile ? '-50px' : '-170px',
          marginLeft: isMobile ? '70px' : '0px',
          padding: isMobile ? '0 10px' : '0'
        }}
      >
        <div className="tsam-heading">
          <h1 style={{ fontSize: isMobile ? '2rem' : '2.8rem' }}>Tsam shirts</h1>
          <div className="tsam-underline"></div>
        </div>
  
        <div className="carousel-container" style={{ 
          width: isMobile ? '130%' : '80%',
          height: isMobile ? '20vh' : '60%'
        }}>
          <Slider {...settings} ref={sliderRef} className="centered-slider">
            {images.map((img, index) => (
              <div
                key={index}
                className="slide"
                onDoubleClick={() => handleDoubleClick(index)}
                style={{ position: 'relative' }}
              >
                <img
                  src={img}
                  alt={`Tsam shirt ${index + 1}`}
                  style={{
                    width: isMobile ? '100px' : '300px',
                    height: isMobile ? 'auto' : '300px',
                    maxWidth: '300px',
                    margin: '10px 10px',
                    transition: 'transform 0.5s ease',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
                {selectedImage === index && (
                  <button
                    className="whatsapp-button"
                    onClick={handleWhatsAppClick}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      padding: '10px 20px',
                      backgroundColor: 'green',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                  >
                    Contact via WhatsApp
                  </button>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Tsam;