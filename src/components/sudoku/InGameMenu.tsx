import { useState, useRef, useEffect } from "react";

interface InGameMenuProps {
  onReset: () => void;
  onNewGame: () => void;
  onSolve: () => void;
}

export default function InGameMenu({
  onReset,
  onNewGame,
  onSolve,
}: InGameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="absolute top-4 right-4 md:top-8 md:right-8 z-50"
      ref={menuRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-full shadow-md border transition-all duration-200 active:scale-95 flex items-center justify-center ${
          isOpen
            ? "bg-gray-100 border-gray-300"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
        aria-label="Game Settings"
      >
        <svg
          className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col transform origin-top-right transition-all">
          <button
            onClick={() => {
              onReset();
              setIsOpen(false);
            }}
            className="px-4 py-3 text-left hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-100 flex items-center gap-3 transition-colors"
          >
            <span className="text-lg">🔄</span> Reset Grid
          </button>

          <button
            onClick={() => {
              onNewGame();
              setIsOpen(false);
            }}
            className="px-4 py-3 text-left hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-100 flex items-center gap-3 transition-colors"
          >
            <span className="text-lg">🔙</span> Back to Menu
          </button>

          <button
            onClick={() => {
              onSolve();
              setIsOpen(false);
            }}
            className="px-4 py-3 text-left hover:bg-red-50 text-red-600 font-medium flex items-center gap-3 transition-colors"
          >
            <span className="text-lg">⚠️</span> Show Solution
          </button>
        </div>
      )}
    </div>
  );
}
