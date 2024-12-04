import React, { useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { gsap } from 'gsap';
import wink from '../jsons/winker.json';
import party from '../jsons/party.json';
import freeze from '../jsons/freeze.json';
import love from '../jsons/loveemoji.json';
import cool from '../jsons/cool.json';
import clown from '../jsons/clown.json';
import dono from '../jsons/dono.json';
import laugh from '../jsons/laugh.json';

const EmojiPanel = ({ backgroundColor, strokecolor, textcolor }) => {
  const emojiRefs = useRef([]);
  const playerRefs = useRef([]);
  const activeEmojis = useRef([]);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const handleEmojiClick = (index) => {
    const currentEmoji = emojiRefs.current[index];

    if (activeEmojis.current.includes(index)) {
      // If the emoji is already active, reset scale and remove it from active emojis
      gsap.to(currentEmoji, { scale: 1, duration: 0.3 });
      activeEmojis.current = activeEmojis.current.filter((i) => i !== index);
      if (playerRefs.current[index]) {
        playerRefs.current[index].stop();
      }
    } else {
      // Scale up the clicked emoji and add it to active emojis
      gsap.to(currentEmoji, { scale: 1.2, duration: 0.3 });
      activeEmojis.current.push(index);

      // Play the selected emoji animation
      if (playerRefs.current[index]) {
        playerRefs.current[index].play();
      }

      // Increment the count for the clicked emoji
      setCounts((prevCounts) => {
        const newCounts = [...prevCounts];
        newCounts[index] += 1;
        return newCounts;
      });
    }
  };

  const emojis = [cool,love,clown,laugh  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: backgroundColor || 'lightblue', // Default to light blue if not provided
        borderRadius: '10px',
        height: '80px', // Increased height to accommodate counts
        width: '90%',
        margin: '0 auto',
        border: `2px solid ${strokecolor || 'black'}`,
        color: textcolor || 'white',
      }}
    >
      Reactions
      {emojis.map((emoji, index) => (
        <div
          key={index}
          ref={(el) => (emojiRefs.current[index] = el)}
          onClick={() => handleEmojiClick(index)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column', // Stack emoji and count vertically
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'scale(1)',
          }}
        >
          <Player
            ref={(player) => (playerRefs.current[index] = player)}
            autoplay={false}
            loop={false}
            keepLastFrame={true}
            src={emoji}
            style={{ height: '50px', width: '50px' }}
          />
          <span
            style={{
              color: textcolor || 'white',
              marginTop: '-5px',
              marginBottom: '7px',

              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {counts[index]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default EmojiPanel;
