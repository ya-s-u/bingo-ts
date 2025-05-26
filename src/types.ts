/**
 * Type definitions for Bingo game components
 */

// Column type definitions
export type B = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type I = 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;
export type N = 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45;
export type G = 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60;
export type O = 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75;

// Special cell types
export type Free = 'free';
export type Num = B | I | N | G | O;
export type Cell = Num | Free;

// Board type
export type Board = [
  [B, B, B, B, B],
  [I, I, I, I, I],
  [N, N, Free, N, N],
  [G, G, G, G, G],
  [O, O, O, O, O]
];

// Line type for checking bingo patterns
export type Line = [Cell, Cell, Cell, Cell, Cell];

// Cell status types
export type CellStatus = 'bingo' | 'waiting' | 'opened' | 'closed';

// Cell status map
export type CellsMap = {
  [row: number]: {
    [col: number]: CellStatus;
  };
};

// Validation error types
export type ValidationError = {
  type: 'duplicate' | 'out-of-range' | 'incorrect-free' | 'invalid-type' | 'invalid-length';
  message: string;
  position?: number;
  value?: any;
};

// Result types for board evaluation
export type Bingo = {
  status: 'bingo',
  bingos: { line: Line }[],
  waitings: { lines: Line, remaining: Num }[],
  cells: CellsMap
};

export type Waiting = {
  status: 'waiting',
  waitings: { lines: Line, remaining: Num }[],
  cells: CellsMap
};

export type None = { 
  status: 'none',
  cells: CellsMap
};

export type Result = Bingo | Waiting | None;
