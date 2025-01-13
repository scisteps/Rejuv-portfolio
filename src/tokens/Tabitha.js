import React, { useState,useRef } from 'react';
import { Card, Container,Row,Col } from 'react-bootstrap';
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
   
  <Container className="d-flex justify-content-center align-items-center">
  <Row className="justify-content-center flex-wrap">
          <Col xs={12} md={4} lg={5}>
              <Card style={{ width: '400px', height: '705px', textAlign: 'center',    position: 'fixed',
left: '50%',
top: '50%',
transform: 'translate(-50%, -50%)', }}>
        

                  <Card.Body style={{ border: '1px solid #9B9B9B', boxShadow: 'none'  }} >
                     
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
                  <Card.Footer style={{ border: '1px solid #9B9B9B' }} className="d-flex justify-content-between">
              
                  </Card.Footer>
              </Card>
          </Col>
    
  </Row>
</Container>
  
  );
};

export default Tabitha;
