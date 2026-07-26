import { Difficulty, APISudokuResponse } from "@/types/sudoku";

export async function fetchSudoku(
  difficulty: Difficulty
): Promise<APISudokuResponse> {
  try {
    const response = await fetch("/api/sudoku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APISudokuResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error while loading sudoku:", error);
    throw error;
  }
}
