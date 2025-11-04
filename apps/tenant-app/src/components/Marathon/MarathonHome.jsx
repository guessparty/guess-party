import { useNavigate } from 'react-router-dom'
import './MarathonHome.css'

function MarathonHome() {
  const navigate = useNavigate()

  return (
    <div className="marathon-home">
      <div className="marathon-hero">
        <div className="hero-content">
          <h1>🏃 Mode Marathon</h1>
          <p className="hero-subtitle">Défiez-vous sans limite !</p>
          <p className="hero-description">
            Trouvez toutes les personnes avec le moins de coup possible.<br/> 
            Pas de limite de tentatives, mais êtes-vous à la hauteur ?
          </p>

          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span className="feature-text">Devinez toutes les personnes</span>
            </div>
            <div className="feature">
              <span className="feature-icon">➖</span>
              <span className="feature-text">Moins de coup possible</span>
            </div>
            
            <div className="feature">
              <span className="feature-icon">🥇</span>
              <span className="feature-text">Qui sera le meilleur ?</span>
            </div>
          </div>

          <div className="hero-actions">
            <button 
              className="btn-play"
              onClick={() => navigate('/marathon/play')}
            >
              ▶️ Jouer
            </button>
            <button 
              className="btn-leaderboard"
              onClick={() => navigate('/leaderboard')}
            >
              🏆 Classement
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-icon">🏃‍♂️</div>
        </div>
      </div>
    </div>
  )
}

export default MarathonHome
