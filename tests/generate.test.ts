import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBoard } from '../src/generate';

describe('generateBoard', () => {
  // Mock Math.random to make tests deterministic
  let randomValues: number[] = [];
  
  beforeEach(() => {
    // Reset the mock
    vi.restoreAllMocks();
    
    // Create a sequence of predictable "random" values
    randomValues = [];
    let currentValue = 0.1;
    for (let i = 0; i < 100; i++) {
      randomValues.push(currentValue);
      currentValue = (currentValue + 0.17) % 1; // Use a simple formula to generate values between 0 and 1
    }
    
    let counter = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      return randomValues[counter++ % randomValues.length];
    });
  });

  it('should generate a valid bingo board', () => {
    const board = generateBoard();

    // Check board dimensions
    expect(board.length).toBe(5);
    board.forEach(row => expect(row.length).toBe(5));
    
    // Check that center is free
    expect(board[2][2]).toBe('free');
    
    // Check column ranges (B, I, N, G, O)
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const value = board[row][col];
        
        // Skip free cell
        if (value === 'free') continue;
        
        const numValue = value as number;
        
        // Check that each column contains numbers in the correct range
        switch (col) {
          case 0: // B column (1-15)
            expect(numValue).toBeGreaterThanOrEqual(1);
            expect(numValue).toBeLessThanOrEqual(15);
            break;
          case 1: // I column (16-30)
            expect(numValue).toBeGreaterThanOrEqual(16);
            expect(numValue).toBeLessThanOrEqual(30);
            break;
          case 2: // N column (31-45)
            expect(numValue).toBeGreaterThanOrEqual(31);
            expect(numValue).toBeLessThanOrEqual(45);
            break;
          case 3: // G column (46-60)
            expect(numValue).toBeGreaterThanOrEqual(46);
            expect(numValue).toBeLessThanOrEqual(60);
            break;
          case 4: // O column (61-75)
            expect(numValue).toBeGreaterThanOrEqual(61);
            expect(numValue).toBeLessThanOrEqual(75);
            break;
        }
      }
    }
  });

  it('should generate board with no duplicate numbers', () => {
    const board = generateBoard();
    const usedNumbers = new Set<number>();
    
    // Check for duplicates
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const value = board[row][col];
        
        // Skip free cell
        if (value === 'free') continue;
        
        const numValue = value as number;
        expect(usedNumbers.has(numValue)).toBe(false);
        usedNumbers.add(numValue);
      }
    }
    
    // Should have 24 unique numbers (5x5 board minus the free space)
    expect(usedNumbers.size).toBe(24);
  });
  
  it('should generate different boards on subsequent calls', () => {
    vi.restoreAllMocks();
    const board1 = generateBoard();
    const board2 = generateBoard();
    
    // Check that at least one number is different between the boards
    let hasDifference = false;
    
    boardLoop: for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        // Skip the free cell
        if (row === 2 && col === 2) continue;
        
        if (board1[row][col] !== board2[row][col]) {
          hasDifference = true;
          break boardLoop;
        }
      }
    }
    
    expect(hasDifference).toBe(true);
  });
});
