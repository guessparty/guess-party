import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import DailyGame from './components/DailyGame/DailyGame'
import Marathon from './components/Marathon/Marathon'
import MarathonHome from './components/Marathon/MarathonHome'
import Leaderboard from './components/Leaderboard/Leaderboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/daily" element={<DailyGame />} />
        <Route path="/marathon" element={<MarathonHome />} />
        <Route path="/marathon/play" element={<Marathon />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
