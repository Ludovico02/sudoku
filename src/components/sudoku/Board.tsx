import { CellPosition, SudokuGrid } from "@/types/sudoku";
import Cell from "./Cell";

interface BoardProps {
  grid: SudokuGrid;
  selectedCell: CellPosition | null;
  highlightedNumber: number | null;
  onCellClick: (row: number, col: number) => void;
}

export default function Board({
  grid,
  selectedCell,
  highlightedNumber,
  onCellClick,
}: BoardProps) {
  if (!grid || grid.length === 0) return null;

  return (
    <div className="w-full aspect-square shadow-xl mx-auto">
      {/* The actual 9x9 CSS grid with a thick outer border */}
      <div className="grid grid-cols-9 w-full h-full border-2 border-gray-800 bg-white">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const sameRow =
              selectedCell !== null && selectedCell.row === rowIndex;
            const sameCol =
              selectedCell !== null && selectedCell.col === colIndex;
            const sameQuadrant =
              selectedCell !== null &&
              Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
              Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);
            const isPeer =
              selectedCell !== null && (sameRow || sameCol || sameQuadrant);
            
            return (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                cell={cell}
                isSelected={
                  selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex
                }
                isPeer={isPeer}
                isHighlighted={highlightedNumber === cell.value}
                highlightedNumber={highlightedNumber}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}