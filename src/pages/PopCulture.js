import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import lottie from 'lottie-web';
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
  const carouselRef = useRef(null);
  const audioref = useRef(null);
  const animerefs = useRef({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clicked, setClicked] = useState({});
  const [tvar1, setTvar1] = useState(true);
  const [roholder, setroholder] = useState(ro2);
  const [sounder, setsounder] = useState(multiverse);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [roPhase, setRoPhase] = useState(0);

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
      background: '#1E2B3B'
    },
    { 
      id: 5, 
      animationData: roholder, 
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

  // Initialize Lottie animations
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const containers = carouselRef.current.querySelectorAll('.lottie-container');
    
    containers.forEach((container, index) => {
      // Clear container first
      container.innerHTML = '';
      
      try {
        const anim = lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: lottieData[index].animationData,
        });
        
        animerefs.current[lottieData[index].id] = anim;
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    });

    // Set initial background with fade in
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundColor: lottieData[currentIndex].background,
        duration: 1,
        ease: 'power2.inOut'
      });
    }

    return () => {
      // Cleanup animations
      Object.values(animerefs.current).forEach(anim => {
        if (anim) anim.destroy();
      });
    };
  }, [roholder]);

  // Handle sound when currentIndex changes
  useEffect(() => {
    const currentId = lottieData[currentIndex].id;

    if (currentId === 4) {
      setsounder(multiverse);
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
      setsounder(null);
    }
  }, [currentIndex]);

  const handleCardClick = (id, category) => {
    const isClicked = clicked[id] || false;
    const animation = animerefs.current[id];

    if (!animation) return;

    // Handle ID 5 with a clear 4-step cycle
    if (id === 5) {
      // Reset animation if it's the first interaction
      if (roPhase === 0) {
        animation.goToAndStop(0, true);
      }
      
      // Step through the phases
      switch(roPhase) {
        case 0: // First click - play forward
          animation.setDirection(1);
          animation.play();
          setRoPhase(1);

          setTimeout(() => {
            setroholder(ro);
            setRoPhase(1);
          }, animation.getDuration() * 1000);
          break;
        case 1: // Second click - play reverse
          setTimeout(() => {
            const newAnim = animerefs.current[5];
            animation.setDirection(1);
            animation.play();
          }, 100);
          setRoPhase(2);
          break;

        case 2: // Third click - switch to ro2 and play forward
          animation.setDirection(-1);
          animation.play();
          
          // Reset after animation completes
          setTimeout(() => {
            setroholder(ro2);
          
            setTimeout(() => {
              const newAnim = animerefs.current[5];
              if (newAnim) {
                // Go to the last frame of ro2 and pause
                const totalFrames = newAnim.getDuration(true);
                newAnim.goToAndStop(totalFrames, true);
              }
              setRoPhase(3);
            }, 50); 
          }, animation.getDuration() * 1000);
          setRoPhase(3);
          break;

        case 3: // Fourth click - play ro2 reverse and reset
          const totalFrames = animation.getDuration(true);
          animation.goToAndStop(totalFrames , true);

          animation.setDirection(-1);
          animation.play();
          // Reset after animation completes
          setTimeout(() => {
            setRoPhase(0);
          }, animation.getDuration() * 1000);
          break;
        default:
          setRoPhase(0);
      }
    } else {
      // For other IDs - toggle play direction
      if (!isClicked) {
        animation.setDirection(1);
        animation.play();
      } else {
        animation.setDirection(-1);
        animation.play();
      }

      // Play sound on click if this animation has one
      if ((id === 4 || id === 8) && audioref.current) {
        audioref.current.currentTime = 0;
        audioref.current.play().catch(() => {});
      }
    }

    setClicked(prev => ({ ...prev, [id]: !isClicked }));
  };

  // Handle navigation to next/previous lottie with GSAP animation
  const navigateTo = (index) => {
    if (isAnimating || index === currentIndex) return;
    if (index < 0) index = lottieData.length - 1;
    if (index >= lottieData.length) index = 0;
    
    setIsAnimating(true);
    
    // Determine if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Animate transition
    gsap.to(carouselRef.current, {
      [isMobile ? 'y' : 'x']: isMobile ? -index * window.innerHeight : -index * window.innerWidth,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        setIsAnimating(false);
        setCurrentIndex(index);
      }
    });
    
    // Animate background transition with fade
    gsap.to(containerRef.current, {
      backgroundColor: lottieData[index].background,
      duration: 1,
      ease: 'power2.inOut'
    });
  };

  // Improved touch events for mobile
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setStartY(e.touches[0].clientY);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (isAnimating) return;
  
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - startY;
    const diffX = currentX - startX;
    
    // Check if it's a clear swipe
    if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 0) {
        // Swipe down - previous
        navigateTo(currentIndex - 1);
      } else {
        // Swipe up - next
        navigateTo(currentIndex + 1);
      }
    }
  };

  // Handle wheel events for desktop
  const handleWheel = (e) => {
    if (isAnimating) return;
    
    if (window.innerWidth <= 768) {
      // Mobile - vertical scrolling
      if (e.deltaY > 30) {
        navigateTo(currentIndex + 1);
      } else if (e.deltaY < -30) {
        navigateTo(currentIndex - 1);
      }
    } else {
      // Desktop - horizontal scrolling
      if (e.deltaX > 20 || e.deltaY > 20) {
        navigateTo(currentIndex + 1);
      } else if (e.deltaX < -20 || e.deltaY < -20) {
        navigateTo(currentIndex - 1);
      }
    }
  };

  // Set initial position and add event listeners
  useEffect(() => {
    // Position carousel at current index
    if (carouselRef.current) {
      const isMobile = window.innerWidth <= 768;
      gsap.set(carouselRef.current, { 
        [isMobile ? 'y' : 'x']: isMobile ? -currentIndex * window.innerHeight : -currentIndex * window.innerWidth 
      });
    }
    
    // Add event listeners
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [currentIndex, isAnimating]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        const isMobile = window.innerWidth <= 768;
        gsap.set(carouselRef.current, { 
          [isMobile ? 'y' : 'x']: isMobile ? -currentIndex * window.innerHeight : -currentIndex * window.innerWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  return (
    <div 
      className="pop-culture-container" 
      ref={containerRef}
      style={{userSelect: 'none', WebkitTapHighlightColor: 'transparent',height:'100vh',width:'100vw'}}
    >
      <div className="lottie-carousel" ref={carouselRef}>
        {lottieData.map((item, index) => (
          <div 
            key={item.id}
            className="lottie-slide"
            style={{
              width: window.innerWidth,
              height: window.innerHeight,
            }}
          >
            <div 
              className="lottie-container"
              id={`lottie-${item.id}`}
              onClick={() => handleCardClick(item.id, item.category)}
            />
          </div>
        ))}
      </div>

      <audio ref={audioref} src={sounder || ''}/>

      {/* Navigation Arrows */}
      <div className="navigation-arrows">
        <button 
          className="nav-arrow prev-arrow" 
          onClick={() => navigateTo(currentIndex - 1)}
          aria-label="Previous animation"
        >
          &#8249;
        </button>
        <button 
          className="nav-arrow next-arrow" 
          onClick={() => navigateTo(currentIndex + 1)}
          aria-label="Next animation"
        >
          &#8250;
        </button>
      </div>

      {/* Indicators */}
      <div className="carousel-indicators">
        {lottieData.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => navigateTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PopCulture;