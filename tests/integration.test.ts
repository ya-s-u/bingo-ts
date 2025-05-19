import { describe, it, expect, vi } from 'vitest';
import { generateBoard } from '../src/generate';
import { judgeBoard } from '../src/judge';
import { Num } from '../src/types';

describe('Integration tests', () => {
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
    const opensFourOfFive = firstRow.slice(0, 4) as Num[];
    result = judgeBoard(board, opensFourOfFive);
    expect(result.status).toBe('waiting');
    if (result.status === 'waiting') {
      expect(result.waitings.some(w => w.remaining === firstRow[4])).toBe(true);
      // Check cell status
      expect(result.cells[0][4]).toBe('waiting'); // The last cell in the row should be 'waiting'
    }
    
    // Test with complete row
    result = judgeBoard(board, firstRow);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Check cell status for the bingo line
      for (let col = 0; col < 5; col++) {
        expect(result.cells[0][col]).toBe('bingo');
      }
    }
    
    // Test with complete column
    result = judgeBoard(board, firstCol);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Check cell status for the bingo line
      for (let row = 0; row < 5; row++) {
        expect(result.cells[row][0]).toBe('bingo');
      }
    }
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
          allNumbers.push(cell as Num);
        }
      }
    }
    
    // Test with all numbers opened
    const result = judgeBoard(board, allNumbers);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Should have 12 bingos (5 rows + 5 columns + 2 diagonals)
      expect(result.bingos.length).toBe(12);
      
      // All cells should have 'bingo' status
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          expect(result.cells[row][col]).toBe('bingo');
        }
      }
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
          mainDiagonal.push(cell as Num);
        }
      }
    }
    
    // Get the other diagonal numbers (excluding free)
    const otherDiagonal: Num[] = [];
    for (let i = 0; i < 5; i++) {
      if (i !== 2) { // Skip the center free space
        const cell = board[i][4-i];
        if (cell !== 'free') {
          otherDiagonal.push(cell as Num);
        }
      }
    }
    
    // Test with main diagonal
    let result = judgeBoard(board, mainDiagonal);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Check cell status for the diagonal
      for (let i = 0; i < 5; i++) {
        expect(result.cells[i][i]).toBe('bingo');
      }
    }
    
    // Test with other diagonal
    result = judgeBoard(board, otherDiagonal);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      // Check cell status for the other diagonal
      for (let i = 0; i < 5; i++) {
        expect(result.cells[i][4-i]).toBe('bingo');
      }
    }
    
    // Test with both diagonals
    const allDiagonals = [...new Set([...mainDiagonal, ...otherDiagonal])];
    result = judgeBoard(board, allDiagonals);
    expect(result.status).toBe('bingo');
    if (result.status === 'bingo') {
      expect(result.bingos.length).toBe(2); // Both diagonals should be bingos
    }
  });
  
  it('should correctly identify cell status in different scenarios', () => {
    // Generate a board
    const board = generateBoard();
    
    // Open some random cells (not forming any lines)
    const randomOpens: Num[] = [];
    randomOpens.push(board[0][0] as Num);
    randomOpens.push(board[1][2] as Num);
    randomOpens.push(board[3][4] as Num);
    
    let result = judgeBoard(board, randomOpens);
    expect(result.status).toBe('none');
    
    // Check opened cells
    expect(result.cells[0][0]).toBe('opened');
    expect(result.cells[1][2]).toBe('opened');
    expect(result.cells[3][4]).toBe('opened');
    
    // Check free cell is always 'opened'
    expect(result.cells[2][2]).toBe('opened');
    
    // Check some closed cells
    expect(result.cells[0][1]).toBe('closed');
    expect(result.cells[4][4]).toBe('closed');
  });
});