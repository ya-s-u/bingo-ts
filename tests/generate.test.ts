import { describe, it, expect } from 'vitest';
import { generateBoard } from '../src/generate';

describe('generateBoard', () => {
  it('should return a 5x5 board', () => {
    const board = generateBoard();
    expect(board.length).toBe(5);
    board.forEach(row => {
      expect(row.length).toBe(5);
    });
  });

  it('should have valid values in B-I-N-G-O columns', () => {
    const board = generateBoard();

    const checkRange = (values: (number | string)[], min: number, max: number) => {
      values.forEach(v => {
        if (v !== 'free') {
          expect(typeof v).toBe('number');
          expect(v).toBeGreaterThanOrEqual(min);
          expect(v).toBeLessThanOrEqual(max);
        }
      });
    };

    checkRange(board[0], 1, 15);    // B
    checkRange(board[1], 16, 30);   // I
    checkRange(board[2].filter((_, i) => i !== 2), 31, 45); // N without center
    checkRange(board[3], 46, 60);   // G
    checkRange(board[4], 61, 75);   // O
  });

  it('should have no duplicate numbers in each BINGO column', () => {
    const board = generateBoard();

    for (let i = 0; i < 5; i++) {
      const col = board[i];
      const filtered = i === 2 ? col.filter((_, j) => j !== 2) : col;
      const unique = new Set(filtered);
      expect(unique.size).toBe(filtered.length);
    }
  });

  it('should have "free" in the center cell', () => {
    const board = generateBoard();
    expect(board[2][2]).toBe('free');
  });
});
