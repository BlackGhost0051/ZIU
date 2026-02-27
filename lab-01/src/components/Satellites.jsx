import React from 'react';
import '../styles/Satellites.css';

function Satellites() {
  const satellites = [
    {
      name: 'ISS',
      fullName: 'International Space Station',
      altitude: '408 km',
      speed: '27,600 km/h',
      status: 'Active'
    },
    {
      name: 'Hubble',
      fullName: 'Hubble Space Telescope',
      altitude: '547 km',
      speed: '27,300 km/h',
      status: 'Active'
    },
    {
      name: 'Starlink-1',
      fullName: 'Starlink Constellation',
      altitude: '550 km',
      speed: '27,000 km/h',
      status: 'Active'
    },
    {
      name: 'JWST',
      fullName: 'James Webb Space Telescope',
      altitude: '1.5M km',
      speed: 'L2 Orbit',
      status: 'Active'
    }
  ];

  return (
    <section id="satellites" className="satellites">
      <div className="container">
        <h2 className="section-title">Featured Satellites</h2>
        <p className="section-description">
          Track the most important satellites and space stations
        </p>
        <div className="satellites-grid">
          {satellites.map((sat, index) => (
            <div key={index} className="satellite-card">
              <div className="satellite-header">
                <h3 className="satellite-name">{sat.name}</h3>
                <span className={`status-badge ${sat.status.toLowerCase()}`}>
                  {sat.status}
                </span>
              </div>
              <p className="satellite-full-name">{sat.fullName}</p>
              <div className="satellite-info">
                <div className="info-item">
                  <span className="info-label">Altitude</span>
                  <span className="info-value">{sat.altitude}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Speed</span>
                  <span className="info-value">{sat.speed}</span>
                </div>
              </div>
              <button className="track-button">Track Now →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Satellites;
