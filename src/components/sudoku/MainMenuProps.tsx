import { useState } from "react";
import { Difficulty, GameMode } from "@/types/sudoku";

interface MainMenuProps {
  onStart: (
    diff: Difficulty,
    maxErr: number,
    mode: GameMode,
    timer: boolean,
  ) => void;
  isLoading: boolean;
}

export default function MainMenu({ onStart, isLoading }: MainMenuProps) {
  const [diff, setDiff] = useState<Difficulty>("medium");
  const [mode, setMode] = useState<GameMode>("assisted");
  const [maxErr, setMaxErr] = useState(3);
  const [timer, setTimer] = useState(true);

  return (
    <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Difficulty</h3>
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`flex-1 py-2 rounded-lg border font-medium transition-all duration-200 ${diff === d ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"}`}
            >
              {d === "easy" ? "Facile" : d === "medium" ? "Media" : "Difficile"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Game mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("assisted")}
            className={`flex-1 py-2 rounded-lg border font-medium transition-all duration-200 ${mode === "assisted" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"}`}
          >
            Assisted
          </button>
          <button
            onClick={() => setMode("classic")}
            className={`flex-1 py-2 rounded-lg border font-medium transition-all duration-200 ${mode === "classic" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"}`}
          >
            Classic
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {mode === "assisted"
            ? "Mistakes are highlighted in red immediately."
            : "No help. You'll find out if you won only after completing the grid."}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Max Errors</h3>
        <div className="flex gap-2">
          {[3, 5, 10, Infinity].map((m) => (
            <button
              key={m}
              onClick={() => setMaxErr(m)}
              disabled={mode === "classic"}
              className={`flex-1 py-2 rounded-lg border font-medium transition-all duration-200 ${
                mode === "classic"
                  ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                  : maxErr === m
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              {m === Infinity ? "Unlimited" : m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Timer</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimer(true)}
            className={`flex-1 py-2 rounded-lg border font-medium transition-all duration-200 ${timer ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"}`}
          >
            Visible
          </button>
          <button
            onClick={() => setTimer(false)}
            className={`flex-1 py-2 rounded-lg border font-medium transition-all duration-200 ${!timer ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"}`}
          >
            Hidden
          </button>
        </div>
      </div>

      <button
        onClick={() => onStart(diff, maxErr, mode, timer)}
        disabled={isLoading}
        className="w-full py-3.5 mt-2 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
      >
        {isLoading ? "Generating Grid..." : "Start Game"}
      </button>
    </div>
  );
}
