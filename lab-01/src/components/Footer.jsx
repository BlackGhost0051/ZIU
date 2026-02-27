import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="logo-icon">🛰️</span> SkyMap
            </h3>
            <p className="footer-description">
              Your gateway to the cosmos. Track satellites, explore celestial maps,
              and discover the wonders of space.
            </p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#satellites">Satellites</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#api">API</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press Kit</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SkyMap. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
