import { Difficulty, GameMode } from "@/types/sudoku";

interface GamePanelProps {
  mistakes: number;
  maxMistakes: number;
  difficulty: Difficulty;
  gameMode: GameMode;
}

export default function GamePanel({
  mistakes,
  maxMistakes,
  difficulty,
  gameMode,
}: GamePanelProps) {
  const isDanger = mistakes >= maxMistakes - 1;

  return (
    <div className="flex items-center justify-between w-full max-w-sm sm:max-w-md mb-4 px-2 text-lg">
      <div className="text-gray-600 font-medium capitalize">
        Difficulty:{" "}
        <span className="font-semibold text-gray-800">{difficulty}</span>
      </div>

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
  );
}
