import { Board, B, I, N, G, O } from './types';

/**
 * Generates a random Bingo board.
 * 
 * A standard Bingo board consists of:
 * - B column: numbers 1-15
 * - I column: numbers 16-30
 * - N column: numbers 31-45 (with middle spot as 'free')
 * - G column: numbers 46-60
 * - O column: numbers 61-75
 * 
 * Each column contains 5 random numbers from its range,
 * with no duplicates within a column.
 * The center cell (3rd row, 3rd column) is a free space.
 * 
 * @returns {Board} A randomly generated valid Bingo board
 */
export function generateBoard(): Board {
  // Create random numbers for each column without duplicates
  const bColumn = getRandomUniqueNumbers(1, 15, 5) as B[];
  const iColumn = getRandomUniqueNumbers(16, 30, 5) as I[];
  const nColumn = getRandomUniqueNumbers(31, 45, 5) as N[];
  const gColumn = getRandomUniqueNumbers(46, 60, 5) as G[];
  const oColumn = getRandomUniqueNumbers(61, 75, 5) as O[];

  // Create the board with columns
  const board: Board = [
    [bColumn[0], bColumn[1], bColumn[2], bColumn[3], bColumn[4]],
    [iColumn[0], iColumn[1], iColumn[2], iColumn[3], iColumn[4]],
    [nColumn[0], nColumn[1], 'free', nColumn[2], nColumn[3]],
    [gColumn[0], gColumn[1], gColumn[2], gColumn[3], gColumn[4]],
    [oColumn[0], oColumn[1], oColumn[2], oColumn[3], oColumn[4]]
  ];

  // Transpose the board to match the expected format
  return transposeBoard(board);
}

/**
 * Generates an array of random unique numbers within a specified range.
 * 
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @param {number} count - The number of unique values to generate
 * @returns {number[]} An array of random unique numbers
 */
function getRandomUniqueNumbers(min: number, max: number, count: number): number[] {
  // Create an array with all possible numbers in the range
  const numbers: number[] = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Return the first 'count' elements
  return numbers.slice(0, count);
}

/**
 * Transposes the board from column-based to row-based format.
 * 
 * @param {any[][]} board - The column-based board to transpose
 * @returns {Board} The transposed board in row-based format
 */
function transposeBoard(board: any[][]): Board {
  const transposed: any[][] = Array(5).fill(null).map(() => Array(5).fill(null));
  
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      transposed[row][col] = board[col][row];
    }
  }
  
  // Override the center with 'free'
  transposed[2][2] = 'free';
  
  return transposed as Board;
}
