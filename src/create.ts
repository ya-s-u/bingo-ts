import { Board, ValidationError } from './types';

/**
 * Creates a Bingo board from a flat array of numbers and 'free'.
 * 
 * The input array should contain 25 elements representing the board cells.
 * The array should be arranged by columns (all B numbers, then all I numbers, etc.):
 * [B1, B2, B3, B4, B5, I1, I2, I3, I4, I5, N1, N2, 'free', N3, N4, G1, G2, G3, G4, G5, O1, O2, O3, O4, O5]
 * where 'free' should be at index 12.
 * 
 * Each column should contain numbers from specific ranges:
 * - B column (indices 0-4): 1-15
 * - I column (indices 5-9): 16-30
 * - N column (indices 10-14): 31-45 (with index 12 as 'free')
 * - G column (indices 15-19): 46-60
 * - O column (indices 20-24): 61-75
 * 
 * @param {(number | 'free')[]} cells - The array of cell values by columns (B, I, N, G, O)
 * @returns {Board | ValidationError[]} The created Board or array of validation errors
 */
export function createBoard(cells: (number | 'free')[]): Board | ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate array length
  if (cells.length !== 25) {
    errors.push({
      type: 'invalid-length',
      message: `Board must have exactly 25 cells, got ${cells.length}`
    });
    return errors;
  }
  
  // Validate free space position
  if (cells[12] !== 'free') {
    errors.push({
      type: 'incorrect-free',
      message: 'The middle cell (N3, index 12) must be "free"',
      position: 12,
      value: cells[12]
    });
  }
  
  // Check for duplicates
  const numbers = cells.filter(cell => cell !== 'free') as number[];
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size !== numbers.length) {
    const duplicates = numbers.filter((num, index) => numbers.indexOf(num) !== index);
    duplicates.forEach(duplicate => {
      errors.push({
        type: 'duplicate',
        message: `Duplicate number found: ${duplicate}`,
        value: duplicate
      });
    });
  }
  
  // Define column ranges and their indices in the flat array
  const columns = [
    { name: 'B', indices: [0, 1, 2, 3, 4], min: 1, max: 15 },
    { name: 'I', indices: [5, 6, 7, 8, 9], min: 16, max: 30 },
    { name: 'N', indices: [10, 11, 12, 13, 14], min: 31, max: 45 },
    { name: 'G', indices: [15, 16, 17, 18, 19], min: 46, max: 60 },
    { name: 'O', indices: [20, 21, 22, 23, 24], min: 61, max: 75 }
  ];
  
  // Validate each cell is in the correct range for its column
  columns.forEach(column => {
    column.indices.forEach(index => {
      const cell = cells[index];
      
      // Skip free space validation
      if (cell === 'free') {
        if (index !== 12) {
          errors.push({
            type: 'incorrect-free',
            message: `Free space should only be at the middle position (N3, index 12), found at index ${index}`,
            position: index,
            value: 'free'
          });
        }
        return;
      }
      
      // Validate cell type
      if (typeof cell !== 'number') {
        errors.push({
          type: 'invalid-type',
          message: `Expected a number or 'free', got ${typeof cell}`,
          position: index,
          value: cell
        });
        return;
      }
      
      // Validate cell is in the correct range for its column
      if (cell < column.min || cell > column.max) {
        errors.push({
          type: 'out-of-range',
          message: `Cell at position ${index} (${column.name} column) should be between ${column.min} and ${column.max}, got ${cell}`,
          position: index,
          value: cell
        });
      }
    });
  });
  
  // Return errors if any were found
  if (errors.length > 0) {
    return errors;
  }
  
  // Create the board in row-major order as required by Board type
  const board: any[][] = Array(5).fill(null).map(() => Array(5).fill(null));
  
  // Remap flat array to 2D board
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      // Calculate index in the input array
      // For example, for (row=0, col=0), we want cells[0] (B1)
      // For (row=1, col=0), we want cells[1] (B2)
      // For (row=0, col=1), we want cells[5] (I1)
      const index = col * 5 + row;
      board[row][col] = cells[index];
    }
  }
  
  return board as Board;
}

