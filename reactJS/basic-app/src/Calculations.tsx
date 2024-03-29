import React from 'react';
import logo from './logo.svg';
import './App.css';
import pingFrontendAPI from './API'

const Calculations = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="landing-page">
          Pricing Platform Landing Page
        </p>
        <button type="button" onClick={pingFrontendAPI}>Ping FrontEnd API</button>
      </header>
    </div>
  );
}

export default Calculations;
