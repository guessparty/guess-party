import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import './Header.css'

function Header({ setView }) {
  const navigate = useNavigate()

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="GuessParty" className="logo" />
        </div>

        <div className="admin-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            ← Retour à l'accueil
          </button>
          <button className="btn-primary" onClick={() => navigate('/daily')}>
            🎮 Jouer
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
