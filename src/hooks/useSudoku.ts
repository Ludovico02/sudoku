// src/hooks/useSudoku.ts
import { useState, useCallback, useRef } from "react";
import { Difficulty, GameState } from "@/types/sudoku";
import { fetchSudoku } from "@/services/api";
import stringToSudokuGridMapper from "@/helpers/stringToSudokuGridMapper";

export function useSudoku() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    difficulty: "easy",
    status: "idle",
    mistakes: 0,
  });

  const requestIdRef = useRef(0);

  const startNewGame = useCallback(async (difficulty: Difficulty) => {
    const currentRequestId = ++requestIdRef.current;

    setGameState((prev) => ({ ...prev, status: "loading", difficulty }));

    try {
      const data = await fetchSudoku(difficulty);

      // Handling race conditions between multiple requests
      // User might select different difficulties
      if (currentRequestId !== requestIdRef.current) return;

      const initialGrid = stringToSudokuGridMapper(data.puzzle, data.solution);

      setGameState({
        grid: initialGrid,
        difficulty,
        status: "playing",
        mistakes: 0,
      });
    } catch (error) {
      setGameState((prev) => ({ ...prev, status: "idle" }));

      console.error("Error while fetching data in useSudoku:", error);
      // Handle how error is shown to the user
    }
  }, []);

  return {
    gameState,
    startNewGame,
  };
}
