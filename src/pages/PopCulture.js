import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';
import './PopCulture.css';
import greentored from '../jsons/ggpr.json';
import redtoblue from '../jsons/redtoblue.json';
import bluetored from '../jsons/bluetored.json';
import spidey1 from '../jsons/spidey sense.json';
import spidey2 from '../jsons/blackspidey4.json';
import spidey3 from '../jsons/milesx2.json';
import spidey4 from '../jsons/xmilex2.json';
import face from '../jsons/talker2.json';
import eaze from '../jsons/eaze2.json';
import dex from '../jsons/dex9.json';
import ro from '../jsons/ro2.json';
import ro2 from '../jsons/ro3.json';
import soeasy from '../jsons/sounds/soeasy3.mp3';
import multiverse from '../jsons/sounds/Another Dimension.mp3';

const PopCulture = () => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
    const audioref = useRef(null);

  const animerefs = useRef({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clicked, setClicked] = useState({});
  const [rangerColorIndex, setRangerColorIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldPlayAfterDelay, setShouldPlayAfterDelay] = useState(false);
  const [sounder, setsounder] = useState(multiverse);

  // Define the lottie data with backgrounds
  const lottieData = [
    { 
      id: 1, 
      animationData: face, 
      category: 'ranger',
      background: '#ffffff'
     
    },
    { 
      id: 2, 
      animationData: spidey1, 
      category: 'spidey',
      background: '#FFE8B6'
    },
    { 
      id: 3, 
      animationData: spidey2, 
      category: 'spidey',
      background: '#1E2B3B'
    },
    { 
      id: 4, 
      animationData: spidey4, 
      category: 'spidey',
      background: '#000000'
    },
    { 
      id: 5, 
      animationData: ro2, 
      category: 'spidey',
      background: '#81D2FB'
    },
    { 
      id: 6, 
      animationData: ro, 
      category: 'spidey',
      background: '#81D2FB'
    },
    { 
      id: 7, 
      animationData: greentored, 
      category: 'ranger',
      background: '#A3A3A3'
    },
   
 
    { 
      id: 8, 
      animationData: eaze, 
      category: 'ranger',
      background: '#2B2B2B'
    },
    { 
      id: 9, 
      animationData: dex, 
      category: 'ranger',
      background: '#1E2B3B'
    },
  ];

  // // Handle card click for play/reverse
  // const handleCardClick = (id, category) => {
  //   // For spidey cards - toggle play direction
  //   const isClicked = clicked[id] || false;
  //   const player = animerefs.current[id];

  //   if (!player) return;

  //   if (!isClicked) {
  //     player.setPlayerDirection(1);
  //     player.play();
  //   } else {
  //     player.setPlayerDirection(-1);
  //     player.play();
  //   }

  //   setClicked(prev => ({ ...prev, [id]: !isClicked }));
  // };

  // Handle navigation to next/previous lottie with GSAP animation
  const navigateTo = (index, direction = null) => {
    if (isAnimating) return;
    if (index < 0) index = lottieData.length - 1;
    if (index >= lottieData.length) index = 0;
    
    setIsAnimating(true);
    setShouldPlayAfterDelay(false);
    
    // Determine animation direction
    let animationDirection = direction;
    if (!animationDirection) {
      animationDirection = index > currentIndex ? 1 : -1;
    }
    
    // Animate transition
    if (window.innerWidth <= 768) {
      // Mobile - vertical animation
      gsap.to(viewportRef.current, {
        y: animationDirection * window.innerHeight,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentIndex(index);
          gsap.set(viewportRef.current, {
            y: -animationDirection * window.innerHeight,
            opacity: 0
          });
          gsap.to(viewportRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              setIsAnimating(false);
              setShouldPlayAfterDelay(true);
            }
          });
        }
      });
    } else {
      // Desktop - horizontal animation
      gsap.to(viewportRef.current, {
        x: animationDirection * window.innerWidth,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentIndex(index);
          gsap.set(viewportRef.current, {
            x: -animationDirection * window.innerWidth,
            opacity: 0
          });
          gsap.to(viewportRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              setIsAnimating(false);
              setShouldPlayAfterDelay(true);
            }
          });
        }
      });
    }
    
    // Animate background transition
    gsap.to(containerRef.current, {
      backgroundColor: lottieData[index].background,
      duration: 1,
      ease: 'power2.inOut'
    });
  };

  // Play animation after 1 second delay
  useEffect(() => {
    if (shouldPlayAfterDelay) {
      const timer = setTimeout(() => {
        const currentId = lottieData[currentIndex].id;
        const player = animerefs.current[currentId];
        
        if (player) {
          player.stop();
          player.setPlayerDirection(1);
          player.play();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [shouldPlayAfterDelay, currentIndex]);

  // --- inside PopCulture component --- //

// Watch whenever currentIndex changes
useEffect(() => {
  const currentId = lottieData[currentIndex].id;

  if (currentId === 4) {
    setsounder(multiverse);
    // wait a tick for src to update
    setTimeout(() => {
      if (audioref.current) {
        audioref.current.currentTime = 0;
        audioref.current.play().catch(() => {});
      }
    }, 100);
  } else if (currentId === 8) {
    setsounder(soeasy);
    setTimeout(() => {
      if (audioref.current) {
        audioref.current.currentTime = 0;
        audioref.current.play().catch(() => {});
      }
    }, 100);
  } else {
    setsounder(null); // no sound for other animations
  }
}, [currentIndex]);

const handleCardClick = (id, category) => {
  const isClicked = clicked[id] || false;
  const player = animerefs.current[id];

  if (!player) return;

  if (!isClicked) {
    player.setPlayerDirection(1);
    player.play();
  } else {
    player.setPlayerDirection(-1);
    player.play();
  }

  // 🔊 Play sound on click if this animation has one
  if ((id === 4 || id === 8) && audioref.current) {
    audioref.current.currentTime = 0;
    audioref.current.play().catch(() => {});
  }

  setClicked(prev => ({ ...prev, [id]: !isClicked }));
};

  // Improved touch/mouse events for swiping
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setIsDragging(true);
    if (e.type.includes('touch')) {
      setStartY(e.touches[0].clientY);
      setStartX(e.touches[0].clientX);
    } else {
      setStartY(e.clientY);
      setStartX(e.clientX);
      e.preventDefault(); // Prevent text selection on desktop
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isAnimating) return;
  
    let currentY, currentX;
    if (e.type.includes('touch')) {
      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      // e.preventDefault(); // Prevent scrolling while dragging
    } else {
      currentY = e.clientY;
      currentX = e.clientX;
    }
  
    const diffY = currentY - startY;
    const diffX = currentX - startX;
  
    // For both mobile and desktop: prioritize horizontal swipes
    if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe right - previous
        navigateTo(currentIndex - 1, -1);
      } else {
        // Swipe left - next
        navigateTo(currentIndex + 1, 1);
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle wheel events for scrolling
  const handleWheel = (e) => {
    if (isAnimating) return;
    
    if (window.innerWidth <= 768) {
      // Mobile - vertical scrolling
      if (e.deltaY > 30) {
        navigateTo(currentIndex + 1, 1);
      } else if (e.deltaY < -30) {
        navigateTo(currentIndex - 1, -1);
      }
    } else {
      // Desktop - horizontal scrolling
      if (e.deltaX > 20 || e.deltaY > 20) {
        navigateTo(currentIndex + 1, 1);
      } else if (e.deltaX < -20 || e.deltaY < -20) {
        navigateTo(currentIndex - 1, -1);
      }
    }
  };

  // Set initial background and add event listeners
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = lottieData[currentIndex].background;
    }
    
    // Add event listeners
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      container.addEventListener('mousedown', handleTouchStart);
      container.addEventListener('mousemove', handleTouchMove);
      container.addEventListener('mouseup', handleTouchEnd);
      container.addEventListener('mouseleave', handleTouchEnd);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('mousedown', handleTouchStart);
        container.removeEventListener('mousemove', handleTouchMove);
        container.removeEventListener('mouseup', handleTouchEnd);
        container.removeEventListener('mouseleave', handleTouchEnd);
      }
    };
  }, [currentIndex, isAnimating]);

  return (
    <div 
      className="pop-culture-container" 
      ref={containerRef}
      style={{userSelect: 'none', WebkitTapHighlightColor: 'transparent'}}
    >
      <div className="lottie-viewport" ref={viewportRef}>
        <div className="lottie-card">
          <Player
            ref={(el) => (animerefs.current[lottieData[currentIndex].id] = el)}
            id={`lottie-${lottieData[currentIndex].id}`}
            src={lottieData[currentIndex].animationData}
            loop={false}
            keepLastFrame={true}
            autoplay={false}
            className="lottie-player"
          />
<audio ref={audioref} src={sounder || ''}/>

        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="navigation-arrows">
        <button 
          className="nav-arrow prev-arrow" 
          onClick={() => navigateTo(currentIndex - 1, -1)}
          aria-label="Previous animation"
        >
          &#8249;
        </button>
        <button 
          className="nav-arrow next-arrow" 
          onClick={() => navigateTo(currentIndex + 1, 1)}
          aria-label="Next animation"
        >
          &#8250;
        </button>
      </div>

      <div 
        className="lottie-card-clickable"
        onClick={() => handleCardClick(lottieData[currentIndex].id, lottieData[currentIndex].category)}
      ></div>
    </div>
  );
};

export default PopCulture;