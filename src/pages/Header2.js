import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll'; // For smooth scrolling
import { useNavigate } from 'react-router-dom'; // For navigation
import './Header.css'; // Import CSS
import rejuv2 from '../images/black.png';
import homeIcon from '../icons/home.svg'; // Importing home icon

import animationIcon from '../icons/story3.png'; // Importing the book icon
import explainerIcon from '../icons/video.png'; 
const Header2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate(); // Hook for navigation

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
        <img
          src={rejuv2}
          alt="Rejuvl"
          className="header-logo"
          onClick={() => navigate('/')} // Link to the main page
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="nav-container">
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            
            <li>
              <Link
                to="brand-container"
                smooth={true}
                duration={500}
                className="nav-link"
                onClick={toggleMenu}
              >
                <img
                  src={animationIcon}
                  alt="Animation Icon"
                  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                />
                Brand Animations
              </Link>
            </li>
            <li>
              <Link
                to="explainer-section"
                smooth={true}
                duration={500}
                className="nav-link"
                onClick={toggleMenu}
              >
                <img
                  src={explainerIcon}
                  alt="Explainer Icon"
                  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                />
                Explainers
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header2;
