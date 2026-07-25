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