import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Leaderboard.css'

function Leaderboard() {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const leaderboardStr = localStorage.getItem('guess-party-marathon-leaderboard')
    if (leaderboardStr) {
      const data = JSON.parse(leaderboardStr)
      // Trier par nombre de coups
      data.sort((a, b) => a.attempts - b.attempts)
      setLeaderboard(data)
    }
    setLoading(false)
  }, [])

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const day = date.toLocaleDateString('fr-FR')
    const time = date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
    return `${day} à ${time}`
  }

  if (loading) {
    return (
      <div className="leaderboard">
        <div className="loading">
          <p>⏳ Chargement du classement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Retour
        </button>
        <h1>🏅 Classement Marathon</h1>
        <div className="spacer"></div>
      </div>

      <div className="leaderboard-container">
        {leaderboard.length === 0 ? (
          <div className="empty-leaderboard">
            <p>Aucun score enregistré pour le moment.</p>
            <p>Soyez le premier à terminer le Marathon !</p>
            <button onClick={() => navigate('/marathon')} className="btn-play-marathon">
              🏃‍♂️ Jouer au Marathon
            </button>
          </div>
        ) : (
          <div className="leaderboard-table">
            {leaderboard.map((score, index) => (
              <div key={index} className={`leaderboard-row ${index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : ''}`}>
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && <span>#{index + 1}</span>}
                </div>
                <div className="player-info">
                  <div className="player-name">{score.playerName}</div>
                  <div className="player-date">
                    {formatDateTime(score.date)}
                  </div>
                </div>
                <div className="player-stats">
                  <div className="stat">
                    <span className="label">Coups</span>
                    <span className="value">{score.attempts}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Trouvées</span>
                    <span className="value">{score.totalPersons}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
