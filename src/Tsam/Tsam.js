import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import sign from './jsons/sign.json';
import box from './pics/box.png';
import canvas from './pics/canvas.png';
import logoshirt from './pics/logoshirt.png';
import thinkoutsweat from './pics/thinkoutsweat.png';
import './tsam.css';

const Tsam = () => {
  const lottieRef = useRef(null);
  const [showSlideshow, setShowSlideshow] = useState(false);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: sign,
    });

    const timer = setTimeout(() => {
      setShowSlideshow(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      anim.destroy();
    };
  }, []);

  const images = [box, canvas, logoshirt, thinkoutsweat];

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {!showSlideshow ? (
        <div ref={lottieRef} className="w-full h-full flex items-center justify-center" />
      ) : (
        <div className="w-full px-4">
          <div className="fade-in w-full overflow-x-auto scrollbar-hide py-10">
            <div className="flex gap-6 px-10 min-w-max">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`rounded-[15px] transition-all duration-300 flex-shrink-0 ${
                    index === 1
                      ? 'w-[220px] h-[220px] md:w-[300px] md:h-[300px] scale-[1.5]'
                      : 'w-[150px] h-[150px] md:w-[200px] md:h-[200px]'
                  }`}
                >
                  <img
                    src={img}
                    alt={`img-${index}`}
                    className="w-full h-full object-cover rounded-[15px] shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tsam;
