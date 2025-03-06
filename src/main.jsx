import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NormalGame from './game/normal_game.jsx'
import EasyGame from './game/easy_game.jsx'
import Rules from './pages/rules.jsx'
import { GameProvider } from './game_context'
import HighScoresPage from './pages/scores.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/game/normal" element={<NormalGame />} />
          <Route path="/game/easy" element={<EasyGame />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/scores" element={<HighScoresPage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  </StrictMode>
)
