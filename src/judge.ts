import { Board, Cell, Line, Num, Result, Bingo, Waiting, None, CellsMap, CellStatus } from './types';

/**
 * Judges a Bingo board's status based on the opened numbers.
 * 
 * Analyzes a Bingo board to determine if there are any complete Bingo lines
 * (horizontal, vertical, or diagonal) or if there are any lines that are one number away from completion.
 * Also determines the status of each cell on the board.
 * 
 * @param {Board} board - The Bingo board to judge
 * @param {Num[]} opens - Array of numbers that have been called/opened
 * @returns {Result} The result of the board analysis:
 *   - Bingo: At least one complete line
 *   - Waiting: At least one line that needs just one more number
 *   - None: No lines close to completion
 *   - All results include cells which maps each cell to its status:
 *     - 'bingo': Cell is part of a completed bingo line
 *     - 'waiting': Cell is the last remaining cell in a line that needs one more number
 *     - 'opened': Cell has been opened but is not part of a bingo or waiting line
 *     - 'closed': Cell has not been opened
 */
export function judgeBoard(board: Board, opens: Num[]): Result {
  // Get all possible lines (rows, columns, diagonals)
  const lines = getAllLines(board);
  
  // Find complete bingo lines and waiting lines
  const bingos: { line: Line }[] = [];
  const waitings: { lines: Line, remaining: Num }[] = [];
  
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
        remaining: remainingCells[0] as Num
      });
    }
  }
  
  // Determine the status of each cell
  const cells = determineAllCellStatus(board, opens, bingos, waitings);
  
  // Determine the overall status of the board
  if (bingos.length > 0) {
    return {
      status: 'bingo',
      bingos,
      waitings,
      cells
    };
  } else if (waitings.length > 0) {
    return {
      status: 'waiting',
      waitings,
      cells
    };
  } else {
    return { 
      status: 'none',
      cells
    };
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

/**
 * Determines the status of each cell on the board.
 * 
 * @param {Board} board - The Bingo board
 * @param {Num[]} opens - Array of numbers that have been called/opened
 * @param {{ line: Line }[]} bingos - Array of completed bingo lines
 * @param {{ lines: Line, remaining: Cell }[]} waitings - Array of lines that need one more number
 * @returns {CellsMap} Map of cell positions to their status
 */
function determineAllCellStatus(
  board: Board, 
  opens: Num[], 
  bingos: { line: Line }[], 
  waitings: { lines: Line, remaining: Cell }[]
): CellsMap {
  const cells: CellsMap = {};
  
  // Initialize all cells as closed
  for (let row = 0; row < 5; row++) {
    cells[row] = {};
    for (let col = 0; col < 5; col++) {
      cells[row][col] = 'closed';
    }
  }
  
  // Set all opened cells to 'opened'
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = board[row][col];
      if (cell === 'free' || opens.includes(cell as Num)) {
        cells[row][col] = 'opened';
      }
    }
  }
  
  // Set cells that are part of a bingo to 'bingo'
  for (const { line } of bingos) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (line.includes(board[row][col])) {
          cells[row][col] = 'bingo';
        }
      }
    }
  }
  
  // Set remaining cells in waiting lines to 'waiting'
  for (const { remaining } of waitings) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (board[row][col] === remaining) {
          cells[row][col] = 'waiting';
        }
      }
    }
  }
  
  return cells;
}

