import { describe, it, expect, vi } from 'vitest';
import { generateBoard } from '../src/generate';
import { judgeBoard } from '../src/judge';
import { Num } from '../src/types';

describe('Integrations', () => {
  it('should generate a valid board and correctly judge its status', () => {
    // Mock random to create a predictable board
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
    
    // Generate a board
    const board = generateBoard();
    
    // Record the values from the board
    const firstRow = board[0] as Num[];
    const firstCol = [board[0][0], board[1][0], board[2][0], board[3][0], board[4][0]] as Num[];
    
    // Test with no opens
    let result = judgeBoard(board, []);
    expect(result.status).toBe('none');
    
    // Test with 4 out of 5 numbers in first row
    const opensFourOfFive = firstRow.slice(0, 4);
    result = judgeBoard(board, opensFourOfFive);
    expect(result.status).toBe('waiting');
    if (result.status === 'waiting') {
      expect(result.waitings.some(w => w.remaining === firstRow[4])).toBe(true);
    }
    
    // Test with complete row
    result = judgeBoard(board, firstRow);
    expect(result.status).toBe('bingo');
    
    // Test with complete column
    result = judgeBoard(board, firstCol);
    expect(result.status).toBe('bingo');
  });
  
  it('should correctly handle a full board (all numbers opened)', () => {
    // Generate a board
    const board = generateBoard();
    
    // Get all numbers from the board (excluding free)
    const allNumbers: Num[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const cell = board[row][col];
        if (cell !== 'free') {
          allNumbers.push(cell);
        }
      }
    }
    
    // Test with all numbers opened
    const result = judgeBoard(board, allNumbers);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Should have 12 bingos (5 rows + 5 columns + 2 diagonals)
      expect(result.bingos.length).toBe(12);
    }
  });
  
  it('should detect diagonal bingos with free space', () => {
    // Generate a board
    const board = generateBoard();
    
    // Get the main diagonal numbers (excluding free)
    const mainDiagonal: Num[] = [];
    for (let i = 0; i < 5; i++) {
      if (i !== 2) { // Skip the center free space
        const cell = board[i][i];
        if (cell !== 'free') {
          mainDiagonal.push(cell);
        }
      }
    }
    
    // Get the other diagonal numbers (excluding free)
    const otherDiagonal: Num[] = [];
    for (let i = 0; i < 5; i++) {
      if (i !== 2) { // Skip the center free space
        const cell = board[i][4-i];
        if (cell !== 'free') {
          otherDiagonal.push(cell);
        }
      }
    }
    
    // Test with main diagonal
    let result = judgeBoard(board, mainDiagonal);
    expect(result.status).toBe('bingo');
    
    // Test with other diagonal
    result = judgeBoard(board, otherDiagonal);
    expect(result.status).toBe('bingo');
    
    // Test with both diagonals
    const allDiagonals = [...new Set([...mainDiagonal, ...otherDiagonal])];
    result = judgeBoard(board, allDiagonals);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(2); // Both diagonals should be bingos
    }
  });
});
