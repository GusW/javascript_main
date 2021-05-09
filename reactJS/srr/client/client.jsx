import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

// ReactDOM.render(<App />, document.querySelector('#Container'));
let state = undefined;

console.info('Client:: Fetching data from server');

fetch('http://localhost:7777/data')
  .then((data) => data.json())
  .then((json) => {
    state = json;
    render();
  });

const handleVote = (answerId, increment) => {
  state.answers = state.answers.map((answer) => {
    if (answer.answerId !== answerId) {
      return answer;
    } else {
      return { ...answer, upvotes: answer.upvotes + increment };
    }
  });
  render();
};

const render = () => {
  ReactDOM.hydrate(
    <App {...state} handleVote={handleVote} />,
    document.querySelector('#Container')
  );
};
