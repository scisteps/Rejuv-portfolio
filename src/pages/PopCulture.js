import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';
import './PopCulture.css';
import greentored from '../jsons/green to red.json';
import redtoblue from '../jsons/redtoblue.json';
import bluetored from '../jsons/bluetored.json';
import spidey1 from '../jsons/spidey sense.json';
import spidey2 from '../jsons/blackspidey4.json';
import spidey3 from '../jsons/milesx2.json';
import spidey4 from '../jsons/x7.json';

const PopCulture = () => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const animerefs = useRef({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clicked, setClicked] = useState({});
  const [rangerColorIndex, setRangerColorIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Define the lottie data with backgrounds
  const lottieData = [
    { 
      id: 1, 
      animationData: spidey1, 
      category: 'spidey',
      background: '#FFE8B6'
    },
    { 
      id: 2, 
      animationData: spidey2, 
      category: 'spidey',
      background: '#1E2B3B'
    },
    { 
      id: 3, 
      animationData: spidey4, 
      category: 'spidey',
      background: '#000000'
    },
    { 
      id: 4, 
      animationData: greentored, 
      category: 'ranger',
      background: '#ffffff'
    },
  ];

  // Handle card click for play/reverse
  const handleCardClick = (id, category) => {
    // For spidey cards - toggle play direction
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

    setClicked(prev => ({ ...prev, [id]: !isClicked }));
  };

  // Handle navigation to next/previous lottie with GSAP animation
  const navigateTo = (index, direction = null) => {
    if (isAnimating) return;
    if (index < 0) index = lottieData.length - 1;
    if (index >= lottieData.length) index = 0;
    
    setIsAnimating(true);
    
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
            onComplete: () => setIsAnimating(false)
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
            onComplete: () => setIsAnimating(false)
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
      e.preventDefault(); // Prevent scrolling while dragging
    } else {
      currentY = e.clientY;
      currentX = e.clientX;
    }
    
    const diffY = currentY - startY;
    const diffX = currentX - startX;
    
    // For mobile (vertical swipe)
    if (window.innerWidth <= 768 && Math.abs(diffY) > 30 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 0) {
        // Swipe down - previous
        navigateTo(currentIndex - 1, -1);
      } else {
        // Swipe up - next
        navigateTo(currentIndex + 1, 1);
      }
      setIsDragging(false);
    }
    
    // For desktop (horizontal swipe)
    if (window.innerWidth > 768 && Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
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
        </div>
      </div>
 <div className="navigation-dots">
        {lottieData.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => navigateTo(index)}
          ></button>
        ))}
      </div> 

      <div 
        className="lottie-card-clickable"
        onClick={() => handleCardClick(lottieData[currentIndex].id, lottieData[currentIndex].category)}
        onTouchStart={(e) => e.preventDefault()} // Prevent highlight on touch
      ></div>
    </div>
  );
};

export default PopCulture;