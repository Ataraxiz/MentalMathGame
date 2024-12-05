import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initDatabase, getTopScores } from '../utils/database'
import '../styles/HighScores.css'

function HighScores() {
  const navigate = useNavigate()
  const [selectedDifficulty, setSelectedDifficulty] = useState('WholeNumbers')
  const [selectedType, setSelectedType] = useState('Addition')
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scores, setScores] = useState([])

  const difficulties = ['WholeNumbers', 'Decimals', 'Negatives', 'NegativeDecimals']
  const problemTypes = ['Addition', 'Subtraction', 'Multiplication', 'Division']

  const difficultyDisplayNames = {
    'WholeNumbers': 'Whole Numbers',
    'Decimals': 'Decimals',
    'Negatives': 'Negatives',
    'NegativeDecimals': 'Negatives & Decimals',
  }

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true)
        setError(null)
        const db = await initDatabase()
        const result = await getTopScores(db, selectedDifficulty, selectedType)
        
        // Transform the result to only include the fields we need
        const formattedScores = result.map(row => ({
          score: row[1],          // score
          username: row[2],       // username
          date: row[5]           // date
        }))
        
        setScores(formattedScores)
      } catch (error) {
        console.error('Error fetching scores:', error)
        setError('Failed to load high scores')
      } finally {
        setLoading(false)
      }
    }

    fetchScores()
  }, [selectedDifficulty, selectedType])

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">High Scores</h1>
        
        <nav className="scores-nav">
          <div className="dropdown-container">
            <button 
              className="nav-button"
              onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
            >
              <span>{difficultyDisplayNames[selectedDifficulty]}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {showDifficultyDropdown && (
              <div className="dropdown-menu">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    className={`dropdown-item ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedDifficulty(difficulty)
                      setShowDifficultyDropdown(false)
                    }}
                  >
                    {difficultyDisplayNames[difficulty]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <button 
              className="nav-button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <span>{selectedType}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {showTypeDropdown && (
              <div className="dropdown-menu">
                {problemTypes.map(type => (
                  <button
                    key={type}
                    className={`dropdown-item ${selectedType === type ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedType(type)
                      setShowTypeDropdown(false)
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="highscores-container">
          {loading ? (
            <p>Loading scores...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="highscores-table">
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Username</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.length > 0 ? (
                  scores.map((score, index) => (
                    <tr key={index}>
                      <td>{score.score}</td>
                      <td>{score.username || 'Anonymous'}</td>
                      <td>{new Date(score.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-scores">
                      No scores yet for this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <button 
          className="menu-button"
          onClick={() => navigate('/')}
        >
          Back to Menu
        </button>
      </div>
    </div>
  )
}

export default HighScores