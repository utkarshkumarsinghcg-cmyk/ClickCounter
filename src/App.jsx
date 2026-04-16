import { useState, useEffect, useRef } from 'react'

function App() {
  const [currentScore, setCurrentScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('clickCounterHighScore')
    return saved ? parseInt(saved) : 0
  })
  const [timeRemaining, setTimeRemaining] = useState(10)
  const [isActive, setIsActive] = useState(false)
  const [buttonSize, setButtonSize] = useState(1)
  const [statusMessage, setStatusMessage] = useState('Click "Start Game" to begin!')
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  
  const timerRef = useRef(null)

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      endGame()
    }

    return () => clearInterval(timerRef.current)
  }, [isActive, timeRemaining])

  const startGame = () => {
    setCurrentScore(0)
    setTimeRemaining(10)
    setIsActive(true)
    setButtonSize(1)
    setIsNewHighScore(false)
    setStatusMessage('Game in progress... Click fast!')
    document.body.classList.remove('high-score-bg')
  }

  const endGame = () => {
    setIsActive(false)
    clearInterval(timerRef.current)
    
    if (currentScore > highScore) {
      setHighScore(currentScore)
      localStorage.setItem('clickCounterHighScore', currentScore)
      setStatusMessage(`🎉 New High Score: ${currentScore}! Amazing!`)
      setIsNewHighScore(true)
      document.body.classList.add('high-score-bg')
      
      setTimeout(() => {
        document.body.classList.remove('high-score-bg')
      }, 2000)
    } else {
      setStatusMessage(`Game Over! Your score: ${currentScore}`)
    }
  }

  const handleClick = () => {
    if (isActive) {
      setCurrentScore((prev) => {
        const next = prev + 1
        if (next > 20) {
          setStatusMessage("🔥 You're on fire! Keep going!")
        }
        return next
      })
      
      if (buttonSize < 2) {
        setButtonSize((prev) => prev + 0.05)
      }
    }
  }

  const resetHighScore = () => {
    if (window.confirm('Are you sure you want to reset your high score?')) {
      localStorage.removeItem('clickCounterHighScore')
      setHighScore(0)
      setStatusMessage('High score has been reset!')
    }
  }

  const elapsed = 10 - timeRemaining
  const cps = elapsed > 0 ? (currentScore / elapsed).toFixed(1) : 0

  return (
    <div className="container">
      <h1>Click Counter Game</h1>
      <p className="subtitle">Click as fast as you can!</p>

      <div className="score-section">
        <div className="score-box">
          <h2>Current Score</h2>
          <div className={`score ${currentScore > 20 ? 'fire-score' : ''}`}>
            {currentScore}
          </div>
        </div>
        <div className="score-box">
          <h2>High Score</h2>
          <div className="score">{highScore}</div>
        </div>
        <div className="score-box">
          <h2>CPS</h2>
          <div className="score">{cps}</div>
        </div>
      </div>

      <div className="timer-section">
        <h2>Time Remaining</h2>
        <div className="timer">{timeRemaining}s</div>
      </div>

      <div className="button-section">
        <button
          className="click-btn"
          disabled={!isActive}
          onClick={handleClick}
          style={{ transform: `scale(${buttonSize})` }}
        >
          Click Me!
        </button>
        
        <button 
          className="start-btn" 
          onClick={startGame} 
          disabled={isActive}
        >
          {timeRemaining === 0 ? 'Play Again' : 'Start Game'}
        </button>
        
        <button className="reset-btn" onClick={resetHighScore}>
          Reset High Score
        </button>
      </div>

      <div className="status-message">
        {statusMessage}
      </div>
    </div>
  )
}

export default App
