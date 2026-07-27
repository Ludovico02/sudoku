import { CellState } from "@/types/sudoku";

interface CellProps {
  cell: CellState;
  onClick?: () => void;
}

export default function Cell({ cell, onClick }: CellProps) {
  const isThickBorderRight = cell.col === 2 || cell.col === 5;
  const isThickBorderBottom = cell.row === 2 || cell.row === 5;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-center
        aspect-square text-lg sm:text-xl md:text-2xl select-none
        border border-gray-300 transition-colors duration-150
        ${isThickBorderRight ? "border-r-2 border-r-gray-800" : ""}
        ${isThickBorderBottom ? "border-b-2 border-b-gray-800" : ""}
        ${cell.isFixed 
          ? "bg-gray-100 font-bold text-gray-800" 
          : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50"
        }
        ${cell.isError ? "bg-red-100 text-red-600 font-semibold" : ""}
      `}
    >
      {cell.value !== 0 ? cell.value : ""}
    </div>
  );
}
