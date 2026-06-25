import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import Marathon from './components/Marathon/Marathon'
import MarathonHome from './components/Marathon/MarathonHome'
import Leaderboard from './components/Leaderboard/Leaderboard'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/marathon" element={<MarathonHome />} />
          <Route path="/marathon/play" element={<Marathon />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
