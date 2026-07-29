import { useState, useCallback, useRef, useEffect } from "react";
import { Difficulty, GameMode, GameState } from "@/types/sudoku";
import { fetchSudoku } from "@/services/api";
import stringToSudokuGridMapper from "@/helpers/stringToSudokuGridMapper";

export function useSudoku() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    difficulty: "easy",
    status: "idle",
    mistakes: 0,
    selectedCell: null,
    maxMistakes: 3,
    gameMode: "assisted"
  });

  const requestIdRef = useRef(0);

  const startNewGame = useCallback(async (difficulty: Difficulty, maxMistakes: number, gameMode: GameMode) => {
    const currentRequestId = ++requestIdRef.current;

    setGameState((prev) => ({
      ...prev,
      status: "loading",
      difficulty,
      selectedCell: null,
      maxMistakes,
      gameMode
    }));

    try {
      const data = await fetchSudoku(difficulty);

      // Handling race conditions between multiple requests
      // User might select different difficulties
      if (currentRequestId !== requestIdRef.current) return;

      const initialGrid = stringToSudokuGridMapper(data.puzzle, data.solution);

      // DEV ONLY Victory test
      // initialGrid.forEach((row, rowIndex) => {
      //   row.forEach((cell, colIndex) => {
      //     if (rowIndex === 0 && colIndex === 0) {
      //       cell.value = 0; // Lascia vuota
      //       cell.isFixed = false;
      //     } else {
      //       cell.value = cell.solutionValue; // Inserisci la soluzione
      //       cell.isFixed = true; // Blocca la cella
      //     }
      //   });
      // });
      // END

      setGameState({
        grid: initialGrid,
        difficulty,
        status: "playing",
        mistakes: 0,
        selectedCell: null,
        maxMistakes,
        gameMode
      });
    } catch (error) {
      setGameState((prev) => ({ ...prev, status: "idle" }));

      console.error("Error while fetching data in useSudoku:", error);
      // Handle how error is shown to the user
    }
  }, []);

  const giveUp = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: "idle"
    }));
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

      const isAssisted = prev.gameMode === "assisted";

      if (isAssisted && targetCell.value === targetCell.solutionValue) return prev;

      if (targetCell.value === number) return prev;

      const isCorrect = number === targetCell.solutionValue;
      const newGrid = prev.grid.map((r) => [...r]);

      newGrid[row][col] = {
        ...targetCell,
        value: number,

        // In classic mode error are not shown
        isError: isAssisted ? !isCorrect : false,
      };

      const newMistakes = isCorrect ? prev.mistakes : prev.mistakes + 1;

      let newStatus: GameState["status"] = prev.status;

      if (isAssisted && newMistakes >= prev.maxMistakes) {
        newStatus = "game-over";
      } 
      else {
        const isBoardFull = newGrid.every((row) =>
          row.every((cell) => cell.value !== 0 && !cell.isError),
        );

        if (isBoardFull) {
          newStatus = "won";
        }
      }

      return {
        ...prev,
        grid: newGrid,
        mistakes: newMistakes,
        status: newStatus,
      };
    });
  }, []);

  const clearCell = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== "playing" || !prev.selectedCell) return prev;

      const { row, col } = prev.selectedCell;
      const targetCell = prev.grid[row][col];

      if (targetCell.isFixed) return prev;

      const newGrid = prev.grid.map((r) => [...r]);
      newGrid[row][col] = {
        ...targetCell,
        value: 0,
        isError: false,
      };

      return { ...prev, grid: newGrid };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key >= "1" && e.key <= "9") {
        inputNumber(parseInt(e.key));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        clearCell();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Avoid memory leaks
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputNumber, clearCell]);

  return {
    gameState,
    startNewGame,
    selectCell,
    inputNumber,
    clearCell,
    giveUp
  };
}
