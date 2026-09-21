import { extractDirectSearchAnswer } from './src/lib/search-answer';
const res = extractDirectSearchAnswer('when is the next detroit lions game?', [{ summary: 'Detroit Lions next game is Sunday', url: 'https://detroitlions.com', title: 'Schedule' }]);
console.log('ANSWER:', res);
