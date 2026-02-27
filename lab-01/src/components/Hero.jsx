import React from 'react';
import '../styles/Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="stars"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Track Satellites
          <span className="hero-subtitle">Explore the Cosmos</span>
        </h1>
        <p className="hero-description">
          Real-time satellite tracking, celestial mapping, and astronomical data
          visualization. Monitor ISS, Starlink, and thousands of satellites orbiting Earth.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Start Tracking</button>
          <button className="btn btn-secondary">Watch Demo</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">5,000+</span>
            <span className="stat-label">Active Satellites</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Live Tracking</span>
          </div>
          <div className="stat">
            <span className="stat-number">100K+</span>
            <span className="stat-label">Users Worldwide</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="orbit-container">
          <div className="planet"></div>
          <div className="satellite sat-1"></div>
          <div className="satellite sat-2"></div>
          <div className="satellite sat-3"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
