import { describe, it, expect } from 'vitest';
import { judgeBoard } from '../src/judge';
import { Board, Num, Cell } from '../src/types';

describe('judgeBoard', () => {
  it('should detect a bingo in a row', () => {
    // Create a test board - we use "as Board" to override type checking for tests
    const board = [
      [1, 2, 3, 4, 5],
      [16, 17, 18, 19, 20],
      [31, 32, 'free', 33, 34],
      [46, 47, 48, 49, 50],
      [61, 62, 63, 64, 65]
    ] as unknown as Board;
    
    // No opens yet - should be none
    let result = judgeBoard(board, []);
    expect(result.status).toBe('none');
    
    // Open some numbers but not all in a row
    result = judgeBoard(board, [1, 2, 3, 4] as Num[]);
    expect(result.status).toBe('waiting');
    if (result.status === 'waiting') {
      expect(result.waitings.length).toBe(1);
      expect(result.waitings[0].remaining).toBe(5);
    }
    
    // Open all numbers in the first row
    result = judgeBoard(board, [1, 2, 3, 4, 5] as Num[]);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(1);
      expect(result.bingos[0].line).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it('should detect a bingo in a column', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open all numbers in the second column
    const result = judgeBoard(board, [16, 17, 18, 19, 20] as Num[]);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(1);
      expect(result.bingos[0].line).toEqual([16, 17, 18, 19, 20] as unknown as Cell[]);
    }
  });

  it('should detect a bingo in the main diagonal', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open all numbers in the main diagonal except the free space
    const result = judgeBoard(board, [1, 17, 49, 65] as Num[]);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(1);
      expect(result.bingos[0].line).toEqual([1, 17, 'free', 49, 65] as unknown as Cell[]);
    }
  });

  it('should detect a bingo in the other diagonal', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open all numbers in the other diagonal except the free space
    const result = judgeBoard(board, [61, 47, 19, 5] as Num[]);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(1);
      expect(result.bingos[0].line).toEqual([61, 47, 'free', 19, 5] as unknown as Cell[]);
    }
  });

  it('should detect multiple bingos', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open numbers for multiple bingos (row, column, diagonal)
    const opens: Num[] = [
      // First row
      1, 16, 31, 46, 61,
      // N column
      31, 32, 33, 34,
      // Main diagonal
      1, 17, 49, 65
    ] as Num[];
    
    const result = judgeBoard(board, opens);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Should detect 3 bingos: first row, third column, and main diagonal
      expect(result.bingos.length).toBe(3);
    }
  });

  it('should detect waiting status correctly', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open numbers to create waiting lines
    const opens: Num[] = [
      // Almost first row
      1, 16, 31, 46,
      // Almost second column
      16, 17, 18, 19
    ] as Num[];
    
    const result = judgeBoard(board, opens);
    expect(result.status).toBe('waiting');
    if (result.status === 'waiting') {
      expect(result.waitings.length).toBe(2);
      
      // Check that the waiting cells are correct
      const remainingCells = result.waitings.map(w => w.remaining);
      expect(remainingCells).toContain(61); // missing from first row
      expect(remainingCells).toContain(20); // missing from second column
    }
  });

  it('should handle the free space correctly', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open just the middle row except for the free space
    const opens: Num[] = [3, 18, 48, 63] as Num[];
    
    const result = judgeBoard(board, opens);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(1);
      expect(result.bingos[0].line).toEqual([3, 18, 'free', 48, 63] as unknown as Cell[]);
    }
  });

  it('should return none when no bingos or waitings', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open a few scattered numbers
    const opens: Num[] = [1, 17, 34, 46, 62] as Num[];
    
    const result = judgeBoard(board, opens);
    expect(result.status).toBe('none');
  });
  
  it('should correctly determine cell status', () => {
    // Create a test board
    const board = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 'free', 48, 63],
      [4, 19, 33, 49, 64],
      [5, 20, 34, 50, 65]
    ] as unknown as Board;
    
    // Open some numbers to create different cell statuses
    const opens: Num[] = [
      // First row except last number (creates a waiting line)
      1, 16, 31, 46,
      // Middle column to complete a bingo
      31, 32, 33, 34,
      // Some other random numbers
      2, 19
    ] as Num[];
    
    const result = judgeBoard(board, opens);
    
    // The board should be in bingo state due to the middle column
    expect(result.status).toBe('bingo');
    
    // Check specific cell statuses
    const { cells } = result;
    
    // Check bingo cells (middle column)
    expect(cells[0][2]).toBe('bingo'); // 31
    expect(cells[1][2]).toBe('bingo'); // 32
    expect(cells[2][2]).toBe('bingo'); // free
    expect(cells[3][2]).toBe('bingo'); // 33
    expect(cells[4][2]).toBe('bingo'); // 34
    
    // Check waiting cell (last in first row)
    expect(cells[0][4]).toBe('waiting'); // 61
    
    // Check opened cells that are not part of bingo or waiting
    expect(cells[0][0]).toBe('opened'); // 1
    expect(cells[1][0]).toBe('opened'); // 2
    expect(cells[3][1]).toBe('opened'); // 19
    
    // Check closed cells
    expect(cells[1][4]).toBe('closed'); // 62
    expect(cells[4][0]).toBe('closed'); // 5
    expect(cells[4][3]).toBe('closed'); // 50
  });
});