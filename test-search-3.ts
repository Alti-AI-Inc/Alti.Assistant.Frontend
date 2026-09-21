import { extractDirectSearchAnswer } from './src/lib/search-answer';
const results = [{ summary: 'Detroit Lions next game is Sunday', url: 'https://detroitlions.com', title: 'Schedule' }];
console.log('Result:', extractDirectSearchAnswer('when is the next detroit lions game?', results));
