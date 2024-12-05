import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import MainMenu from './components/MainMenu'
import GameModeSelect from './components/GameModeSelect'
import GameScreen from './components/GameScreen'
import HighScores from './components/HighScores'
import PracticeMode from './components/PracticeMode'
import './styles/App.css'
import './styles/shared.css'
import { initDatabase } from './utils/database';

function App() {
  useEffect(() => {
    const initializeDb = async () => {
      try {
        await initDatabase();
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeDb();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/play" element={<GameModeSelect />} />
      <Route path="/practice" element={<PracticeMode />} />
      <Route path="/practice/:mode" element={<GameScreen />} />
      <Route path="/play/:mode" element={<GameScreen />} />
      <Route path="/highscores" element={<HighScores />} />
    </Routes>
  )
}

export default App

