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
import tsamlogo from './jsons/tsamlogo.json';
import { ReactComponent as WhatsAppIcon } from './icons/whatsapp.svg';
import signedtshirt from './pics/tsign.png';
import signedsweatshirt from './pics/tjump.png';
import tshirtwithlogo from './pics/logoshirt.png';
import thinkoutofbox from './pics/thinker.png';
import fridayfeeling from './pics/friday.jpg';
import weekend from './pics/weekendwhite.jpg';
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
import ikigaiblue from './pics/Ikigaiblue.jpg';
import ikigaibrown from './pics/ikigaibrown.jpg';
import ikigaiblack from './pics/ikigaiblack.jpg';
import kaizenblue from './pics/kaizenblue.jpg';
import kaizenbrown from './pics/kaizenbrown.jpg';
import kaizenwhite from './pics/kaizenwhite.jpg';
import jumperboxblue from './pics/jumper box blue.jpg';
import jumperboxpink from './pics/jumper box pink.jpg';
import jumperboxred from './pics/jumper box red.jpg';
import jumpercanvasred from './pics/jumper canvas red.jpg';
import jumperlogodarkblue from './pics/jumper logo darkblue.jpg';
import jumperlogopink from './pics/jumper logo pink.jpg';
import jumperlogored from './pics/jumper logo red.jpg';
import jumpersignred from './pics/jumper sign red.jpg';
import jumpersignpink from './pics/jumper sign pink.jpg';
import jumpersignblue from './pics/jumper sign blue.jpg';
import noworkwhite from './pics/no work white.jpg';
import noworkblack from './pics/no work black.jpg';
import noworkcap from './pics/noworkcap.jpg';
import noworkcapblack from './pics/noworkcapblack.jpg';
import ikigaicap from './pics/Ikigai cap.jpg';
import ikigaicapwhite from './pics/ikigaiw.jpg';
import chillingcontrollerjumper from './pics/chilling controller.jpg';
import chillingboysjumper from './pics/chilling with boys jumper.jpg';
import chillingtshirtboysblack from './pics/chilling tshirt boys black.jpg';
import chillingtshirtgrey from './pics/chilling tshirt boys grey.jpg';
import chillingtshirtboysblue from './pics/chilling tshirt boys blue.jpg';
import chillingboys from './pics/chilling tshirt boys.jpg';
import chillingcontrollerblue from './pics/chilling tshirt controller blue.jpg';
import chillingcontrollerred from './pics/chilling tshirt controller red.jpg';
import chillingcontrollerwhite from './pics/chilling tshirt controller.jpg';
import chillingcap from './pics/chillingcapboys.jpg';
import capcontroller from './pics/cap controller.jpg';
import wabisabi from './pics/wabi.jpg';
import wabicap from './pics/wabi cap.jpg';
import wabijumper from './pics/wabijumper1.jpg';
import tokolaerror from './pics/tokola error2.jpg';
import tokolaerrorblack from './pics/tokolablack.jpg';
import tokolaerrorjumper from './pics/tokola eh jumper.jpg';
import moe from './pics/moe.jpg';
import pasasweatshirt from './pics/pasasweatshirt.jpg';
import pasasweatshirtblue from './pics/pasasweatshirtblue.jpg';
import pasasweatshirtred from './pics/pasasweatshirtred.jpg';
import pasatshirtw from './pics/pasatshirtw.jpg';
import moejumper from './pics/moejumper.jpg';
import noworkblackt from './pics/no work black.jpg';
import moecap from './pics/moe cap.jpg';
import moecapfront from './pics/moecapfront.jpg';
import moecaptext from './pics/moecaptext.jpg';

