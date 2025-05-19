import { describe, it, expect } from 'vitest';
import { createBoard } from '../src/create';
import { ValidationError, Board } from '../src/types';

describe('createBoard', () => {
  it('should create a valid board from an array arranged by columns', () => {
    // Columns: B (1-15), I (16-30), N (31-45), G (46-60), O (61-75)
    const cells = [
      // B column
      1, 2, 3, 4, 5,
      // I column
      16, 17, 18, 19, 20,
      // N column
      31, 32, 'free' as const, 33, 34,
      // G column
      46, 47, 48, 49, 50,
      // O column
      61, 62, 63, 64, 65
    ];
    
    const result = createBoard(cells);
    
    // Check if the result is a board, not errors
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[])[0].length).toBe(5);
    
    // Check specific positions - note the mapping:
    // cells[0] (B1) → board[0][0]
    // cells[1] (B2) → board[1][0]
    // cells[5] (I1) → board[0][1]
    const board = result as Board;
    expect(board[0][0]).toBe(1);  // B1
    expect(board[1][0]).toBe(2);  // B2
    expect(board[0][1]).toBe(16); // I1
    expect(board[2][2]).toBe('free');
    expect(board[4][4]).toBe(65); // O5
    
    // Verify all positions
    // Row 0 (first of each column)
    expect(board[0][0]).toBe(1);  // B1
    expect(board[0][1]).toBe(16); // I1
    expect(board[0][2]).toBe(31); // N1
    expect(board[0][3]).toBe(46); // G1
    expect(board[0][4]).toBe(61); // O1
    
    // Middle row
    expect(board[2][0]).toBe(3);     // B3
    expect(board[2][1]).toBe(18);    // I3
    expect(board[2][2]).toBe('free'); // Center
    expect(board[2][3]).toBe(48);    // G3
    expect(board[2][4]).toBe(63);    // O3
  });
  
  it('should validate array length', () => {
    const cells = [1, 2, 3]; // Too short
    
    const result = createBoard(cells);
    
    // Should return errors
    expect(Array.isArray(result)).toBe(true);
    const errors = result as ValidationError[];
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid-length');
  });
  
  it('should validate free space position', () => {
    const cells = [
      // B column
      1, 2, 3, 4, 5,
      // I column
      16, 17, 18, 19, 20,
      // N column (no free at position 12)
      31, 32, 42, 33, 34,
      // G column
      46, 47, 48, 49, 50,
      // O column
      61, 62, 63, 64, 65
    ];
    
    const result = createBoard(cells);
    
    // Should return errors
    expect(Array.isArray(result)).toBe(true);
    const errors = result as ValidationError[];
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.type === 'incorrect-free')).toBe(true);
  });
  
  it('should detect duplicate numbers', () => {
    const cells = [
      // B column
      1, 2, 3, 4, 5,
      // I column (duplicate 17)
      16, 17, 17, 19, 20,
      // N column
      31, 32, 'free' as const, 33, 34,
      // G column
      46, 47, 48, 49, 50,
      // O column
      61, 62, 63, 64, 65
    ];
    
    const result = createBoard(cells);
    
    // Should return errors
    expect(Array.isArray(result)).toBe(true);
    const errors = result as ValidationError[];
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.type === 'duplicate')).toBe(true);
  });
  
  it('should validate cell ranges for each column', () => {
    const cells = [
      // B column (35 is out of range for B, should be 1-15)
      1, 2, 3, 4, 35,
      // I column
      16, 17, 18, 19, 20,
      // N column
      31, 32, 'free' as const, 33, 34,
      // G column
      46, 47, 48, 49, 50,
      // O column
      61, 62, 63, 64, 65
    ];
    
    const result = createBoard(cells);
    
    // Should return errors
    expect(Array.isArray(result)).toBe(true);
    const errors = result as ValidationError[];
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.type === 'out-of-range')).toBe(true);
  });
  
  it('should handle multiple error types', () => {
    const cells = [
      // B column
      1, 2, 3, 4, 5,
      // I column (90 is out of range)
      16, 90, 18, 19, 19, // duplicate 19
      // N column
      31, 32, 42, 33, 34, // missing free
      // G column
      46, 47, 48, 49, 50,
      // O column
      61, 62, 63, 64, 65
    ];
    
    const result = createBoard(cells);
    
    // Should return errors
    expect(Array.isArray(result)).toBe(true);
    const errors = result as ValidationError[];
    
    // Should have multiple errors of different types
    expect(errors.length).toBeGreaterThan(1);
    expect(errors.some(e => e.type === 'incorrect-free')).toBe(true);
    expect(errors.some(e => e.type === 'duplicate')).toBe(true);
    expect(errors.some(e => e.type === 'out-of-range')).toBe(true);
  });
  
  it('should handle multiple free spaces', () => {
    const cells = [
      // B column
      1, 2, 3, 4, 5,
      // I column
      16, 17, 18, 19, 20,
      // N column
      31, 'free', 'free', 33, 34, // two free spaces
      // G column
      46, 47, 48, 49, 50,
      // O column
      61, 62, 63, 64, 65
    ];
    
    const result = createBoard(cells as any);
    
    // Should return errors
    expect(Array.isArray(result)).toBe(true);
    const errors = result as ValidationError[];
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.type === 'incorrect-free')).toBe(true);
  });
});

