import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    q: "Where was your first date?",
    options: ["Beach", "Mountains", "Cafe", "Movie Theater"],
    answer: 0,
  },
  {
    q: "Who said 'I love you' first?",
    options: ["Me", "Partner", "Both together", "Can't remember"],
    answer: 1,
  },
  {
    q: "What is your couple song?",
    options: ["Perfect", "All of Me", "Something Just Like This", "Other"],
    answer: 2,
  },
  {
    q: "When was your anniversary?",
    options: ["Jan", "Feb", "June", "August"],
    answer: 2,
  },
];

export default function MemoryQuiz() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (selected === questions[idx].answer) setScore((s) => s + 1);
    setSelected(null);
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };
  const handleRestart = () => {
    setIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center border border-gray-100">
        <div className="text-2xl font-bold mb-4">Memory Quiz 🧠</div>
        {showResult ? (
          <>
            <div className="text-lg font-semibold mb-4">Your Score: {score} / {questions.length}</div>
            <button onClick={handleRestart} className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition">Restart</button>
            <Link href="/games" className="text-sm text-red-400 hover:underline">← Back to Games</Link>
          </>
        ) : (
          <>
            <div className="text-lg font-semibold mb-4 text-center">{questions[idx].q}</div>
            <div className="flex flex-col gap-3 mb-6 w-full">
              {questions[idx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full px-4 py-2 rounded-lg border transition-all font-medium text-left
                    ${selected === i ? "bg-blue-100 border-blue-400 text-blue-700" : "bg-gray-50 border-gray-200 hover:bg-blue-50"}
                  `}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
            >{idx === questions.length - 1 ? "Finish" : "Next"}</button>
            <Link href="/games" className="text-sm text-red-400 hover:underline">← Back to Games</Link>
          </>
        )}
      </div>
    </div>
  );
} 