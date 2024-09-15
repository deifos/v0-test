import { generateQuestion, generateWrongAnswers } from "@/lib/mathUtils";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Confetti from "react-confetti";
import { trackEvent } from "@/lib/utils";

export default function BubbleMathGame() {
  const [question, setQuestion] = useState({ question: "", answer: 0 });
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const popAudioRef = useRef<HTMLAudioElement | null>(null);
  const pigAudioRef = useRef<HTMLAudioElement | null>(null);
  const celebrateAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
      const newQuestion = generateQuestion();
      setQuestion(newQuestion);
      popAudioRef.current = new Audio("/pop.wav");
      pigAudioRef.current = new Audio("/pig.wav");
      celebrateAudioRef.current = new Audio("/celebrating.wav");
      setIsLoading(false);
    };

    initializeGame();
  }, []);

  const resetGame = () => {
    setQuestion(generateQuestion());
    setScore(0);
    setErrors(0);
    setGameOver(false);
    setResetKey((prevKey) => prevKey + 1);
    setIsWrongAnswer(false);
    setGameWon(false);
    setShowConfetti(false);
  };

  const handlePlayAgain = () => {
    trackEvent("BubbleMathGame");
    resetGame();
  };

  const checkAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === question.answer) {
      if (popAudioRef.current) {
        popAudioRef.current
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= 20) {
        setGameWon(true);
        setShowConfetti(true);
        if (celebrateAudioRef.current) {
          celebrateAudioRef.current
            .play()
            .catch((error) => console.error("Error playing sound:", error));
        }
      } else {
        setQuestion(generateQuestion());
        setResetKey((prevKey) => prevKey + 1);
      }
    } else {
      const newErrors = errors + 1;
      if (pigAudioRef.current) {
        pigAudioRef.current
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
      setErrors(newErrors);
      setIsWrongAnswer(true);
      setTimeout(() => setIsWrongAnswer(false), 1500);
      if (newErrors >= 3) {
        setGameOver(true);
      } else {
        setResetKey((prevKey) => prevKey + 1);
      }
    }
  };

  const answers = [
    question.answer,
    ...generateWrongAnswers(question.answer),
  ].sort(() => Math.random() - 0.5);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex-grow flex flex-col items-center justify-center p-4 ${
        isWrongAnswer ? "red-flash" : ""
      }`}
    >
      {showConfetti && <Confetti />}

      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-blue-800">
        Bubble Math Game
      </h1>
      {!gameOver && !gameWon ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-8 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
            {question.question || "Loading..."}
          </div>
          <div className="relative w-full h-48 sm:h-64">
            {answers.map((answer, index) => (
              <motion.button
                key={`${resetKey}-${index}`}
                className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-300 flex items-center justify-center text-lg sm:text-xl font-bold shadow-md hover:bg-yellow-400 focus:outline-none"
                initial={{ y: -50 }}
                animate={{ y: 200 }}
                onAnimationComplete={() => {
                  // Reset position logic here
                  // Logic to reset position should be handled outside of the definition
                  // You may need to use a state or ref to manage the position
                }}
                transition={{
                  duration: 6 + index * 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
                style={{ left: `${60 - index * 10}%`, y: 20 }} // Adjusted for desktop centering to the left
                onClick={() => checkAnswer(answer)}
              >
                {answer}
              </motion.button>
            ))}
          </div>
          <div
            className="mt-4 sm:mt-8 flex justify-between w-full max-w-xs"
            style={{ marginTop: "150px" }}
          >
            <div className="text-xl sm:text-2xl font-semibold">
              Score: {score}
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-red-600">
              Errors: {errors}/3
            </div>
          </div>
        </>
      ) : gameWon ? (
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
            Great job! Keep it up!
          </h2>
          <p className="text-lg sm:text-xl mb-2 sm:mb-4">
            That&apos;s all for today. Come back tomorrow! 😉
          </p>
          <p className="text-xl sm:text-2xl mb-2 sm:mb-4">
            Your final score: {score}
          </p>
          <Button
            onClick={handlePlayAgain}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-2">Your final score: {score}</p>
          <Button
            onClick={handlePlayAgain}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
