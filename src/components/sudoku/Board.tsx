import { CellPosition, SudokuGrid } from "@/types/sudoku";
import Cell from "./Cell";

interface BoardProps {
  grid: SudokuGrid;
  selectedCell: CellPosition | null; 
  onCellClick: (row: number, col: number) => void; 
}

export default function Board({ grid, selectedCell, onCellClick }: BoardProps) {
  if (!grid || grid.length === 0) return null;

  return (
    // The container manages max-width for responsiveness and forces a perfect square
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto aspect-square shadow-xl">
      {/* The actual 9x9 CSS grid with a thick outer border */}
      <div className="grid grid-cols-9 w-full h-full border-2 border-gray-800 bg-white">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              cell={cell}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          )),
        )}
      </div>
    </div>
  );
}