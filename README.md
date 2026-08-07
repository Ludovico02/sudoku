# Sudoku

My aim is to build a sudoku web app without any ads. It all started when I was playing on a mobile app and fell in love with the game. Problem was: too many ads! I tried different apps and ad free websites but none of them had my favorite feature: a button that automatically writes all the notes...

## Tech Stack

- Framework: Nextjs & React
- Language: Typescript
- Styling: TailwindCSS
- State Management: Custom React Hooks

## API

I found online the [youdosudoku](https://www.youdosudoku.com/) API which is completely free and easy to use, it also allows you to choose the difficulty between easy, medium and hard.

Credits to the original creator: [kevinstewartmercurio](https://www.kevinstewartmercurio.com/)

## Key Features

- Dual Game Modes:
  - Assisted Mode: Real-time error validation with immediate visual feedback
  - Classic Mode: Unassisted experience where players must rely on their own logic

- QoL Mechanics:
  - Smart Notes (Pencil Marks): Fully functional 3x3 mini-grid within empty cells to track possible numbers.
  - Auto-fill Notes: A time-saving algorithm that calculates and populates all valid possibilities for the remaining empty cells.
  - Dynamic Highlighting: Clicking a cell automatically highlights all identical numbers across the board, as well as its corresponding "peers" (row, column, 3x3 quadrant)

- Responsive UI implemented mobile first

## Architecture & Design Decisions

![Empty Sudoku Board](assets/sudokuBoardEmpty.png)

<hr>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
