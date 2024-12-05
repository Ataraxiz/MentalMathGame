import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/GameModeSelect.css'

function PracticeMode() {
  const navigate = useNavigate()
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isTimed, setIsTimed] = useState(false)
  const [timeLimit, setTimeLimit] = useState(3)

  const difficulties = ['WholeNumbers', 'Decimals', 'Negatives', 'NegativeDecimals']
  const categories = ['Addition', 'Subtraction', 'Multiplication', 'Division']
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

  const handleCategoryClick = () => {
    setShowDropdown(!showDropdown)
  }

  const selectCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      }
      return [...prev, category]
    })
  }

  const getCategoryDisplayText = () => {
    if (selectedCategories.length === 0) return 'Select Problem Type'
    if (selectedCategories.length === categories.length) return 'All Categories'
    return selectedCategories.join(', ')
  }

  const getTypeDescription = () => {
    if (selectedCategories.length === 0) return "Choose specific categories of problems"
    return `Problems will include: ${selectedCategories.join(', ')}`
  }

  console.log({
    difficulties,
    difficultyDisplayNames,
    selectedDifficulty,
    showDifficultyDropdown
  })

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">Practice Mode</h1>
        
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
                  {difficulties.map((difficulty) => {
                    console.log('Rendering difficulty:', {
                      difficulty,
                      displayName: difficultyDisplayNames[difficulty],
                      raw: difficulty
                    });
                    return (
                      <button
                        key={difficulty}
                        className={`dropdown-item ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                        onClick={() => selectDifficulty(difficulty)}
                      >
                        {difficultyDisplayNames[difficulty]}
                      </button>
                    );
                  })}
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
                className={`menu-button-small ${selectedCategories.length > 0 ? 'selected' : ''}`}
                onClick={handleCategoryClick}
              >
                {getCategoryDisplayText()} <span className="dropdown-arrow">▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`dropdown-item ${selectedCategories.includes(category) ? 'selected' : ''}`}
                      onClick={() => selectCategory(category)}
                    >
                      <span className="checkbox">
                        {selectedCategories.includes(category) ? '✓' : ''}
                      </span>
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mode-description">{getTypeDescription()}</div>
        </div>

        <div className="mode-section">
          <h2 className="mode-subtitle">
            <label className="timer-label">
              <input
                type="checkbox"
                checked={isTimed}
                onChange={(e) => setIsTimed(e.target.checked)}
              />
              Timed Mode
            </label>
          </h2>
          <div className="button-row">
            <div className="dropdown-container full-width">
              <div className="time-input">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 0))}
                  disabled={!isTimed}
                />
                <span>minutes</span>
              </div>
            </div>
          </div>
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
              if (selectedDifficulty && selectedCategories.length > 0) {
                const timerParam = isTimed ? `-${timeLimit * 60}s` : ''
                const categoriesParam = selectedCategories.join('+')
                navigate(`/practice/${selectedDifficulty}-${categoriesParam}${timerParam}`)
              }
            }}
            disabled={!selectedDifficulty || selectedCategories.length === 0}
          >
            Start Practice
          </button>
        </div>
      </div>
    </div>
  )
}

export default PracticeMode