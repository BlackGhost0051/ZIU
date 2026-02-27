import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Satellites from './components/Satellites';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Features />
        <Satellites />
      </main>
      <Footer />
    </div>
  );
}

export default App;
