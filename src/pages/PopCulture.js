import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';
import './PopCulture.css';

import greentored from '../jsons/green to red.json';
import redtoblue from '../jsons/redtoblue.json';
import greentoblue from '../jsons/greentoblue.json';
import bluetored from '../jsons/bluetored.json';
import bluetogreen from '../jsons/bluetogreen.json';
import tabithalottie from '../jsons/tab3.json';
import agnes from '../jsons/agnes.json';
import robotboy1 from '../jsons/robotboy1.json';
import kami from '../jsons/kami.json';
import dex from '../jsons/dex.json';
import spidey1 from '../jsons/spidey1.json';
import spidey2 from '../jsons/blackspiderman.json';
import spidey3 from '../jsons/miles.json';

const PopCulture = () => {
  const containerRef = useRef(null);
  const animerefs = useRef({});

  const categoryButtons = ['Marvel', 'people', 'rangers', ];
  const lottieData = [
    { id: 1, animationData: spidey1, category: 'Marvel' },
    { id: 2, animationData: spidey2, category: 'Marvel' },
    { id: 3, animationData: spidey3, category: 'Marvel' },
    { id: 4, animationData: agnes, category: 'people' },
    { id: 5, animationData: greentored, category: 'rangers' },
    { id: 6, animationData: bluetored, category: 'rangers' },
    { id: 7, animationData: redtoblue, category: 'rangers' },
    { id: 8, animationData: bluetogreen, category: 'rangers' },
    { id: 9, animationData: greentoblue, category: 'rangers' },
  ];

  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedCard, setExpandedCard] = useState(null);
  const [clicked, setClicked] = useState({}); // track play direction per card

  const filteredLotties =
    activeCategory === 'All'
      ? lottieData
      : lottieData.filter(lottie => lottie.category === activeCategory);

  const handleCardClick = (id) => {
    const isClicked = clicked[id] || false;
    const player = animerefs.current[id];

    if (!player) return;

    if (!isClicked) {
      // Play forward
      player.setPlayerDirection(1);
      player.play();
    } else {
      // Play backward
      player.setPlayerDirection(-1);
      player.play();
    }

    setClicked(prev => ({ ...prev, [id]: !isClicked }));
  };

  const handleCardDoubleClick = (id) => {
    if (expandedCard === id) {
      collapseCard(id);
    } else {
      if (expandedCard) collapseCard(expandedCard);
      expandCard(id);
    }
  };

  const expandCard = (id) => {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;

    setExpandedCard(id);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetX = (viewportWidth - card.offsetWidth) / 2;
    const targetY = (viewportHeight - card.offsetHeight) / 2;

    gsap.to('.lottie-card:not(#card-' + id + ')', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });

    gsap.to(card, {
      x: targetX - card.getBoundingClientRect().left,
      y: targetY - card.getBoundingClientRect().top,
      scale: 3,
      duration: 0.5,
      ease: 'back.out(1.7)',
      zIndex: 100,
      onComplete: () => {
        animerefs.current[id]?.play();
      },
    });
  };

  const collapseCard = (id) => {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;

    setExpandedCard(null);

    gsap.to(card, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.in(1.7)',
      zIndex: 1,
    });

    gsap.to('.lottie-card', {
      opacity: 1,
      duration: 0.3,
      delay: 0.2,
      ease: 'power2.inOut',
    });

    animerefs.current[id]?.pause();
  };

  return (
    <div className="pop-culture-container" ref={containerRef} style={{userSelect:'none'}}>
      <h1 className="title">Pop Culture</h1>

      <div className="categories">
        <button
          className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categoryButtons.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="lottie-grid">
        {filteredLotties.map((lottie, index) => (
          <React.Fragment key={lottie.id}>
            <div
              id={`card-${lottie.id}`}
              className="lottie-card"
              onClick={() => handleCardClick(lottie.id)}
              onDoubleClick={() => handleCardDoubleClick(lottie.id)}
            >
              <Player
                ref={(el) => (animerefs.current[lottie.id] = el)}
                id={`lottie-${lottie.id}`}
                src={lottie.animationData}
                loop={false}
                keepLastFrame={true}
                autoplay={false}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PopCulture;
