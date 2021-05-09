import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import debug from 'debug';
import { readFileSync } from 'fs';

import App from '../client/App';

const app = express();
const debugApp = debug('app');

const data = {
  questions: [
    {
      questionId: 'Q1',
      content: 'Which back end solution should we use for our application?',
    },
    {
      questionId: 'Q2',
      content:
        'What percentage of developer time should be devoted to end-to-end testing?',
    },
  ],
  answers: [
    {
      answerId: 'A1',
      questionId: 1,
      upvotes: 2,
      content: 'Apache',
    },
    {
      answerId: 'A2',
      questionId: 'Q1',
      upvotes: 0,
      content: 'Java',
    },
    {
      answerId: 'A3',
      questionId: 'Q1',
      upvotes: 4,
      content: 'Node.js',
    },
    {
      answerId: 'A4',
      questionId: 'Q2',
      upvotes: 2,
      content: '25%',
    },
    {
      answerId: 'A5',
      questionId: 'Q2',
      upvotes: 1,
      content: '50%',
    },
    {
      answerId: 'A6',
      questionId: 'Q2',
      upvotes: 1,
      content: '75%',
    },
  ],
};

// Middlewares
app.use(express.static('dist'));

app.get('/', async (_req, res) => {
  const index = readFileSync('public/index.html', 'utf8');
  const rendered = renderToString(<App {...data} />);
  res.send(index.replace('{{rendered}}', rendered));
});

app.get('/data', async (_req, res) => {
  res.json(data);
});

app.listen(7777);
debugApp(`Server running on 7777`);
