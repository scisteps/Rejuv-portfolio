import React, { useState } from 'react';
import { Link } from 'react-scroll'; // Importing react-scroll for smooth scrolling
import './Header.css'; // Import the CSS for the header
import rejuvl from '../images/gray.png';
import rejuv2 from '../images/black.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
       <div class="header-logo-container">
    <img src={rejuv2} alt="Rejuvl" class="header-logo" />
  </div>
      <div className="nav-container">
      
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link to="content-section" smooth={true} duration={500} className="nav-link" onClick={toggleMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="motivational-shorts-section" smooth={true} duration={500} className="nav-link" onClick={toggleMenu}>
                Anime Shorts
              </Link>
            </li>
            <li>
              <Link to="animated-stories-section" smooth={true} duration={500} className="nav-link" onClick={toggleMenu}>
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
