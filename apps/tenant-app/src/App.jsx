import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DailyGame from './components/DailyGame/DailyGame'
import Admin from './pages/Admin'
import './assets/styles/global.css'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<DailyGame />} />
        <Route path="/game/daily" element={<DailyGame />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
