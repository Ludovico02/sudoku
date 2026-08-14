import { Difficulty, GameMode, GameState } from "@/types/sudoku";
import { useEffect, useState } from "react";
import { formatTime } from "@/helpers/timeHelpers";

interface GamePanelProps {
  mistakes: number;
  maxMistakes: number;
  difficulty: Difficulty;
  gameMode: GameMode;
  gameStatus: GameState["status"];
  showTimer: boolean;
}

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  hard: "bg-orange-100 text-orange-700 border-orange-300",
};

export default function GamePanel({
  mistakes,
  maxMistakes,
  difficulty,
  gameMode,
  gameStatus,
  showTimer,
}: GamePanelProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameStatus === "playing") {
      interval = setInterval(() => setSeconds((s: number) => s + 1), 1000);
    } else if (gameStatus === "loading" || gameStatus === "idle") {
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [gameStatus]);

  const isUnlimited = !Number.isFinite(maxMistakes);
  const isDanger =
    gameMode === "assisted" && !isUnlimited && mistakes >= maxMistakes - 1;
  const badgeClass =
    difficultyStyles[difficulty] ?? "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto mb-3">
      <div className="flex items-stretch justify-between bg-white rounded-2xl border border-gray-200 shadow-sm px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Difficulty badge */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <span
            className={`text-xs sm:text-sm font-bold capitalize px-2.5 py-1 rounded-full border ${badgeClass}`}
          >
            {difficulty}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 shrink-0" />

        {/* Timer */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {showTimer && (
            <div className="flex items-center gap-1.5 text-gray-700 min-w-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-400 shrink-0"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <span className="font-mono font-semibold text-sm sm:text-base tabular-nums">
                {formatTime(seconds)}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 shrink-0" />

        {/* Mistakes / Mode*/}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {gameMode === "assisted" ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`text-sm sm:text-base font-bold whitespace-nowrap transition-colors duration-300 ${
                  isDanger ? "text-red-600" : "text-gray-800"
                }`}
              >
                {mistakes}/{isUnlimited ? "∞" : maxMistakes}
              </span>
              {!isUnlimited && (
                <div className="flex gap-0.5 shrink-0">
                  {Array.from({ length: maxMistakes }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        i < mistakes
                          ? isDanger
                            ? "bg-red-500"
                            : "bg-amber-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm sm:text-base font-bold text-blue-600 whitespace-nowrap">
              Classic
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
