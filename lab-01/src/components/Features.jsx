import React from 'react';
import '../styles/Features.css';

function Features() {
  const features = [
    {
      icon: '🌍',
      title: 'Real-Time Tracking',
      description: 'Track satellites in real-time with precise orbital data and predictions'
    },
    {
      icon: '🗺️',
      title: 'Interactive Sky Maps',
      description: 'Explore celestial bodies with our interactive 3D star maps and constellation guides'
    },
    {
      icon: '📡',
      title: 'Signal Analysis',
      description: 'Monitor satellite signals, frequencies, and communication patterns'
    },
    {
      icon: '🔭',
      title: 'Telescope Integration',
      description: 'Connect your telescope for automated satellite and deep-sky object tracking'
    },
    {
      icon: '📊',
      title: 'Data Visualization',
      description: 'Beautiful charts and graphs for orbital parameters and historical data'
    },
    {
      icon: '🌌',
      title: 'Deep Space Catalog',
      description: 'Access our extensive database of galaxies, nebulae, and celestial phenomena'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-description">
          Everything you need to explore the night sky and track satellites
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
