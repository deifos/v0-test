import { generateQuestion } from "@/lib/mathUtils";
import { motion } from "framer-motion";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { trackEvent } from "@/lib/utils";

export default function GrowingBubbleMathGame() {
  const [question, setQuestion] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [bubbleSize, setBubbleSize] = useState(50);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) {
      setQuestion(generateQuestion(true));
      setGameStarted(true);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
        setBubbleSize((prevSize) => prevSize + 15);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameOver, gameStarted, question]);

  const resetGame = () => {
    setQuestion(generateQuestion(true));
    setUserAnswer("");
    setScore(0);
    setErrors(0);
    setGameOver(false);
    setTimeLeft(10);
    setBubbleSize(50);
    setIsWrongAnswer(false);
    setGameStarted(true);
  };

  const handlePlayAgain = () => {
    trackEvent("GrowingBubbleMathGame");
    resetGame();
  };

  const checkAnswer = (e: FormEvent) => {
    e.preventDefault();
    const numericAnswer = parseInt(userAnswer, 10);
    if (numericAnswer === question.answer) {
      setScore(score + 1);
      setQuestion(generateQuestion(true));
      setUserAnswer("");
      setTimeLeft(10); // Reset the timer to 10
      setBubbleSize(50);
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      setIsWrongAnswer(true);
      setTimeout(() => setIsWrongAnswer(false), 1000);
      if (newErrors >= 2) {
        setGameOver(true);
      }
    }
  };

  return (
    <div
      className={`flex-grow flex flex-col items-center justify-center p-4 ${
        isWrongAnswer ? "red-flash" : ""
      }`}
    >
      <style jsx global>{`
        @keyframes redFlash {
          0%,
          100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(239, 68, 68, 0.5);
          }
        }
        .red-flash {
          animation: redFlash 1s ease-in-out;
        }
      `}</style>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-blue-800 text-center">
        Growing Bubble Math Game
      </h1>
      {!gameOver ? (
        <>
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-8 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
            {question.question || "Loading..."}
          </div>
          {gameStarted && (
            <>
              <div className="h-[calc(80vw)] max-h-[300px] flex items-center justify-center mb-4 sm:mb-8">
                <motion.div
                  className="bg-yellow-300 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg"
                  style={{
                    width: bubbleSize,
                    height: bubbleSize,
                    maxWidth: "80vw",
                    maxHeight: "80vw",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {timeLeft}
                </motion.div>
              </div>
              <form
                onSubmit={checkAnswer}
                className="flex flex-col items-center gap-2 sm:gap-4 w-full max-w-xs"
              >
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer"
                  className="text-xl sm:text-2xl font-bold text-center w-full"
                  autoFocus
                />
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 text-lg sm:text-xl font-bold"
                >
                  Submit
                </Button>
              </form>
              <div className="mt-4 sm:mt-8 flex justify-between w-full max-w-xs">
                <div className="text-lg sm:text-2xl font-semibold">
                  Score: {score}
                </div>
                <div className="text-lg sm:text-2xl font-semibold text-red-600">
                  Errors: {errors}/2
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
            Game Over!
          </h2>
          <p className="text-lg sm:text-xl mb-1 sm:mb-2">
            Your final score: {score}
          </p>
          <p className="text-lg sm:text-xl mb-2 sm:mb-4 text-red-600">
            Total errors: {errors}
          </p>
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
