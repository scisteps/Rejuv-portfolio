import React, { useState, useEffect } from 'react';
import { Player } from "@lottiefiles/react-lottie-player";
import crown from '../jsons/crown.json';

const Mainloading = ({ nextPageRoute }) => {
  const [timer, setTimer] = useState(5); // 4-second timer
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      setRedirect(true);
    }

    return () => clearInterval(intervalId);
  }, [timer]);

  if (redirect) {
    return <>{nextPageRoute()}</>;
  }

  return (
    <div style={{
      backgroundColor: 'black',
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position:'fixed'
    }}>
      <Player
        autoplay={true}
        loop={true}
        src={crown}
        style={{ width: '400px', height: '650px' }}
      />
    </div>
  );
};

export default Mainloading;
