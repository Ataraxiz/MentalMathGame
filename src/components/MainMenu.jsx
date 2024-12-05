import { useNavigate } from 'react-router-dom'
import '../styles/MainMenu.css'

function MainMenu() {
  const navigate = useNavigate()

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">Mental Math</h1>
        <div className="menu-buttons">
          <button 
            className="menu-button"
            onClick={() => navigate('/play')}
          >
            Play
          </button>
          <button 
            className="menu-button"
            onClick={() => navigate('/practice')}
          >
            Practice
          </button>
          <button 
            className="menu-button"
            onClick={() => navigate('/highscores')}
          >
            High Scores
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
