interface NumpadProps {
  onInput: (number: number) => void;
  onClear: () => void;
  onToggleNotes: () => void;
  inputMode: "normal" | "notes";
  disabled: boolean;
}

export default function Numpad({
  onInput,
  onClear,
  onToggleNotes,
  inputMode,
  disabled,
}: NumpadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-sm sm:max-w-md mt-6 flex flex-col gap-4 mx-auto">
      <button
        onClick={onToggleNotes}
        disabled={disabled}
        className={`
          w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.98]
          ${
            disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : inputMode === "notes"
                ? "bg-amber-500 text-white shadow-md border border-amber-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
          }
        `}
      >
        <span className="text-xl">✏️</span>
        Enable Notes: {inputMode === "notes" ? "Enabled" : "Disabled"}
      </button>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onInput(num)}
            disabled={disabled}
            className={`
              aspect-square flex items-center justify-center 
              bg-blue-500 border border-gray-300 rounded-lg shadow-sm
              text-2xl sm:text-3xl font-semibold text-gray-300 
              transition-all duration-150 active:scale-95
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
              }
            `}
          >
            {num}
          </button>
        ))}

        <button
          onClick={onClear}
          disabled={disabled}
          title="Clear cell content"
          className={`
            aspect-square flex items-center justify-center 
            bg-red-50 border border-red-200 rounded-lg shadow-sm
            text-xl sm:text-2xl text-red-600 font-bold
            transition-all duration-150 active:scale-95
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-100 hover:border-red-300"
            }
          `}
          aria-label="Clear cell content"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
