"use client"

import { useState, useEffect, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"

const generateQuestion = (includeSubtraction = false) => {
  const operation = includeSubtraction && Math.random() < 0.5 ? '-' : '+'
  let num1, num2
  if (operation === '+') {
    num1 = Math.floor(Math.random() * 10)
    num2 = Math.floor(Math.random() * 10)
  } else {
    num1 = Math.floor(Math.random() * 10) + 5
    num2 = Math.floor(Math.random() * num1)
  }
  const question = `${num1} ${operation} ${num2}`
  const answer = operation === '+' ? num1 + num2 : num1 - num2
  return { question, answer }
}

const generateWrongAnswers = (correctAnswer: number) => {
  const wrong1 = correctAnswer + Math.floor(Math.random() * 5) + 1
  let wrong2 = correctAnswer - Math.floor(Math.random() * 5) - 1
  if (wrong2 < 0) wrong2 = correctAnswer + Math.floor(Math.random() * 5) + 2
  return [wrong1, wrong2]
}

const games = [
  { name: "Game 1: Bubble Math", href: "/game1" },
  { name: "Game 2: Growing Bubble", href: "/game2" },
]

function GameNavBar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="flex-shrink-0">
              <span className="text-2xl font-bold">MathGames</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {games.map((game) => (
                <button
                  key={game.name}
                  onClick={() => router.push(game.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    pathname === game.href
                      ? "bg-primary-foreground text-primary"
                      : "hover:bg-primary-foreground/10"
                  )}
                >
                  {game.name}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {games.map((game) => (
                  <DropdownMenuItem key={game.name} onSelect={() => router.push(game.href)}>
                    {game.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

function BubbleMathGame() {
  const [question, setQuestion] = useState(generateQuestion())
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [isWrongAnswer, setIsWrongAnswer] = useState(false)

  const resetGame = () => {
    setQuestion(generateQuestion())
    setScore(0)
    setErrors(0)
    setGameOver(false)
    setResetKey(prevKey => prevKey + 1)
    setIsWrongAnswer(false)
  }

  const checkAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === question.answer) {
      setScore(score + 1)
      setQuestion(generateQuestion())
      setResetKey(prevKey => prevKey + 1)
    } else {
      const newErrors = errors + 1
      setErrors(newErrors)
      setIsWrongAnswer(true)
      setTimeout(() => setIsWrongAnswer(false), 1500)
      if (newErrors >= 3) {
        setGameOver(true)
      } else {
        setResetKey(prevKey => prevKey + 1)
      }
    }
  }

  const answers = [question.answer, ...generateWrongAnswers(question.answer)].sort(() => Math.random() - 0.5)

  return (
    <div className={`flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400 p-4 ${isWrongAnswer ? 'red-flash' : ''}`}>
      <style jsx global>{`
        @keyframes redFlash {
          0%, 100% { background-color: transparent; }
          16.67%, 50%, 83.33% { background-color: rgba(239, 68, 68, 0.5); }
        }
        .red-flash {
          animation: redFlash 1.5s ease-in-out;
        }
      `}</style>
      <h1 className="text-4xl font-bold mb-8 text-blue-800">Bubble Math Game</h1>
      {!gameOver ? (
        <>
          <div className="text-3xl font-semibold mb-8 bg-white rounded-full px-6 py-3 shadow-lg">
            {question.question}
          </div>
          <div className="relative w-full h-64">
            {answers.map((answer, index) => (
              <motion.button
                key={`${resetKey}-${index}`}
                className="absolute w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center text-xl font-bold shadow-md hover:bg-yellow-400 focus:outline-none"
                initial={{ y: -100 }}
                animate={{ y: 300 }}
                transition={{
                  duration: 8 + index * 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
                style={{ left: `${25 + index * 25}%` }}
                onClick={() => checkAnswer(answer)}
              >
                {answer}
              </motion.button>
            ))}
          </div>
          <div className="mt-8 flex justify-between w-full max-w-xs">
            <div className="text-2xl font-semibold">Score: {score}</div>
            <div className="text-2xl font-semibold text-red-600">Errors: {errors}/3</div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-2">Your final score: {score}</p>
          <p className="text-xl mb-4 text-red-600">Total errors: {errors}</p>
          <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Play Again
          </Button>
        </div>
      )}
    </div>
  )
}

function GrowingBubbleMathGame() {
  const [question, setQuestion] = useState(generateQuestion(true))
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [bubbleSize, setBubbleSize] = useState(50)
  const [isWrongAnswer, setIsWrongAnswer] = useState(false)

  useEffect(() => {
    if (!gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setGameOver(true)
            return 0
          }
          return prevTime - 1
        })
        setBubbleSize((prevSize) => prevSize + 15)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameOver, question])

  const resetGame = () => {
    setQuestion(generateQuestion(true))
    setUserAnswer('')
    setScore(0)
    setErrors(0)
    setGameOver(false)
    setTimeLeft(10)
    setBubbleSize(50)
    setIsWrongAnswer(false)
  }

  const checkAnswer = (e: FormEvent) => {
    e.preventDefault()
    const numericAnswer = parseInt(userAnswer, 10)
    if (numericAnswer === question.answer) {
      setScore(score + 1)
      setQuestion(generateQuestion(true))
      setUserAnswer('')
      setTimeLeft(10)
      setBubbleSize(50)
    } else {
      const newErrors = errors + 1
      setErrors(newErrors)
      setIsWrongAnswer(true)
      setTimeout(() => setIsWrongAnswer(false), 1000)
      if (newErrors >= 2) {
        setGameOver(true)
      }
    }
  }

  return (
    <div className={`flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400 p-4 ${isWrongAnswer ? 'red-flash' : ''}`}>
      <style jsx global>{`
        @keyframes redFlash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.5); }
        }
        .red-flash {
          animation: redFlash 1s ease-in-out;
        }
      `}</style>
      <h1 className="text-4xl font-bold mb-8 text-blue-800">Growing Bubble Math Game</h1>
      {!gameOver ? (
        <>
          <div className="text-3xl font-semibold mb-8 bg-white rounded-full px-6 py-3 shadow-lg">
            {question.question}
          </div>
          <motion.div
            className="bg-yellow-300 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-8"
            style={{
              width: bubbleSize,
              height: bubbleSize,
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
          <form onSubmit={checkAnswer} className="flex flex-col items-center gap-4">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer"
              className="text-2xl font-bold text-center w-40"
              autoFocus
            />
            <Button type="submit" className="w-40 h-12 text-xl font-bold">
              Submit
            </Button>
          </form>
          <div className="mt-8 flex justify-between w-full max-w-xs">
            <div className="text-2xl font-semibold">Score: {score}</div>
            <div className="text-2xl font-semibold text-red-600">Errors: {errors}/2</div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-2">Your final score: {score}</p>
          <p className="text-xl mb-4 text-red-600">Total errors: {errors}</p>
          <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Play Again
          </Button>
        </div>
      )}
    </div>
  )
}

export function MathGames() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen">
      <GameNavBar />
      {pathname === '/game1' && <BubbleMathGame />}
      {pathname === '/game2' && <GrowingBubbleMathGame />}
      {pathname !== '/game1' && pathname !== '/game2' && (
        <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 text-blue-800">Welcome to MathGames!</h1>
            <p className="text-xl mb-8">Choose a game from the navigation menu to start playing.</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.push('/game1')} className="text-lg">
                Play Bubble Math
              </Button>
              <Button onClick={() => router.push('/game2')} className="text-lg">
                Play Growing Bubble Math
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}