"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    id: 1,
    question: "Who said 'I love you' first?",
    options: ["You", "Your Partner"],
  },
  {
    id: 2,
    question: "What was your first date?",
    options: ["Coffee Shop", "Movie Theater", "Restaurant", "Park"],
  },
  {
    id: 3,
    question: "What's your partner's favorite color?",
    options: ["Red", "Blue", "Green", "Purple", "Pink"],
  },
];

export default function CoupleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (selectedAnswer: string) => {
    // TODO: Implement actual answer checking logic
    setScore(score + 1);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-medium">Quiz Complete!</h3>
        <p>Your score: {score} out of {QUESTIONS.length}</p>
        <Button onClick={resetQuiz}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-2">{QUESTIONS[currentQuestion].question}</h3>
        <div className="space-y-2">
          {QUESTIONS[currentQuestion].options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className="w-full"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="text-center text-sm text-gray-500">
        Question {currentQuestion + 1} of {QUESTIONS.length}
      </div>
    </div>
  );
} 