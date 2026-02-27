import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <span className="logo-icon">🛰️</span>
          <span className="logo-text">SkyMap</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#satellites">Satellites</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact" className="cta-button">Get Started</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
