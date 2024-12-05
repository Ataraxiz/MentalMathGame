import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import '../styles/GameScreen.css'
import { FaHeart } from 'react-icons/fa'
import GameOverScreen from './GameOverScreen'

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Move SCALING_FACTORS outside the component since it's constant
const SCALING_FACTORS = {
  Addition: 1.2,
  Subtraction: 1.2,
  Multiplication: 1.05,
  Division: 1.05,
}

function GameScreen() {
  const navigate = useNavigate()
  const { mode } = useParams()
  const location = useLocation()
  
  let difficulty, problemType, timeLimit, problemTypes, isTimedMode
  if (location.pathname.startsWith('/practice')) {
    const [difficultyPart, categoriesPart, timerPart] = mode.split('-')
    difficulty = difficultyPart
    problemTypes = categoriesPart ? categoriesPart.split('+') : []
    isTimedMode = timerPart ? true : false
    timeLimit = timerPart ? parseInt(timerPart.replace('s', '')) : null
    problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)]
  } else {
    [difficulty, problemType] = mode.split('-specialized-')
    isTimedMode = true
    timeLimit = 180
  }

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [currentProblem, setCurrentProblem] = useState({ num1: 12, num2: 15 })
  const [userAnswer, setUserAnswer] = useState('')
  const [gameState, setGameState] = useState('ready')
  const [range, setRange] = useState(10)
  const [currentProblemType, setCurrentProblemType] = useState(
    location.pathname.startsWith('/practice') 
      ? problemTypes[Math.floor(Math.random() * problemTypes.length)]
      : problemType
  )
  const [problemHistory, setProblemHistory] = useState([])
  const [problemStartTime, setProblemStartTime] = useState(null)

  const getCurrentRange = useCallback(() => {
    const baseRange = 5 // Starting range
    const scalingFactor = SCALING_FACTORS[currentProblemType] || 1.5
    return Math.floor(baseRange * Math.pow(scalingFactor, score))
  }, [currentProblemType, score])

  const generateProblem = useCallback(() => {
    const currentRange = getCurrentRange()
    let num1, num2;
    
    switch(difficulty) {
      case 'WholeNumbers':
        if (currentProblemType === 'Division') {
          // Generate divisor (first number) between 2 and range, excluding 10
          do {
            num2 = Math.floor(Math.random() * (currentRange - 1)) + 2;
          } while (num2 === 10);

          // Generate the answer (second number) within range
          const answer = Math.floor(Math.random() * (currentRange - 1)) + 2;
          
          // Calculate dividend by multiplying divisor and answer
          num1 = num2 * answer;
          
          // Now num1 is dividend, num2 is divisor, and num1/num2 = answer
          // Both divisor and answer are guaranteed to be within range
        } else {
          num1 = Math.floor(Math.random() * currentRange) + 1
          num2 = Math.floor(Math.random() * currentRange) + 1
          if (currentProblemType === 'Subtraction') {
            [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)]
          }
        }
        break;
      case 'Decimals':
        num1 = Math.floor(Math.random() * currentRange * 10) / 10
        num2 = Math.floor(Math.random() * currentRange * 10) / 10
        if (currentProblemType === 'Subtraction') {
          [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)]
        }
        break;
      case 'Negatives':
        num1 = Math.floor(Math.random() * currentRange * 2) - currentRange
        num2 = Math.floor(Math.random() * currentRange * 2) - currentRange
        break;
      case 'NegativeDecimals':
        num1 = (Math.floor(Math.random() * currentRange * 20) - currentRange * 10) / 10
        num2 = (Math.floor(Math.random() * currentRange * 20) - currentRange * 10) / 10
        break;
      case 'Hidden':
        num1 = (Math.floor(Math.random() * currentRange * 20) - currentRange * 10) / 10
        num2 = (Math.floor(Math.random() * currentRange * 20) - currentRange * 10) / 10
        break;
      default:
        num1 = Math.floor(Math.random() * currentRange)
        num2 = Math.floor(Math.random() * currentRange)
    }

    // Remove the general division handler since we're handling it in each difficulty case
    setRange(currentRange)
    return { num1, num2 }
  }, [difficulty, currentProblemType, getCurrentRange])

  const handleAnswer = () => {
    if (gameState !== 'playing') return;
    
    const endTime = Date.now()
    const timeSpent = (endTime - problemStartTime) / 1000

    let correctAnswer;
    switch (currentProblemType) {
      case 'Multiplication':
        correctAnswer = Number((currentProblem.num1 * currentProblem.num2).toFixed(2));
        break;
      case 'Subtraction':
        correctAnswer = Number((currentProblem.num1 - currentProblem.num2).toFixed(2));
        break;
      case 'Division':
        correctAnswer = Number((currentProblem.num1 / currentProblem.num2).toFixed(2));
        break;
      case 'Addition':
      default:
        correctAnswer = Number((currentProblem.num1 + currentProblem.num2).toFixed(2));
    }

    const userNumberAnswer = parseFloat(userAnswer.replace(',', '.'))
    const isCorrect = Math.abs(userNumberAnswer - correctAnswer) < 0.01

    setProblemHistory(prev => [...prev, {
      problem: `${currentProblem.num1} ${currentProblemType === 'Multiplication' ? '×' : 
        currentProblemType === 'Division' ? '÷' :
        currentProblemType === 'Subtraction' ? '-' : '+'} ${currentProblem.num2}`,
      solution: correctAnswer,
      userAnswer: userNumberAnswer,
      timeSpent,
      isCorrect
    }])

    if (isCorrect) {
      setScore(prevScore => prevScore + 1)
      if (location.pathname.startsWith('/practice')) {
        setCurrentProblemType(problemTypes[Math.floor(Math.random() * problemTypes.length)])
      }
      const newProblem = generateProblem()
      setCurrentProblem(newProblem)
      setProblemStartTime(Date.now())
    } else {
      setLives(prevLives => {
        const newLives = prevLives - 1
        if (newLives <= 0) {
          setGameState('gameover')
        }
        return newLives
      })
    }
    setUserAnswer('')
  }

  const getProblemDisplay = () => {
    if (difficulty === 'Hidden') {
      return `? ${currentProblemType === 'Multiplication' ? '×' : 
        currentProblemType === 'Division' ? '÷' :
        currentProblemType === 'Subtraction' ? '-' : '+'} ? = ?`
    }
    return `${currentProblem.num1} ${currentProblemType === 'Multiplication' ? '×' : 
      currentProblemType === 'Division' ? '÷' :
      currentProblemType === 'Subtraction' ? '-' : '+'} ${currentProblem.num2} = ?`
  }

  useEffect(() => {
    if (gameState === 'playing') {
      const newProblem = generateProblem()
      setCurrentProblem(newProblem)
      setProblemStartTime(Date.now())
    }
  }, [gameState, generateProblem])

  // Timer for blitz mode (3 minutes)
  useEffect(() => {
    let timer
    if (gameState === 'playing' && isTimedMode && timeLimit) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setGameState('gameover')
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState, isTimedMode, timeLimit])

  return (
    <div className="game-screen">
      <div className="game-screen-container">
        {gameState !== 'gameover' && (
          <div className="game-header">
            <div className="game-info">
              <div className="lives-display">
                Lives: {[...Array(3)].map((_, index) => (
                  <FaHeart 
                    key={index} 
                    className={`heart-icon ${index >= lives ? 'heart-empty' : 'heart-full'}`}
                  />
                ))}
              </div>
              <span className="score-display">Score: {score}</span>
              {isTimedMode && timeLimit !== null && (
                <span className={`time-display ${timeLeft < 30 ? 'time-critical' : ''}`}>
                  Time: {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="game-content">
          {gameState === 'ready' && (
            <div className="game-ready">
              <h2>Ready to play?</h2>

              <button 
                className="menu-button"
                onClick={() => setGameState('playing')}
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="game-playing">
              <div className="problem">
                {getProblemDisplay()}
              </div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^-?\d*[.,]?\d*$/.test(value)) {
                    setUserAnswer(value);
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
                autoFocus
              />
              <div className="difficulty-indicator">
                Range: 0-{range}
              </div>
              <div className="game-controls">
                <button 
                  className="menu-button-small"
                  onClick={handleAnswer}
                >
                  Submit
                </button>
                <button 
                  className="menu-button-small"
                  onClick={() => navigate('/')}
                >
                  Quit
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <GameOverScreen 
              score={score}
              problemHistory={problemHistory}
              onPlayAgain={() => {
                setScore(0)
                setLives(3)
                setTimeLeft(timeLimit)
                setProblemHistory([])
                setGameState('ready')
              }}
              difficulty={difficulty}
              problemType={currentProblemType}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default GameScreen