import { CellState, SudokuGrid } from "@/types/sudoku";

export default function stringToSudokuGridMapper(
  puzzle: string,
  solution: string,
): SudokuGrid {
  const grid: SudokuGrid = [];

  if (puzzle.length !== 81 || solution.length !== 81) {
    throw new Error("Puzzle or Solutions are not 81 characters long");
  }

  for (let row = 0; row < 9; row++) {
    const currentRow: CellState[] = [];

    for (let col = 0; col < 9; col++) {
      const stringIndex = row * 9 + col;

      const value = parseInt(puzzle[stringIndex]);
      const solutionValue = parseInt(solution[stringIndex]);

      currentRow.push({
        row,
        col,
        value,
        solutionValue,
        isFixed: value !== 0,
        isError: false,
      });
    }

    grid.push(currentRow);
  }

  return grid;
}
