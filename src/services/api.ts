import { APISudokuResponse, Difficulty } from "@/types/sudoku";

export async function fetchSudoku(difficulty: Difficulty = "medium"): Promise<APISudokuResponse> {
    const url = `https://youdosudoku.com/api/?difficulty=${difficulty}`;

    try {
        const response = await fetch(url, {
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