// Color variants mapping - Fixed all variants
const colorVariants = {
  signedtshirt: [signedtshirt, tshirtsignblue, tshirtsignpink, tshirtsignyellow],
  tshirtwithlogo: [tshirtwithlogo, tshirtlogowhite, tshirtlogoyellow, tshirtlogopink, tshirtlogobigpink],
  thinkoutofbox: [thinkoutofbox, tshirtboxblue, tshirtboxpink, tshirtcanvaswhite, tshirtcanvaswhite2],
  fridayfeeling: [fridayfeeling],
  weekend: [weekend],
  noworkwhite: [noworkwhite, noworkblackt],
  chillingtshirtgrey: [chillingtshirtgrey, chillingtshirtboysblack, chillingboys, pasatshirtw, chillingtshirtboysblue, chillingcontrollerblue, chillingcontrollerred, chillingcontrollerwhite],
  moe: [moe],
  ikigaiblue: [ikigaiblue, ikigaibrown, ikigaiblack],
  kaizenwhite: [kaizenwhite, kaizenbrown, kaizenblue],
  wabisabi: [wabisabi],

  signedsweatshirt: [signedsweatshirt, sweatshirtsignpink, sweatshirtsigndarkblue, sweatshirtsignred],
  logosweatshirt: [logosweatshirt, sweatshirtlogopink, sweatshirtlogoyellow],
  sweatshirtbox: [sweatshirtbox, sweatshirtboxred, sweatshirtboxyellow],
  jumpersignpink: [jumpersignpink, jumpersignred, jumpersignblue],
  jumperlogodarkblue: [jumperlogodarkblue, jumperlogopink, jumperlogored],
  jumperboxblue: [jumperboxblue, jumperboxpink, jumperboxred, jumpercanvasred],
  chillingcontrollerjumper: [chillingcontrollerjumper, chillingboysjumper],
  pasasweatshirt: [pasasweatshirt, pasasweatshirtblue, pasasweatshirtred],
  moejumper: [moejumper],

  designercap: [capsign, capsignred, capsigngreen, capsignblue],
  weekendcap: [caplogo, caplogopink],
  casualcap: [capsign, capsignred],
  noworkcap: [noworkcap, noworkcapblack],
  ikigaicap: [ikigaicap, ikigaicapwhite],
  chillingcap: [chillingcap, capcontroller],
  moecapfront: [moecapfront, moecap, moecaptext],
  
  wabicap: [wabicap],

};
const collageLayout = {
  tshirts: [
    { id: 'signedtshirt', size: 'large', rotate: 'left' }, 
    { id: 'tshirtwithlogo', size: 'medium', rotate: 'left' },
    { id: 'thinkoutofbox', size: 'medium', rotate: 'left' },
    { id: 'fridayfeeling', size: 'small', rotate: 'left' },
    { id: 'ikigaiblue', size: 'medium', rotate: 'left' },
    { id: 'noworkwhite', size: 'small', rotate: 'left' },
    { id: 'kaizenwhite', size: 'medium', rotate: 'left' },
    { id: 'chillingtshirtgrey', size: 'medium', rotate: 'left' },
    { id: 'moe', size: 'small', rotate: 'left' },
    { id: 'weekend', size: 'medium', rotate: 'left' },
    { id: 'wabisabi', size: 'medium', rotate: 'left' },
  ],
  jumpers: [
    { id: 'signedsweatshirt', size: 'medium', rotate: 'left' },
    { id: 'logosweatshirt', size: 'medium', rotate: 'left' },
    { id: 'sweatshirtbox', size: 'medium', rotate: 'left' },
    { id: 'jumpersignpink', size: 'medium', rotate: 'left' },
    { id: 'jumperlogodarkblue', size: 'medium', rotate: 'left' },
    { id: 'jumperboxblue', size: 'medium', rotate: 'left' },
    { id: 'moejumper', size: 'medium', rotate: 'left' },
    { id: 'pasasweatshirt', size: 'medium', rotate: 'left' },
    { id: 'chillingcontrollerjumper', size: 'large', rotate: 'left' },

  ],
  caps: [
    { id: 'designercap', size: 'medium', rotate: 'left' },
    { id: 'weekendcap', size: 'medium', rotate: 'left' },
    { id: 'casualcap', size: 'large', rotate: 'left' },
    { id: 'noworkcap', size: 'medium', rotate: 'left' },
    { id: 'chillingcap', size: 'medium', rotate: 'left' },
    { id: 'ikigaicap', size: 'medium', rotate: 'left' },
    { id: 'moecapfront', size: 'medium', rotate: 'left' },
    { id: 'wabicap', size: 'medium', rotate: 'left' }
  ]
};
const Tsam = () => {
  const lottieRef = useRef(null);
  const contref = useRef(null);
  const footeref = useRef(null);
  const logoRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showSlideshow, setshowSlideshow] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeProducts, setActiveProducts] = useState({});
  const [activeProductId, setActiveProductId] = useState(null);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState('tshirts');
  const [colorIndexes, setColorIndexes] = useState({});
  const [cloneCount, setCloneCount] = useState(2); // Start with 2 clones of layout

  const whatsappNumber = "256782240185";

  // Tab colors
  const tabColors = {
    tshirts: '#7d99c4',
    jumpers: '#cbb4a4',
    caps: '#9fedd3'
  };

  // Fixed prices by product type
  const prices = {
    tshirts: {
      economy: '20,000/=',
      premium: '35,000/='
    },
    jumpers: {
      sweatshirt: '45,000/=',
      jumper: '60,000/='
    },
    caps: {
      standard: '15,000/=',
      premium: '25,000/='
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
      { id: 'ikigaiblue', image: ikigaiblue, name: "Ikigai" },
      { id: 'noworkwhite', image: noworkwhite, name: "No Work" },
      { id: 'kaizenwhite', image: kaizenwhite, name: "Kaizen" },
      { id: 'chillingtshirtgrey', image: chillingtshirtgrey, name: "Chilling with the Boys" },
      { id: 'moe', image: moe, name: "Minister of Enjoyment" },
      { id: 'weekend', image: weekend, name: "Weekend T-shirt" },
      { id: 'wabisabi', image: wabisabi, name: "wabisabi T-shirt" },

    ],

    jumpers: [
      { id: 'signedsweatshirt', image: signedsweatshirt, name: "Signed Sweatshirt" },
      { id: 'logosweatshirt', image: logosweatshirt, name: "Logo Jumper" },
      { id: 'sweatshirtbox', image: sweatshirtbox, name: "Custom Design Jumper" },
      { id: 'jumpersignpink', image: jumpersignpink, name: "Jumper Sign" },
      { id: 'jumperlogodarkblue', image: jumperlogodarkblue, name: "Jumper Logo" },
      { id: 'jumperboxblue', image: jumperboxblue, name: "Jumper Box" },
      { id: 'moejumper', image: moejumper, name: "Minister of Enjoyment" },
      { id: 'pasasweatshirt', image: pasasweatshirt, name: "Chilling with the Boys" },
      { id: 'chillingcontrollerjumper', image: chillingcontrollerjumper, name: "Chilling Controller" },

    ],

    caps: [
      { id: 'designercap', image: capsign, name: "Signed Cap" },
      { id: 'weekendcap', image: caplogo, name: "Weekend Cap" },
      { id: 'casualcap', image: capsign, name: "Casual Cap" },
      { id: 'noworkcap', image: noworkcap, name: "No Work Cap" },
      { id: 'chillingcap', image: chillingcap, name: "Chilling Cap" },
      { id: 'ikigaicap', image: ikigaicap, name: "Ikigai Cap" },
      { id: 'moecapfront', image: moecapfront, name: "Minister of Enjoyment" },
      { id: 'wabicap', image: wabicap, name: "wabi sabi cap" },

      
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

    const logoAnim = lottie.loadAnimation({
      container: logoRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: tsamlogo,
    });

    return () => {
      anim.destroy();
      logoAnim.destroy();
    };
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

    // e.stopPropagation(); 

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
  const handleProductClick = (productId) => {
    setActiveProductId(productId);
  };
  const handleMouseEnter = () => {
    if (!isMobile) setIsHeaderExpanded(true);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) setIsHeaderExpanded(false);
  };
  
  const handleHeaderClick = () => {
    if (!isMobile) setIsHeaderExpanded(prev => !prev);
  };
  
  const getCurrentImage = (product) => {
    const variants = colorVariants[product.id] || [product.image];
    const index = colorIndexes[product.id] || 0;
    return variants[index % variants.length];
  };
  const ProductCell = ({ item, index, activeTab, products, activeProductId, isMobile, 
    handleWhatsAppClick, getCurrentImage, handleProductClick, changeColorVariant }) => {
    const product = products[activeTab].find(p => p.id === item.id);
    if (!product) return null;
  
    const cellSize = {
      large: isMobile ? 'span 2' : 'span 1',
      medium: 'span 1',
      small: 'span 1'
    }[item.size];
  
    const rotation = {
      left: 'rotate(-3deg)',
      right: 'rotate(3deg)',
      none: 'rotate(0deg)'
    }[item.rotate];
  
    return (
      <div
        style={{
          gridColumn: cellSize,
          gridRow: cellSize,
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '1/1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          transform: rotation,
          transition: 'transform 0.3s ease',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '4px',
        }}
      >
        {/* WhatsApp Icon */}
        {activeProductId === product.id && (
          <div 
            onClick={(e) => {
              handleWhatsAppClick(e, product);
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
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
            <WhatsAppIcon style={{ width: '16px', height: '16px', fill: 'white' }} />
          </div>
        )}
  
        <img
          src={getCurrentImage(product)}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onClick={    () => {
            handleProductClick(product.id);
            changeColorVariant(product.id);
          } }
         
        />
  
        {/* Product Info Overlay */}
        {activeProductId === product.id && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white',
            padding: '10px',
            fontSize: isMobile ? '10px' : '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
            <div style={{ fontSize: '0.8em' }}>Tap to view colors</div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="tsam-container" style={{ 
      overflow: 'hidden',
      userSelect: 'none',
      backgroundColor: 'white',
      width: '100%',
      height: '100vh',
      position: 'relative'
    }}>
      {showSlideshow && (
        <div style={{ position: 'absolute', zIndex: 5 }} ref={lottieRef} className="lottie-holder" />
      )}
  
      {/* Fixed Header Section (unchanged) */}
      {!showSlideshow && (
  <div 
 
    onClick={handleHeaderClick}
    style={{
      position: 'fixed',
      top: 0,
      zIndex: 10,
      backgroundColor: 'white',
      width: '100%',
      padding: isMobile ? '10px 0' : '20px 0',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      height: isMobile ? 'auto' : '50px'
    }}
  >
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'space-between',
      maxWidth: '1200px',
      margin: '0 auto',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {/* Logo and Title - Left aligned on desktop */}
      <div 
        className="tsam-heading" 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: isMobile ? '0' : '0',
          padding: isMobile ? '0 10px' : '0',
          height: isMobile ? '20px' : '100px',
          order: isMobile ? 1 : 0
        }}
      >
        <div 
          ref={logoRef} 
          style={{
            width: isMobile ? '50px' : '80px',
            height: isMobile ? '50px' : '80px',
            marginTop: isMobile ? '20px' : '0',
            marginBottom: isMobile ? '0' : '40px',

            marginRight: '10px'
          }}
        />
        <h1 style={{ 
          fontSize: isMobile ? '1.5rem' : '1.2rem',
          marginBottom: isMobile ? '0px' : '60px',
          whiteSpace: 'nowrap'
        }}>
          Tsam Collection
        </h1>
      </div>

      {/* Tab Navigation - Centered on desktop */}
      <div 
        className="tab-container" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: isMobile ? '0px' : '50px',
          width: isMobile ? '100%' : 'auto',
          maxWidth: '600px',
          margin: isMobile ? '0 auto' : '0',
          padding: isMobile ? '0 5px' : '0',
          order: isMobile ? 2 : 0
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: isMobile ? '8px 15px' : '10px 20px',
              margin: isMobile ? '0 5px' : '0 10px',
              border: 'none',
              background: activeTab === tab.id ? tabColors[tab.id] : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#aaa',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Empty div to balance the flex layout on desktop */}
      {!isMobile && <div style={{ width: '80px' }}></div>}
    </div>
  </div>
)}
      {/* Collage Product Display */}
   {!showSlideshow && (
  <div 
  style={{ 
    height: '80vh',
    overflowY: 'auto',
    padding: '20px 0',
    marginTop: isMobile ? '150px' : '200px',
    position: 'fixed',
  }}
  ref={contref}  // Only keep if you use this ref elsewhere
>
  {/* Single grid - no clones */}
  <div
    style={{
      opacity: 1,
      padding: '0',
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
      gridAutoRows: isMobile ? 'minmax(150px, 1fr)' : 'minmax(250px, 1fr)',
      gap: isMobile ? '4px' : '8px',
      width: '100%',
      transform: 'rotate(-2deg)',
      transformOrigin: 'center',
      paddingBottom: '60px'
    }}
  >
    {collageLayout[activeTab].map((item, index) => (
      <ProductCell 
        key={`${item.id}-${index}`}
        item={item}
        index={index}
        activeTab={activeTab}
        products={products}
        activeProductId={activeProductId}
        isMobile={isMobile}
        handleWhatsAppClick={handleWhatsAppClick}
        getCurrentImage={getCurrentImage}
        handleProductClick={handleProductClick}
        changeColorVariant={changeColorVariant}
      />
    ))}
  </div>
</div>
)}

      {/* Double-click instruction */}
      <div style={{ 
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  padding: '10px',
  textAlign: 'center',
  boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
  zIndex: 10
}}>
  <p style={{ 
    fontSize: isMobile ? '12px' : '16px',
    color: '#666',
    margin: 0
  }}>
    Tap image to see other colors •/•  contact us
  </p>
</div>
    </div>
  );
};
export default Tsam;
