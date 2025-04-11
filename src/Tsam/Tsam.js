import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Player } from '@lottiefiles/react-lottie-player'; // Import Lottie player

import './tsam.css';
import sign from './jsons/sign.json';
import { ReactComponent as WhatsAppIcon } from './icons/whatsapp.svg';

import tsign from './pics/tsign.png';
import tjump from './pics/tjump.png';
import logoshirt from './pics/logoshirt.png';
import thinker from './pics/thinker.png';

const Tsam = () => {
  const lottieRef = useRef(null);
  const contref = useRef(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const tapTimeout = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showSlideshow, setshowSlideshow] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedImage, setSelectedImage] = useState(null);

  const whatsappNumber = "256782240185";
  const defaultMessage = "Hi, I'm interested in your Tsam shirts!";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
    setSelectedImage(null);
  };

  const handleDoubleClick = (index) => {
    setSelectedImage(selectedImage === index ? null : index);
  };
  const handleDoubleTap = (index) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      setSelectedImage(selectedImage === index ? null : index);
    }
    setLastTapTime(currentTime);
  };
  const images = [tsign, thinker, tjump, logoshirt];

  return (
    <div className="tsam-container" style={{ overflowY: 'auto', userSelect: 'none' }}>
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
          marginLeft: isMobile ? '-20px' : '0px',
          padding: isMobile ? '0 10px' : '0'
        }}
      >
        <div className="tsam-heading">
          <h1 style={{ fontSize: isMobile ? '2rem' : '2.8rem' }}>Tsam shirts</h1>
          <div className="tsam-underline"></div>
        </div>

        <div
          className="carousel-container"
          style={{
            width: isMobile ? '100%' : '70%',
            height: isMobile ? '60vh' : 'auto',
            padding: isMobile ? '20px 0' : '0'
          }}
        >
          <Swiper
            direction={isMobile ? 'vertical' : 'horizontal'}
            slidesPerView={isMobile ? 2 : 3}
            spaceBetween={isMobile ? 20 : 30}
            loop={true}
            mousewheel={true}
            navigation={!isMobile}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Mousewheel]}
            style={{
              height: '100%',
              padding: isMobile ? '20px 0' : '0'
            }}
          >
     {images.map((img, index) => (
  <SwiperSlide key={index}>
    <div
      className="slide"
        onTouchStart={() => handleDoubleTap(index)}

      onDoubleClick={() => handleDoubleClick(index)}
      onClick={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        textAlign: 'center',
        height: isMobile ? '100%' : '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        touchAction: 'manipulation',
      }}
    >
      <img
        src={img}
        alt={`Tsam shirt ${index + 1}`}
        style={{
          width: isMobile ? '80%' : '500px',
          height: 'auto',
          maxHeight: isMobile ? '80vh' : 'none',
          objectFit: 'contain',
          transition: 'transform 0.5s ease',
          display: 'block',
          margin: '0 auto',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />
      {/* WhatsApp Button only appears after double-click */}
      {selectedImage === index && (
        <button
          className="whatsapp-button"
          onClick={handleWhatsAppClick}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
             <WhatsAppIcon
            style={{
              width: '30px', // Set the width of the icon
              height: '30px', // Set the height of the icon
              marginRight: '8px',
            }}
          />
          Contact on WhatsApp
        </button>
      )}
    </div>
  </SwiperSlide>
))}

          </Swiper>
        </div>
      </div>
      <footer className="tsam-footer">
        <h3>Instructions</h3>
        <ol>
          <li>Swipe to view clothes</li>
          <li>Double tap the t-shirt you're interested in</li>
          <li>Tap the WhatsApp button</li>
        </ol>
      </footer>
    </div>
  );
};

export default Tsam;