import { describe, expect, it } from 'vitest';
import { extractDirectSearchAnswer } from '../search-answer';

describe('extractDirectSearchAnswer', () => {
  it("returns 'No results found.' when results array is empty", () => {
    const query = 'What was the score of the game?';
    const answer = extractDirectSearchAnswer(query, []);
    expect(answer).toBe('No results found.');
  });

  it('extracts direct answer from a mock result containing a score', () => {
    const query = 'What was the score of the Bills vs Chiefs game?';
    const mockResults = [
      {
        summary:
          'The Buffalo Bills defeated the Kansas City Chiefs 30-21 in an exciting matchup.',
        title: 'Bills vs Chiefs Final Score',
        url: 'https://www.espn.com/nfl/game',
      },
    ];

    const answer = extractDirectSearchAnswer(query, mockResults);
    expect(answer).toContain('30-21');
    expect(answer).toContain('Buffalo Bills');
    expect(answer).toContain('Kansas City Chiefs');
  });
});
