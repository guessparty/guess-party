import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DailyGame from './components/DailyGame/DailyGame'
import './assets/styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<DailyGame />} />
        <Route path="/game/daily" element={<DailyGame />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
