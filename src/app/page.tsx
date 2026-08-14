"use client";

import { useSudoku } from "@/hooks/useSudoku";
import Board from "@/components/sudoku/Board";
import Numpad from "@/components/sudoku/Numpad";
import GamePanel from "@/components/sudoku/GamePanel";
import MainMenu from "@/components/sudoku/MainMenuProps";
import InGameMenu from "@/components/sudoku/InGameMenu";

export default function Home() {
  const {
    gameState,
    startNewGame,
    selectCell,
    inputNumber,
    clearCell,
    giveUp,
    resetGame,
    solveGame,
    toggleInputMode,
    autoFillNotes,
  } = useSudoku();

  const inGame = gameState.status !== "idle" && gameState.status !== "loading";

  return (
    <main className="relative min-h-screen px-3 py-4 sm:p-8 bg-gray-50 text-gray-900 font-sans flex flex-col items-center overflow-x-hidden">
      
      {/* In-Game Menu Gear */}
      {inGame && (
        <InGameMenu
          onReset={resetGame}
          onNewGame={giveUp}
          onSolve={solveGame}
        />
      )}

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight text-center pt-2 mb-6 sm:mb-8">
        Sudoku
      </h1>

      {/* Pre-Game Menu */}
      {!inGame && (
        <div className="w-full max-w-md">
          <MainMenu
            onStart={startNewGame}
            isLoading={gameState.status === "loading"}
          />
        </div>
      )}

      {/* Game Area */}
      {inGame && gameState.grid.length > 0 && (
        <div className="w-full flex flex-col items-center">
          
          {/* Game Panel */}
          <div className="w-full max-w-100 sm:max-w-125 lg:max-w-150 xl:max-w-175 mb-4">
            <GamePanel
              difficulty={gameState.difficulty}
              mistakes={gameState.mistakes}
              maxMistakes={gameState.maxMistakes}
              gameMode={gameState.gameMode}
              gameStatus={gameState.status}
              showTimer={gameState.showTimer}
            />
          </div>

          <div className="w-full max-w-375 mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-center justify-center">
            
            {/* Left Column (Empty, needed to balance the center perfectly) */}
            <div className="hidden lg:block"></div>

            {/* Central Column (Grid) */}
            <div className="relative w-full max-w-100 sm:max-w-125 lg:w-137.5 xl:w-162.5 mx-auto">
              <div
                className={`w-full transition-opacity duration-500 ${
                  gameState.status === "game-over" || gameState.status === "won"
                    ? "opacity-30 pointer-events-none"
                    : ""
                }`}
              >
                <Board
                  grid={gameState.grid}
                  selectedCell={gameState.selectedCell}
                  onCellClick={selectCell}
                  highlightedNumber={gameState.highlightedNumber}
                />
              </div>

              {/* Game Over Overlay */}
              {gameState.status === "game-over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="bg-white/95 p-6 sm:p-8 rounded-xl shadow-2xl text-center border-2 border-red-200 mx-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                      Game Over!
                    </h2>
                    <p className="text-gray-700 mb-6 font-medium">
                      {gameState.mistakes >= gameState.maxMistakes
                        ? "You have reached the maximum number of errors."
                        : "You have revealed the solution."}
                    </p>
                    <button
                      onClick={giveUp}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transform transition active:scale-95"
                    >
                      Back to menu
                    </button>
                  </div>
                </div>
              )}

              {/* Victory Overlay */}
              {gameState.status === "won" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="bg-white/95 p-6 sm:p-8 rounded-xl shadow-2xl text-center border-2 border-green-200 mx-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                      Victory! 🎉
                    </h2>
                    <p className="text-gray-700 mb-6 font-medium">
                      {gameState.gameMode === "classic"
                        ? `Completed without hints with ${gameState.mistakes} hidden corrections.`
                        : "You have completed the Sudoku successfully!"}
                    </p>
                    <button
                      onClick={giveUp}
                      className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transform transition active:scale-95"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Numpad) */}
            {gameState.status === "playing" ? (
              <div className="flex flex-col w-full max-w-100 lg:w-70 xl:w-[320px] mx-auto lg:mx-0 items-center lg:items-start justify-center gap-4">
                
                {/* Autofill button */}
                <button
                  onClick={autoFillNotes}
                  className="group flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 active:scale-95 transition-all text-sm font-semibold text-gray-700 hover:text-blue-600 w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform">
                    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M8.757 15.243l-2.121 2.121m0-10.607 2.121 2.121m8.486 8.486 2.121 2.121" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  Auto Fill Notes
                </button>

                {/* Numpad */}
                <div className="w-full">
                  <Numpad
                    onInput={inputNumber}
                    onClear={clearCell}
                    disabled={gameState.selectedCell === null}
                    onToggleNotes={toggleInputMode}
                    inputMode={gameState.inputMode}
                  />
                </div>
              </div>
            ) : (
              <div className="hidden lg:block"></div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}