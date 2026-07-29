export type Difficulty = "easy" | "medium" | "hard";

export interface APISudokuResponse {
  difficulty: Difficulty;
  puzzle: string;
  solution: string;
}

export interface CellState {
  row: number;
  col: number;
  isFixed: boolean;
  solutionValue: number;
  value: number;
  isError: boolean;
}

export interface CellPosition {
  row: number;
  col: number;
}

export type SudokuGrid = CellState[][];

export type GameMode = "assisted" | "classic";

export interface GameState {
  grid: SudokuGrid;
  difficulty: Difficulty;
  status: "idle" | "loading" | "playing" | "won" | "game-over" | "mistakes";
  mistakes: number;
  selectedCell: CellPosition | null;
  maxMistakes: number;
  gameMode: GameMode;
}
