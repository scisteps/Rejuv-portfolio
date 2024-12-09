import React, { useEffect, useRef } from 'react';
import dashjs from 'dashjs';

const VideoPlayer = ({ videoSource, onPlay }) => {
  const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            const player = dashjs.MediaPlayer().create();
            player.initialize(videoRef.current, '/shadow2/shadow_animation.mpd', true);
        }
    }, []);

    return (
        <div>
          
          <video
        ref={videoRef}
        controls
        style={{ width: '100%', maxHeight: '500px',borderRadius:'10px' }}
        onPlay={onPlay} 
      >
        <source src={videoSource} type="application/dash+xml" />
        Your browser does not support the video tag.
      </video>

        </div>
    );
};

export default VideoPlayer;
