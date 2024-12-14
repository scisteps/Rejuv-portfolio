import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll'; // Importing react-scroll for smooth scrolling
import './Header.css'; // Import the CSS for the header
import rejuvl from '../images/gray.png';
import rejuv2 from '../images/black.png';
import book from '../icons/story3.png'; // Importing the book icon
import video from '../icons/video.png'; // Importing the book icon
import information from '../icons/information.png'; // Importing the book icon
import youtube from '../jsons/youtube.json';
import { Player } from '@lottiefiles/react-lottie-player';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-logo-container">
      <Link
                  to="current-animation"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                  onClick={toggleMenu}
                >
        <img src={rejuv2} alt="Rejuvl" className="header-logo" />
        </Link>
      </div>
      <div className="nav-container">
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              {isMobile ? (
                <Link
                  to="content-section2"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                  onClick={toggleMenu}
                >
                                         <img 
  src={information}
  alt="information Icon"
  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
/>
                  About
                </Link>
              ) : (
                <Link
                  to="content-section"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                  onClick={toggleMenu}
                >
                             <img 
  src={information}
  alt="information Icon"
  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
/>
                  About
                </Link>
              )}
            </li>
            <li>
              <Link
                to="motivational-shorts-section"
                smooth={true}
                duration={500}
                className="nav-link"
                onClick={toggleMenu}
              >
                             <img 
  src={video}
  alt="video Icon"
  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
/>
                 Reels
              </Link>
            </li>
            <li>
              <Link
                to="animated-stories-section"
                smooth={true}
                duration={500}
                className="nav-link"
                onClick={toggleMenu}
              >
                <img 
  src={book}
  alt="Book Icon"
  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
/>

                Stories
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
