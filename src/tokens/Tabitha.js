import React, { useState,useRef } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Player } from '@lottiefiles/react-lottie-player';
import tab1 from '../jsons/tb1.json';
import tab2 from '../jsons/tb2.json';
import tab3 from '../jsons/tb3.json';
import tab4 from '../jsons/tb4.json';
import tab5 from '../jsons/tb5.json';
import tab6 from '../jsons/tb6.json';
import tab7 from '../jsons/tb7.json';

const Tabitha = () => {
  const [tabs, setTabs] = useState(tab1);
  const animations = [tab1, tab2, tab3,tab4,tab5,tab6,tab7];
  const animref = useRef(null); // Reference for face animation

  const handleClick = () => {
   
  
        setTabs((prevTab) => {
            const currentIndex = animations.indexOf(prevTab);
            const nextIndex = (currentIndex + 1) % animations.length;
            return animations[nextIndex];
          }); 
   
      
   
   
  };

  return (
    <Container
    className="d-flex justify-content-center align-items-center"
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Card
      style={{
        width: '500px',
        height: '500px',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Card.Body className="d-flex justify-content-center align-items-center">
        <div onClick={handleClick}>
          <Player
            autoplay={true}
            loop={false}
            keepLastFrame={true}
            src={tabs}
            ref={animref}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </Card.Body>
    </Card>
  </Container>
  
  );
};

export default Tabitha;
