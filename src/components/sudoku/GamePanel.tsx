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

  const isDanger = gameMode === "assisted" && mistakes >= maxMistakes - 1;

  return (
    <div className="flex flex-wrap items-center justify-between w-full max-w-sm sm:max-w-md mb-4 px-2 text-lg gap-3">
      <div className="text-gray-600 font-medium capitalize">
        Difficulty:{" "}
        <span className="font-semibold text-gray-800">{difficulty}</span>
      </div>

      <div className="flex items-center gap-3">
        {showTimer && (
          <div className="text-sm font-semibold text-gray-700">
            Time: <span className="text-gray-900">{formatTime(seconds)}</span>
          </div>
        )}

        {gameMode === "assisted" ? (
          <div
            className={`font-bold transition-colors duration-300 ${isDanger ? "text-red-600" : "text-gray-800"}`}
          >
            Mistakes: {mistakes} / {maxMistakes}
          </div>
        ) : (
          <div className="font-bold">Classic Mode</div>
        )}
      </div>
    </div>
  );
}
