// src/components/Header.js
import React from 'react';
import { Link } from 'react-scroll'; // Importing react-scroll for smooth scrolling
import './Header.css'; // Import the CSS for the header

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul>
          <li>
            <Link to="content-section" smooth={true} duration={500} className="nav-link">About</Link>
          </li>
          <li>
            <Link to="motivational-shorts-section" smooth={true} duration={500} className="nav-link">Anime Shorts</Link>
          </li>
          <li>
            <Link to="animated-stories-section" smooth={true} duration={500} className="nav-link"> Stories</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
