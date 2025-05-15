import { Board, Cell, Line, Num, Result } from './types';

/**
 * Judges a Bingo board's status based on the opened numbers.
 * 
 * Analyzes a Bingo board to determine if there are any complete Bingo lines
 * (horizontal, vertical, or diagonal) or if there are any lines that are one number away from completion.
 * 
 * @param {Board} board - The Bingo board to judge
 * @param {Num[]} opens - Array of numbers that have been called/opened
 * @returns {Result} The result of the board analysis:
 *   - Bingo: At least one complete line
 *   - Waiting: At least one line that needs just one more number
 *   - None: No lines close to completion
 */
export function judgeBoard(board: Board, opens: Num[]): Result {
  // Get all possible lines (rows, columns, diagonals)
  const lines = getAllLines(board);
  
  // Find complete bingo lines and waiting lines
  const bingos: { line: Line }[] = [];
  const waitings: { lines: Line, remaining: Cell }[] = [];
  
  for (const line of lines) {
    const remainingCells = line.filter(cell => {
      if (cell === 'free') return false; // Free cell is already marked
      return !opens.includes(cell as Num);
    });
    
    if (remainingCells.length === 0) {
      // This is a complete bingo line
      bingos.push({ line });
    } else if (remainingCells.length === 1) {
      // This line needs just one more number
      waitings.push({ 
        lines: line, 
        remaining: remainingCells[0] 
      });
    }
  }
  
  // Determine the overall status of the board
  if (bingos.length > 0) {
    return {
      status: 'bingo',
      bingos,
      waitings
    };
  } else if (waitings.length > 0) {
    return {
      status: 'waiting',
      waitings
    };
  } else {
    return { status: 'none' };
  }
}

/**
 * Gets all possible lines on a Bingo board (rows, columns, diagonals).
 * 
 * @param {Board} board - The Bingo board
 * @returns {Line[]} Array of all possible lines
 */
function getAllLines(board: Board): Line[] {
  const lines: Line[] = [];
  
  // Add rows
  for (let i = 0; i < 5; i++) {
    lines.push(board[i] as Line);
  }
  
  // Add columns
  for (let col = 0; col < 5; col++) {
    const column: Cell[] = [];
    for (let row = 0; row < 5; row++) {
      column.push(board[row][col]);
    }
    lines.push(column as Line);
  }
  
  // Add main diagonal (top-left to bottom-right)
  const diagonal1: Cell[] = [];
  for (let i = 0; i < 5; i++) {
    diagonal1.push(board[i][i]);
  }
  lines.push(diagonal1 as Line);
  
  // Add other diagonal (top-right to bottom-left)
  const diagonal2: Cell[] = [];
  for (let i = 0; i < 5; i++) {
    diagonal2.push(board[i][4 - i]);
  }
  lines.push(diagonal2 as Line);
  
  return lines;
}
