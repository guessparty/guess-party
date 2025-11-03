import { formatStats } from '../../utils/gameHelpers'
import './GameStats.css'

// Composant qui affiche les statistiques du joueur
function GameStats({ stats }) {
  // Formater les stats pour l'affichage
  const formatted = formatStats(stats)

  return (
    <div className="game-stats">
      <h3>📊 Vos Statistiques</h3>
      
      <div className="stats-grid">
        {/* Parties jouées */}
        <div className="stat-card">
          <div className="stat-value">{formatted.totalGames}</div>
          <div className="stat-label">Parties jouées</div>
        </div>

        {/* Taux de victoire */}
        <div className="stat-card">
          <div className="stat-value">{formatted.winRate}%</div>
          <div className="stat-label">Taux de victoire</div>
        </div>

        {/* Série actuelle */}
        <div className="stat-card highlight">
          <div className="stat-value">
            🔥 {formatted.currentStreak}
          </div>
          <div className="stat-label">Série actuelle</div>
        </div>

        {/* Meilleure série */}
        <div className="stat-card">
          <div className="stat-value">⭐ {formatted.maxStreak}</div>
          <div className="stat-label">Meilleure série</div>
        </div>

        {/* Moyenne de tentatives */}
        <div className="stat-card">
          <div className="stat-value">{formatted.averageAttempts}</div>
          <div className="stat-label">Tentatives moyennes</div>
        </div>

        {/* Pourcentage premier coup */}
        <div className="stat-card">
          <div className="stat-value">{formatted.firstTryPercentage}%</div>
          <div className="stat-label">Premier coup</div>
        </div>
      </div>
    </div>
  )
}

export default GameStats
