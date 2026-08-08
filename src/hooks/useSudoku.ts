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
    gameMode: "assisted",
    showTimer: true,
    inputMode: "normal",
    highlightedNumber: null,
  });

  const requestIdRef = useRef(0);

  const startNewGame = useCallback(
    async (
      difficulty: Difficulty,
      maxMistakes: number,
      gameMode: GameMode,
      showTimer: boolean,
    ) => {
      const currentRequestId = ++requestIdRef.current;

      setGameState((prev) => ({
        ...prev,
        status: "loading",
        difficulty,
        selectedCell: null,
        maxMistakes,
        gameMode,
        showTimer,
      }));

      try {
        const data = await fetchSudoku(difficulty);

        // Handling race conditions between multiple requests
        // User might select different difficulties
        if (currentRequestId !== requestIdRef.current) return;

        const initialGrid = stringToSudokuGridMapper(
          data.puzzle,
          data.solution,
        );

        // DEV ONLY Victory test
        // initialGrid.forEach((row, rowIndex) => {
        //   row.forEach((cell, colIndex) => {
        //     if (rowIndex === 0 && colIndex === 0) {
        //       cell.value = 0;
        //       cell.isFixed = false;
        //     } else {
        //       cell.value = cell.solutionValue;
        //       cell.isFixed = true;
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
          gameMode,
          showTimer,
          inputMode: "normal",
          highlightedNumber: null,
        });
      } catch (error) {
        setGameState((prev) => ({ ...prev, status: "idle" }));

        console.error("Error while fetching data in useSudoku:", error);
        // Handle how error is shown to the user
      }
    },
    [],
  );

  const giveUp = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "idle",
    }));
  }, []);

  const solveGame = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === "idle" || prev.status === "loading") return prev;
      return {
        ...prev,
        status: "game-over",
        selectedCell: null,
        grid: prev.grid.map((r) =>
          r.map((c) => ({ ...c, value: c.solutionValue, isError: false })),
        ),
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === "idle" || prev.status === "loading") return prev;
      return {
        ...prev,
        status: "playing",
        mistakes: 0,
        selectedCell: null,
        grid: prev.grid.map((r) =>
          r.map((c) => (c.isFixed ? c : { ...c, value: 0, isError: false })),
        ),
      };
    });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;

      // Number we will highlight
      const cellValue = prev.grid[row][col].value;

      return {
        ...prev,
        selectedCell: { row, col },
        highlightedNumber: cellValue !== 0 ? cellValue : null,
      };
    });
  }, []);

  const toggleInputMode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      inputMode: prev.inputMode === "normal" ? "notes" : "normal",
    }));
  }, []);

  const autoFillNotes = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;

      const newGrid = prev.grid.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (cell.value !== 0) return cell;

          const used = new Set();
          for (let i = 0; i < 9; i++) {
            used.add(prev.grid[rIdx][i].value);
            used.add(prev.grid[i][cIdx].value);
          }

          const startRow = Math.floor(rIdx / 3) * 3;
          const startCol = Math.floor(cIdx / 3) * 3;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              used.add(prev.grid[startRow + i][startCol + j].value);
            }
          }

          const possibleNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
            (n) => !used.has(n),
          );
          return { ...cell, notes: possibleNotes };
        }),
      );

      return { ...prev, grid: newGrid };
    });
  }, []);

  const inputNumber = useCallback((number: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing" || !prev.selectedCell) return prev;

      const { row, col } = prev.selectedCell;
      const targetCell = prev.grid[row][col];

      if (targetCell.isFixed) return prev;

      const isAssisted = prev.gameMode === "assisted";

      if (isAssisted && targetCell.value === targetCell.solutionValue)
        return prev;

      if (prev.inputMode === "notes") {
        if (targetCell.value !== 0) return prev;

        const hasNote = targetCell.notes.includes(number);
        const newNotes = hasNote
          ? targetCell.notes.filter((n) => n !== number)
          : [...targetCell.notes, number].sort();

        const newGrid = prev.grid.map((r, rIdx) =>
          r.map((c, cIdx) =>
            rIdx === row && cIdx === col ? { ...c, notes: newNotes } : c,
          ),
        );

        return { ...prev, grid: newGrid, highlightedNumber: number };
      }

      if (targetCell.value === number) return prev;

      const isCorrect = number === targetCell.solutionValue;
      const isErrorNow = isAssisted ? !isCorrect : false;

      const newGrid = prev.grid.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {
              ...targetCell,
              value: number,
              isError: isErrorNow,
              notes: [],
            };
          }

          // Deletes notes only if an error is not shown
          // So in classic mode wether the number is a mistake or not
          // Relative numbers in notes are deleted
          if (!isErrorNow) {
            const isPeer =
              rIdx === row ||
              cIdx === col ||
              (Math.floor(rIdx / 3) === Math.floor(row / 3) &&
                Math.floor(cIdx / 3) === Math.floor(col / 3));
            if (isPeer && c.notes.includes(number)) {
              return { ...c, notes: c.notes.filter((n) => n !== number) };
            }
          }

          return c;
        }),
      );

      const newMistakes = isCorrect ? prev.mistakes : prev.mistakes + 1;

      let newStatus: GameState["status"] = prev.status;

      if (isAssisted && newMistakes >= prev.maxMistakes) {
        newStatus = "game-over";
      } else {
        const isBoardFull = newGrid.every((row) =>
          row.every(
            (cell) => cell.value !== 0 && cell.value === cell.solutionValue,
          ),
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
        highlightedNumber: number,
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
    giveUp,
    solveGame,
    resetGame,
    toggleInputMode,
    autoFillNotes,
  };
}
