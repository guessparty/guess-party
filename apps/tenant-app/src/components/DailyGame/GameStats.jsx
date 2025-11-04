import { useState, useEffect } from 'react'
import './GameStats.css'

function GameStats() {
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalAttempts: 0,
    firstTryWins: 0,
    averageAttempts: 0,
    firstTryPercentage: 0
  })

  useEffect(() => {
    const statsStr = localStorage.getItem('guess-party-stats')
    if (statsStr) {
      setStats(JSON.parse(statsStr))
    }
  }, [])

  const winRate = stats.totalGames > 0 ? ((stats.gamesWon / stats.totalGames) * 100).toFixed(0) : 0

  return (
    <div className="game-stats">
      <div className="stats-header">
        <h2>📊 Vos Statistiques</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.totalGames}</div>
          <div className="stat-label">Parties joués</div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-value">{winRate}%</div>
          <div className="stat-label">Taux de victoire</div>
        </div>

        <div className="stat-card stat-average">
          <div className="stat-value">{stats.averageAttempts}</div>
          <div className="stat-label">Moy. tentatives</div>
        </div>

        <div className="stat-card stat-flame">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Série actuelle</div>
        </div>

        <div className="stat-card stat-star">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.maxStreak}</div>
          <div className="stat-label">Meilleure série</div>
        </div>

        <div className="stat-card stat-perfect">
          <div className="stat-icon">💯</div>
          <div className="stat-value">{stats.firstTryWins}</div>
          <div className="stat-label">Premiers essais</div>
        </div>
      </div>
    </div>
  )
}

export default GameStats
