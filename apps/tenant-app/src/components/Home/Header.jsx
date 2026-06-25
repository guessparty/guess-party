import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import logo from '../../assets/logo.jpg'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { user, planConfig, logout } = useApp()

  return (
    <header className="home-header">
      <div className="header-container">
        <div className="logo-section" onClick={() => navigate('/')}>
          <img src={logo} alt="GuessParty" className="logo" />
          <h1 className="logo-text">GuessParty</h1>
        </div>
        
        <nav className="header-nav">
          <button className="nav-link" onClick={() => navigate('/tarifs')}>
            Tarifs
          </button>
          {user ? (
            <>
              <span className="nav-plan">{planConfig.emoji} {planConfig.name}</span>
              <button className="nav-link" onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <button className="nav-link" onClick={() => navigate('/connexion')}>
              Connexion
            </button>
          )}
          <button className="nav-link nav-link-secondary" onClick={() => navigate('/marathon')}>
            Démarrer
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
