import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const difficulty = body.difficulty;

    const apiKey = process.env.SUDOKU_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not set in server" },
        { status: 500 },
      );
    }

    const externalResponse = await fetch("https://youdosudoku.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        difficulty,
      }),
      cache: "no-store",
    });

    if (!externalResponse.ok) {
      throw new Error(`Error external API: ${externalResponse.status}`);
    }

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal proxy error:", error);
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 },
    );
  }
}
