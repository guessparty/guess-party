import { useNavigate } from 'react-router-dom'
import Header from '../components/Home/Header'
import Hero from '../components/Home/Hero'
import GameModes from '../components/Home/GameModes'
import Footer from '../components/Home/Footer'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Header />
      <Hero />
      <GameModes />
      <Footer />
    </div>
  )
}

export default Home
