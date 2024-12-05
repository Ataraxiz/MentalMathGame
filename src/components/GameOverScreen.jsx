import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { initDatabase, saveHighScoreWithHistory } from '../utils/database'
import '../styles/GameOverScreen.css'

function GameOverScreen({ score, problemHistory, onPlayAgain, difficulty, problemType }) {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  })
  const [username, setUsername] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  const isPracticeMode = window.location.pathname.includes('practice')

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    
    try {
      setSaveStatus('saving')
      const db = await initDatabase()
      
      console.log('Attempting to save:', {
        score,
        username: username.trim(),
        difficulty,
        problemType
      })

      await saveHighScoreWithHistory(db, {
        score,
        username: username.trim(),
        difficulty,
        problemType
      }, problemHistory.map((attempt, index) => ({
        problemText: attempt.problem,
        solution: attempt.solution,
        userAnswer: attempt.userAnswer,
        timeSpent: attempt.timeSpent,
        isCorrect: attempt.isCorrect,
        problemNumber: index + 1
      })))
      
      const highScores = db.exec('SELECT * FROM high_scores');
      const problemHistoryData = db.exec('SELECT * FROM problem_history');
      
      console.log('Database contents after save:', {
        highScores: {
          columns: highScores[0].columns,
          values: highScores[0].values.map(row => ({
            id: row[0],
            score: row[1],
            username: row[2],
            difficulty: row[3],
            problemType: row[4],
            date: row[5]
          }))
        },
        problemHistory: problemHistoryData[0] ? {
          columns: problemHistoryData[0].columns,
          values: problemHistoryData[0].values.map(row => ({
            id: row[0],
            highScoreId: row[1],
            problem: row[2],
            solution: row[3],
            userAnswer: row[4],
            timeSpent: row[5],
            isCorrect: row[6],
            problemNumber: row[7]
          }))
        } : 'No problem history found'
      });
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Failed to save score and history:', error)
      setSaveStatus('error')
    }
  }

  const sortedHistory = [...problemHistory].map((item, index) => ({
    ...item,
    originalIndex: index + 1
  })).sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Convert strings to numbers for numeric columns
    if (sortConfig.key === 'timeSpent' || sortConfig.key === 'solution' || sortConfig.key === 'userAnswer') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return <span className="sort-indicator">↕</span>;
    return <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <p>Final Score: {score}</p>
      
      <div className="problem-history">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('originalIndex')}>
                Nr. {getSortIndicator('originalIndex')}
              </th>
              <th onClick={() => requestSort('problem')}>
                Problem {getSortIndicator('problem')}
              </th>
              <th onClick={() => requestSort('solution')}>
                Solution {getSortIndicator('solution')}
              </th>
              <th onClick={() => requestSort('userAnswer')}>
                Answer {getSortIndicator('userAnswer')}
              </th>
              <th onClick={() => requestSort('timeSpent')}>
                Time (s) {getSortIndicator('timeSpent')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((attempt, index) => (
              <tr key={index} className={attempt.isCorrect ? 'correct' : 'incorrect'}>
                <td>{attempt.originalIndex}</td>
                <td>{attempt.problem}</td>
                <td>{attempt.solution}</td>
                <td>{attempt.userAnswer}</td>
                <td>{attempt.timeSpent.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isPracticeMode && (
        <form onSubmit={handleSubmit} className="username-input">
          <p>Save Score to High Score?</p>
          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            disabled={saveStatus === 'success'}
          />
          <button 
            type="submit"
            disabled={!username.trim() || saveStatus === 'success' || saveStatus === 'saving'}
            className="menu-button-small"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Submit'}
          </button>
          {saveStatus === 'success' && <p className="success-message">Score saved successfully!</p>}
          {saveStatus === 'error' && <p className="error-message">Failed to save score. Please try again.</p>}
        </form>
      )}

      <div className="game-over-buttons">
        <button 
          className="menu-button-small"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
        <button 
          className="menu-button-small"
          onClick={() => navigate('/')}
        >
          Main Menu
        </button>
      </div>
    </div>
  )
}

GameOverScreen.propTypes = {
  score: PropTypes.number.isRequired,
  problemHistory: PropTypes.arrayOf(PropTypes.shape({
    problem: PropTypes.string.isRequired,
    solution: PropTypes.number.isRequired,
    userAnswer: PropTypes.number.isRequired,
    timeSpent: PropTypes.number.isRequired,
    isCorrect: PropTypes.bool.isRequired
  })).isRequired,
  onPlayAgain: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
  problemType: PropTypes.string.isRequired
}

export default GameOverScreen 