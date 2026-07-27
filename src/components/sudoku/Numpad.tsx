interface NumpadProps {
  onInput: (number: number) => void;
  onClear: () => void;
  disabled: boolean;
}

export default function Numpad({ onInput, onClear, disabled }: NumpadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 w-full max-w-sm sm:max-w-md mt-6">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onInput(num)}
          disabled={disabled}
          className={`
            w-12 h-16 sm:w-14 sm:h-16 text-2xl 
            font-semibold rounded-lg shadow-sm transition-all duration-200 
            transform active:scale-95 
            ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md cursor-pointer"
            }
          `}
        >
          {num}
        </button>
      ))}

      <button
        onClick={onClear}
        disabled={disabled}
        className={`
          w-full max-w-50 py-3 text-lg font-bold rounded-lg shadow-sm
          transition-all duration-200 transform active:scale-95
          ${
            disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
            : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-md cursor-pointer"
          }
        `}
      >
        Delete
      </button>
    </div>
  );
}
