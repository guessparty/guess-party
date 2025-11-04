import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import './Header.css'

function Header() {
  const navigate = useNavigate()

  return (
    <header className="home-header">
      <div className="header-container">
        <div className="logo-section" onClick={() => navigate('/')}>
          <img src={logo} alt="GuessParty" className="logo" />
          <h1 className="logo-text">GuessParty</h1>
        </div>
        
        <nav className="header-nav">
          <button className="nav-link nav-link-secondary" onClick={() => navigate('/game')}>
            Démarrer
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
