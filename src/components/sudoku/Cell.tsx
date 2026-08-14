import { CellState } from "@/types/sudoku";

interface CellProps {
  cell: CellState;
  isSelected: boolean;
  isPeer?: boolean;
  highlightedNumber: number | null;
  isHighlighted: boolean;
  onClick?: () => void;
}

export default function Cell({ cell, isSelected, isPeer, highlightedNumber, onClick }: CellProps) {
  const isThickBorderRight = cell.col === 2 || cell.col === 5;
  const isThickBorderBottom = cell.row === 2 || cell.row === 5;

  let bgColor = "bg-white hover:bg-blue-50";
  let textColor = cell.isFixed ? "text-gray-800 font-bold" : "text-blue-600";
  let ringStyle = "";

  const isHighlightedValue = highlightedNumber !== null && cell.value === highlightedNumber;

  if (isSelected) {
    ringStyle = "ring-2 ring-inset";
  }

  if (cell.isError) {
    bgColor = isSelected ? "bg-red-200" : "bg-red-100";
    textColor = "text-red-600 font-extrabold";
    if (isSelected) ringStyle += " ring-red-500";
  } else {
    if (isSelected) {
      bgColor = "bg-blue-200";
      ringStyle += " ring-blue-500";
    } else if (isHighlightedValue) {
      bgColor = "bg-indigo-100";
    } else if (isPeer) {
      bgColor = cell.isFixed ? "bg-gray-200" : "bg-blue-50";
    } else if (cell.isFixed) {
      bgColor = "bg-gray-100";
    }
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        aspect-square select-none overflow-hidden
        border border-gray-300 transition-colors duration-150 cursor-pointer
        ${isThickBorderRight ? "border-r-2 border-r-gray-800" : ""}
        ${isThickBorderBottom ? "border-b-2 border-b-gray-800" : ""}
        ${bgColor}
        ${textColor}
        ${ringStyle}
      `}
    >
      {cell.value !== 0 ? (
        <span className="text-lg sm:text-2xl md:text-3xl">
          {cell.value}
        </span>
      ) : cell.notes && cell.notes.length > 0 ? (
        
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const isNoteHighlighted = highlightedNumber === n && cell.notes.includes(n);
            
            return (
              <div
                key={n}
                className={`
                  flex items-center justify-center text-[10px] sm:text-xs font-medium leading-none rounded-xs
                  ${isNoteHighlighted 
                    ? "bg-blue-500 text-white font-bold shadow-sm" 
                    : "text-gray-500" 
                  }
                `}
              >
                {cell.notes.includes(n) ? n : ""}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}