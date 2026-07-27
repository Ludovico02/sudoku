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
    selectedCell: null,
  });

  const requestIdRef = useRef(0);

  const startNewGame = useCallback(async (difficulty: Difficulty) => {
    const currentRequestId = ++requestIdRef.current;

    setGameState((prev) => ({
      ...prev,
      status: "loading",
      difficulty,
      selectedCell: null,
    }));

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
        selectedCell: null,
      });
    } catch (error) {
      setGameState((prev) => ({ ...prev, status: "idle" }));

      console.error("Error while fetching data in useSudoku:", error);
      // Handle how error is shown to the user
    }
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;
      if (prev.grid[row][col].isFixed) return prev;

      return { ...prev, selectedCell: { row, col } };
    });
  }, []);

  const inputNumber = useCallback((number: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing" || !prev.selectedCell) return prev;

      const { row, col } = prev.selectedCell;
      const targetCell = prev.grid[row][col];

      // If it's correct already refuse the input
      if (targetCell.value === targetCell.solutionValue) return prev;

      // Check if input is correct
      const isCorrect = number === targetCell.solutionValue;

      const newGrid = prev.grid.map((r) => [...r]);

      newGrid[row][col] = {
        ...targetCell,
        value: number,
        isError: !isCorrect, // If input is incorrect show the error
      };

      const newMistakes = isCorrect ? prev.mistakes : prev.mistakes + 1;
      const newStatus = newMistakes >= 3 ? "game-over" : "playing";

      // TODO Check if user has won

      return {
        ...prev,
        grid: newGrid,
        mistakes: newMistakes,
        status: newStatus,
      };
    });
  }, []);

  return {
    gameState,
    startNewGame,
    selectCell,
    inputNumber
  };
}
