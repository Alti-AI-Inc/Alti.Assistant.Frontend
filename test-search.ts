import { extractDirectSearchAnswer } from './src/lib/search-answer';

const results = [
  {
    summary: 'The Detroit Lions game is scheduled for next Sunday at 1 PM.',
    url: 'https://detroitlions.com',
    title: 'Detroit Lions Schedule'
  }
];

const answer = extractDirectSearchAnswer('when is the next detroit lions game?', results);
console.log('ANSWER:', answer);
