import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Player } from '@lottiefiles/react-lottie-player';

import './tsam.css';
import sign from './jsons/sign.json';
import { ReactComponent as WhatsAppIcon } from './icons/whatsapp.svg';

import signedtshirt from './pics/tsign.png';
import signedsweatshirt from './pics/tjump.png';
import tshirtwithlogo from './pics/logoshirt.png';
import thinkoutofbox from './pics/thinker.png';
import fridayfeeling from './pics/fridayfeeling.png';
import weekend from './pics/weekend.png';
import tshirtboxblue from './pics/tshirt box blue.jpg';
import tshirtboxpink from './pics/tshirt box pink.jpg';
import tshirtcanvaswhite from './pics/tshirt canvas white.jpg';
import tshirtcanvaswhite2 from './pics/tshirt canvas white2.jpg';
import tshirtlogopink from './pics/tshirt logo pink.jpg';
import tshirtlogowhite from './pics/tshirt logo white.jpg';
import tshirtlogoyellow from './pics/tshirt logo yellow.jpg';
import tshirtlogobigpink from './pics/tshirt logobig pink.jpg';
import tshirtsignblue from './pics/tshirt sign blue.jpg';
import tshirtsignpink from './pics/tshirt sign pink.jpg';
import tshirtsignyellow from './pics/tshirt sign yellow.jpg';
import sweatshirtsignpink from './pics/sweatshirt sign pink.jpg';
import sweatshirtboxyellow from './pics/sweatshirt box yellow.jpg';
import sweatshirtlogopink from './pics/sweatshirt sign pink.jpg';
import sweatshirtlogoyellow from './pics/sweatshirt logo yellow.jpg';
import sweatshirtsignred from './pics/sweatshirt sign red.jpg';
import sweatshirtsigndarkblue from './pics/sweatshirt sign darkblue.jpg';
import logosweatshirt from './pics/sweatshirt logo blue.jpg';
import capsignblue from './pics/cap sign blue.jpg';
import capsigngreen from './pics/cap sign green.jpg';
import capsign from './pics/cap sign grey.jpg';
import caplogo from './pics/cap sign lightblue.jpg';
import caplogopink from './pics/cap sign pink.jpg';
import capsignred from './pics/cap sign red.jpg';
import sweatshirtbox from './pics/sweatshirt box blue.jpg';
import sweatshirtboxred from './pics/sweatshirt outbox red.jpg';

// Color variants mapping
const colorVariants = {
  signedtshirt: [signedtshirt, tshirtsignblue, tshirtsignpink, tshirtsignyellow],
  tshirtwithlogo: [tshirtwithlogo, tshirtlogowhite, tshirtlogoyellow, tshirtlogopink],
  thinkoutofbox: [thinkoutofbox, tshirtboxblue, tshirtboxpink],
  fridayfeeling: [fridayfeeling],
  weekend: [weekend],
  
  signedsweatshirt: [signedsweatshirt, sweatshirtsignpink, sweatshirtsigndarkblue, sweatshirtsignred],
  logosweatshirt: [logosweatshirt, sweatshirtlogopink, sweatshirtlogoyellow],
  sweatshirtbox: [sweatshirtbox, sweatshirtboxred, sweatshirtboxyellow],

  designercap: [capsign, capsignred, capsigngreen, capsignblue],
  weekendcap: [caplogo, caplogopink],
  casualcap: [capsign, capsignred]
};

