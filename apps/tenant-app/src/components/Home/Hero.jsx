import { useNavigate } from 'react-router-dom'
import './Hero.css'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-subtitle">Bienvenue sur</h2>
          <h1 className="hero-title">GuessParty</h1>
          <p className="hero-description">
            Devinez les personnes, battez vos amis, gagnez chaque jour.
          </p>
          <p className="hero-subtext">
            Un jeu simple, addictif et social. Testez votre intuition avec un nouveau défi quotidien !
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/daily')}>
              🎮 Jouer Maintenant
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('modes').scrollIntoView({ behavior: 'smooth' })}>
              📖 Découvrir les Modes
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1 défi</span>
              <span className="stat-label">par jour</span>
            </div>
            <div className="stat">
              <span className="stat-number">3 modes</span>
              <span className="stat-label">de jeu</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞ amis</span>
              <span className="stat-label">à deviner</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-inner">
              <div className="card-icon">❓</div>
              <div className="card-text">Qui suis-je ?</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
