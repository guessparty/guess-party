import { useNavigate } from 'react-router-dom'
import './GameModes.css'

function GameModes() {
  const navigate = useNavigate()

  const modes = [
    {
      id: 'marathon',
      emoji: '🏃',
      title: 'Mode Marathon',
      description: 'Devinez toutes les personnes sans limite. Testez vos limites !',
      features: ['Sans limite', 'Classement', 'Défi personnel'],
      color: 'red',
      action: () => navigate('/marathon')
    }
  ]

  return (
    <section id="modes" className="game-modes">
      <div className="modes-header">
        <h2>Les Modes de Jeu</h2>
        <p>Choisissez votre aventure</p>
      </div>

      <div className="modes-grid">
        {modes.map((mode) => (
          <div key={mode.id} className={`mode-card mode-${mode.color}`}>
            <div className="mode-card-inner">
              <div className="mode-icon">{mode.emoji}</div>
              <h3 className="mode-title">{mode.title}</h3>
              <p className="mode-description">{mode.description}</p>

              <ul className="mode-features">
                {mode.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>

              {mode.comingSoon ? (
                <div className="coming-soon">
                  <span>Bientôt disponible</span>
                </div>
              ) : (
                <button className="btn btn-mode" onClick={mode.action}>
                  🚀 Démarrer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GameModes