const Tsam = () => {
  const lottieRef = useRef(null);
  const contref = useRef(null);
  const footeref = useRef(null);

  const [lastTapTime, setLastTapTime] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showSlideshow, setshowSlideshow] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('tshirts');
  const [colorIndexes, setColorIndexes] = useState({});

  const whatsappNumber = "256782240185";

  // Tab colors
  const tabColors = {
    tshirts: '#7d99c4',
    jumpers: '#cbb4a4',
    caps: '#9fedd3'
  };

  // Category colors
  const categoryColors = {
    premium: '#cbb4a4',
    economy: '#7d99c4'
  };

  // Fixed prices by product type
  const prices = {
    tshirts: {
      economy: '20,000/=',
      premium: '35,000/='
    },
    jumpers: {
      economy: '45,000/=',
      premium: '60,000/='
    },
    caps: {
      economy: '25,000/=',
      premium: '40,000/='
    }
  };

  // Tab data structure
  const tabs = [
    { id: 'tshirts', label: 'T-shirts' },
    { id: 'jumpers', label: 'Jumpers' },
    { id: 'caps', label: 'Caps' }
  ];

  // Product data by category
  const products = {
    tshirts: [
      { id: 'signedtshirt', image: signedtshirt, name: "Signed T-shirt" },
      { id: 'tshirtwithlogo', image: tshirtwithlogo, name: "T-shirt with Logo" },
      { id: 'thinkoutofbox', image: thinkoutofbox, name: "Think Out of the Box" },
      { id: 'fridayfeeling', image: fridayfeeling, name: "Friday Feeling" },
      { id: 'weekend', image: weekend, name: "Weekend T-shirt" }
    ],
    jumpers: [
      { id: 'signedsweatshirt', image: signedsweatshirt, name: "Signed Sweatshirt" },
      { id: 'logosweatshirt', image: logosweatshirt, name: "Logo Jumper" },
      { id: 'sweatshirtbox', image: sweatshirtbox, name: "Custom Design Jumper" }
    ],
    caps: [
      { id: 'designercap', image: capsign, name: "Signed Cap" },
      { id: 'weekendcap', image: caplogo, name: "Logo Cap" },
      { id: 'casualcap', image: capsign, name: "Casual Cap" }
    ]
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize color indexes
    const initialIndexes = {};
    Object.values(products).forEach(category => {
      category.forEach(product => {
        initialIndexes[product.id] = 0;
      });
    });
    setColorIndexes(initialIndexes);

    // Load all images
    const allImages = Object.values(colorVariants).flat();
    const loadPromises = allImages.map(url => {
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
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setshowSlideshow(false);
      gsap.to(contref.current, {
        opacity: 1,
        duration: 1,
        delay: 0.2,
      });
      gsap.to(footeref.current, {
        opacity: 1,
        duration: 1,
        delay: 0.2,
      });
    }, 2100);
    return () => clearTimeout(timeout);
  }, []);

  const handleWhatsAppClick = (e, product) => {
    e.stopPropagation();
    const message = `Hi, I'm interested in the '${product.name}' (${activeTab}) from Tsam!`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const changeColorVariant = (productId) => {
    setColorIndexes(prev => {
      const currentIndex = prev[productId] || 0;
      const variants = colorVariants[productId] || [products[activeTab].find(p => p.id === productId)?.image];
      const nextIndex = (currentIndex + 1) % variants.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const handleDoubleTap = (productId) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 300 && tapLength > 0) {
      changeColorVariant(productId);
    }
    setLastTapTime(currentTime);
  };

  const getCurrentImage = (product) => {
    const variants = colorVariants[product.id] || [product.image];
    const index = colorIndexes[product.id] || 0;
    return variants[index % variants.length];
  };

  return (
    <div className="tsam-container" style={{ 
      overflow: 'hidden', // Changed from 'auto' to prevent page scrolling
      userSelect: 'none',
      backgroundColor: 'white', // Ensure white background fills the screen,
      position:'fixed'
    }}>
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
          padding: isMobile ? '0 10px' : '0',
          height: '100%', // Take full height of container
          position: 'relative' // For absolute positioning of children
        }}
      >
        {/* Fixed Header Section */}
        <div style={{
          position: isMobile ? 'sticky' : 'relative',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          width: '100%',
          padding: isMobile ? '10px 0' : '0',
          boxShadow: isMobile ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'
        }}>
          <div className="tsam-heading" style={{ 
            marginTop: isMobile ? '0' : '20px',
            padding: isMobile ? '0 10px' : '0'
          }}>
            <h1 style={{ 
              fontSize: isMobile ? '2.8rem' : '2.8rem',
              marginBottom: isMobile ? '-25px' : '10px'
            }}>Tsam Collection</h1>
          </div>
  
          {/* Categories Description - Mobile Optimized */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '15px' : '30px',
            marginBottom: isMobile ? '10px' : '20px',
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            flexWrap: 'wrap',
            padding: isMobile ? '0 5px' : '0'
          }}>
            <div style={{ 
              padding: isMobile ? '8px 10px' : '10px 15px',
              borderRadius: '8px',
              color: categoryColors.economy,
              flex: isMobile ? '1 1 40%' : 'none',
              minWidth: isMobile ? '120px' : 'auto'
            }}>
              <h3 style={{ 
                margin: '5px 0',
                fontSize: isMobile ? '14px' : '16px'
              }}>Economy</h3>
              <p style={{ 
                margin: '5px 0', 
                fontSize: isMobile ? '12px' : '14px' 
              }}>Standard quality</p>
            </div>
            <div style={{ 
              padding: isMobile ? '8px 10px' : '10px 15px',
              borderRadius: '8px',
              color: categoryColors.premium,
              flex: isMobile ? '1 1 40%' : 'none',
              minWidth: isMobile ? '120px' : 'auto'
            }}>
              <h3 style={{ 
                margin: '5px 0',
                fontSize: isMobile ? '14px' : '16px'
              }}>Premium</h3>
              <p style={{ 
                margin: '5px 0', 
                fontSize: isMobile ? '12px' : '14px' 
              }}>High quality</p>
            </div>
          </div>
  
          {/* Tab Navigation - Mobile Optimized */}
          <div className="tab-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: isMobile ? '10px' : '20px',
            width: '100%',
            maxWidth: '600px',
            padding: isMobile ? '0 5px' : '0'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active-tab' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: isMobile ? '8px 0' : '12px 0',
                  margin: isMobile ? '0 3px' : '0 5px',
                  border: 'none',
                  background: activeTab === tab.id ? tabColors[tab.id] : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#aaa',
                  fontSize: isMobile ? '12px' : '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '0',
                    width: '100%',
                    height: '3px',
                    background: tabColors[tab.id],
                    borderRadius: '3px',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
  
        {/* Product Display - Takes remaining space */}
        <div
          className="carousel-container"
          style={{
            width: '100%',
            height: isMobile ? 'calc(100vh - 220px)' : 'auto', // Dynamic height calculation
            padding: isMobile ? '10px 0' : '0',
            flexGrow: 1,
            overflow: 'hidden'
          }}
        >
          <Swiper
            direction={isMobile ? 'vertical' : 'horizontal'}
            slidesPerView={isMobile ? 2 : 3}
            spaceBetween={isMobile ? 15 : 30}
            loop={true}
            mousewheel={true}
            navigation={!isMobile}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Mousewheel]}
            style={{
              height: '100%',
              padding: isMobile ? '0' : '0'
            }}
          >
            {products[activeTab].map((product, index) => (
              <SwiperSlide key={index}>
                <div
                  className="slide"
                  onTouchStart={() => handleDoubleTap(product.id)}
                  onDoubleClick={() => changeColorVariant(product.id)}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    position: 'relative',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    touchAction: 'manipulation',
                    padding: isMobile ? '10px 0' : '0'
                  }}
                >
                  {/* WhatsApp Icon */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppClick(e, product);
                    }}
                    style={{
                      position: 'absolute',
                      top: isMobile ? '5px' : '10px',
                      right: isMobile ? '5px' : '10px',
                      width: isMobile ? '30px' : '40px',
                      height: isMobile ? '30px' : '40px',
                      backgroundColor: '#25D366',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    <WhatsAppIcon
                      style={{
                        width: isMobile ? '18px' : '24px',
                        height: isMobile ? '18px' : '24px',
                        fill: 'white'
                      }}
                    />
                  </div>
  
                  <img
                    src={getCurrentImage(product)}
                    alt={product.name}
                    style={{
                      width: isMobile ? '90%' : '500px',
                      height: 'auto',
                      maxHeight: isMobile ? '60vh' : 'none',
                      objectFit: 'contain',
                      transition: 'transform 0.5s ease',
                      display: 'block',
                      margin: '0 auto',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                  />
                  <div style={{ 
                    marginTop: isMobile ? '5px' : '10px',
                    textAlign: 'center',
                    width: '100%',
                    padding: isMobile ? '0 5px' : '0'
                  }}>
                    <h3 style={{ 
                      margin: '5px 0',
                      fontSize: isMobile ? '13px' : '16px',
                      color: '#333'
                    }}>{product.name}</h3>
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      gap: isMobile ? '8px' : '15px',
                      marginTop: '5px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ 
                        color: categoryColors.premium,
                        fontWeight: 'bold',
                        fontSize: isMobile ? '11px' : '14px'
                      }}>Premium: {prices[activeTab].premium}</span>
                      <span style={{ 
                        color: categoryColors.economy,
                        fontWeight: 'bold',
                        fontSize: isMobile ? '11px' : '14px'
                      }}>Economy: {prices[activeTab].economy}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
  
        {/* Double-click instruction - Mobile Optimized */}
        <p style={{ 
          fontSize: isMobile ? '12px' : '16px',
          color: '#666',
          margin: isMobile ? '5px 0' : '10px 0',
          textAlign: 'center',
          padding: isMobile ? '0 10px 10px' : '0',
          position: isMobile ? 'sticky' : 'relative',
          bottom: 0,
          backgroundColor: 'white',
          width: '100%'
        }}>
          Double-tap to see color variants
        </p>
      </div>
      <footer className="tsam-footer">
        <div ref={footeref} style={{opacity:0}}>
          <h3> to know more</h3>
          <ol>
            Double tap item to contact us 
          </ol>
        </div>
      </footer>Z
    </div>
  );
};

export default Tsam;