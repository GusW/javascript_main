import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Playground from './sandbox/Sandbox';
import GithubCardsApp from './github_cards_app/App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    {/* <Playground /> */}
    <GithubCardsApp title="The Github Cards App" />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
