import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/GameModeSelect.css'

function GameModeSelect() {
  const navigate = useNavigate()
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const difficulties = ['WholeNumbers', 'Decimals', 'Negatives', 'NegativeDecimals']

  const difficultyDisplayNames = {
    'WholeNumbers': 'Whole Numbers',
    'Decimals': 'Decimals',
    'Negatives': 'Negatives',
    'NegativeDecimals': 'Negatives & Decimals'
  }

  const selectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty)
    setShowDifficultyDropdown(false)
  }

  const getDifficultyDescription = () => {
    switch(selectedDifficulty) {
      case 'WholeNumbers':
        return "Simple whole numbers only"
      case 'Decimals':
        return "Introduces numbers with one decimal place"
      case 'Negatives':
        return "Introduces negative whole numbers"
      case 'NegativeDecimals':
        return "Combines decimals with negative numbers"
      default:
        return "Choose your preferred difficulty level"
    }
  }

  const handleSpecialistClick = () => {
    setShowDropdown(!showDropdown)
  }

  const selectCategory = (category) => {
    setSelectedCategory(category)
    setShowDropdown(false)
  }

  const categories = ['Addition', 'Subtraction', 'Multiplication', 'Division']

  const getTypeDescription = () => {
    return selectedCategory 
      ? `All problems will be ${selectedCategory}`
      : "Choose a specific category of problems"
  }

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">Select Mode</h1>
        
        <div className="mode-section">
          <h2 className="mode-subtitle">Difficulty</h2>
          <div className="button-row">
            <div className="dropdown-container full-width">
              <button 
                id="difficulty-select-button"
                className={`menu-button-small ${selectedDifficulty ? 'selected' : ''}`}
                onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
              >
                {selectedDifficulty ? difficultyDisplayNames[selectedDifficulty] : 'Select Difficulty'} <span className="dropdown-arrow">▼</span>
              </button>
              {showDifficultyDropdown && (
                <div id="difficulty-dropdown-menu" className="dropdown-menu">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      className={`dropdown-item ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                      onClick={() => selectDifficulty(difficulty)}
                    >
                      {difficultyDisplayNames[difficulty]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mode-description">{getDifficultyDescription()}</div>
        </div>

        <div className="mode-section">
          <h2 className="mode-subtitle">Category</h2>
          <div className="button-row">
            <div className="dropdown-container full-width">
              <button 
                className={`menu-button-small ${selectedCategory ? 'selected' : ''}`}
                onClick={handleSpecialistClick}
              >
                {selectedCategory || 'Select Problem Type'} <span className="dropdown-arrow">▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu dropdown-menu-up">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`dropdown-item ${selectedCategory === category ? 'selected' : ''}`}
                      onClick={() => selectCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mode-description">{getTypeDescription()}</div>
        </div>

        <div className="navigation-buttons">
          <button 
            className="menu-button-small"
            onClick={() => navigate('/')}
          >
            Back
          </button>
          <button 
            className="menu-button-small"
            onClick={() => {
              if (selectedDifficulty && selectedCategory) {
                const route = `/play/${selectedDifficulty}-specialized-${selectedCategory}`
                navigate(route)
              }
            }}
            disabled={!selectedDifficulty || !selectedCategory}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameModeSelect
