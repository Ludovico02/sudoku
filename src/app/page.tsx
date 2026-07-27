// src/app/page.tsx
"use client";

import { useSudoku } from "@/hooks/useSudoku";
import Board from "@/components/sudoku/Board";
import Numpad from "@/components/sudoku/Numpad";
import GamePanel from "@/components/sudoku/GamePanel";

const MAX_MISTAKES = 3;

export default function Home() {
  const { gameState, startNewGame, selectCell, inputNumber, clearCell } =
    useSudoku();

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 text-gray-900 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
          Sudoku
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => startNewGame("medium")}
            disabled={gameState.status === "loading"}
            className="px-6 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 disabled:opacity-50 transition-opacity"
          >
            {gameState.status === "loading"
              ? "Loading..."
              : "New Game"}
          </button>
        </div>

        {gameState.grid.length > 0 && (
          <div className="w-full mt-2 flex flex-col items-center">
            <GamePanel
              difficulty={gameState.difficulty}
              mistakes={gameState.mistakes}
              maxMistakes={MAX_MISTAKES}
            />

            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
              <div
                className={`w-full transition-opacity duration-500 ${gameState.status === "game-over" ? "opacity-30 pointer-events-none" : ""}`}
              >
                <Board
                  grid={gameState.grid}
                  selectedCell={gameState.selectedCell}
                  onCellClick={selectCell}
                />
              </div>

              {gameState.status === "game-over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="bg-white/95 p-6 sm:p-8 rounded-xl shadow-2xl text-center border-2 border-red-200 mx-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">
                      Game Over!
                    </h2>
                    <p className="text-gray-700 mb-6 font-medium">
                      You made three mistakes...
                    </p>
                    <button
                      onClick={() => startNewGame(gameState.difficulty)}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transform transition active:scale-95"
                    >
                      Try Again!
                    </button>
                  </div>
                </div>
              )}
            </div>

            {gameState.status !== "game-over" && (
              <Numpad
                onInput={inputNumber}
                onClear={clearCell}
                disabled={gameState.selectedCell === null}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
