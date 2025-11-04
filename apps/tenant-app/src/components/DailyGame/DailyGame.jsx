import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GuessInput from './GuessInput'
import AttemptsGrid from './AttemptsGrid'
import GameStats from './GameStats'
import './DailyGame.css'

function DailyGame() {
  const navigate = useNavigate()
  const [allPersons, setAllPersons] = useState([])
  const [todayPerson, setTodayPerson] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('guess-party-persons')
    if (saved) {
      const persons = JSON.parse(saved)
      setAllPersons(persons)

      const today = new Date().toDateString()
      const savedToday = localStorage.getItem('guess-party-today-date')
      const savedPerson = localStorage.getItem('guess-party-today-person')

      if (savedToday === today && savedPerson) {
        setTodayPerson(JSON.parse(savedPerson))
      } else {
        if (persons.length > 0) {
          const randomPerson = persons[Math.floor(Math.random() * persons.length)]
          setTodayPerson(randomPerson)
          localStorage.setItem('guess-party-today-date', today)
          localStorage.setItem('guess-party-today-person', JSON.stringify(randomPerson))
        }
      }

      const savedAttempts = localStorage.getItem('guess-party-today-attempts')
      if (savedAttempts) {
        setAttempts(JSON.parse(savedAttempts))
      }

      setLoading(false)
    } else {
      console.error('Aucune personne trouvée dans localStorage')
      setLoading(false)
    }
  }, [])

  const saveTodayAttempts = (newAttempts) => {
    setAttempts(newAttempts)
    localStorage.setItem('guess-party-today-attempts', JSON.stringify(newAttempts))
  }

  const handleGuess = (guessedPerson) => {
    if (!todayPerson) return

    const comparisonResults = {
      age: {
        guessValue: guessedPerson.age,
        match: parseInt(todayPerson.age) === parseInt(guessedPerson.age) ? 'exact' : 'different'
      },
      city: {
        guessValue: guessedPerson.city,
        match: todayPerson.city.toLowerCase() === guessedPerson.city.toLowerCase() ? 'exact' : 'different'
      },
      job: {
        guessValue: guessedPerson.job,
        match: todayPerson.job.toLowerCase() === guessedPerson.job.toLowerCase() ? 'exact' : 'different'
      },
      hobby: {
        guessValue: guessedPerson.hobby,
        match: todayPerson.hobby.toLowerCase() === guessedPerson.hobby.toLowerCase() ? 'exact' : 'different'
      },
      favoriteColor: {
        guessValue: guessedPerson.color,
        match: todayPerson.color.toLowerCase() === guessedPerson.color.toLowerCase() ? 'exact' : 'different'
      },
      relationship: {
        guessValue: guessedPerson.relation,
        match: todayPerson.relation.toLowerCase() === guessedPerson.relation.toLowerCase() ? 'exact' : 'different'
      }
    }

    const attempt = {
      id: guessedPerson.id,
      name: guessedPerson.name,
      comparisonResults: comparisonResults
    }

    const newAttempts = [...attempts, attempt]
    saveTodayAttempts(newAttempts)

    const isExactMatch = guessedPerson.id === todayPerson.id
    if (isExactMatch) {
      setWon(true)
      updateStats(true, newAttempts.length)
      setShowResult(true)
    } else if (newAttempts.length >= 6) {
      setLost(true)
      updateStats(false, newAttempts.length)
      setShowResult(true)
    }
  }

  const updateStats = (isWin, totalAttempts) => {
    const statsStr = localStorage.getItem('guess-party-stats')
    const stats = statsStr ? JSON.parse(statsStr) : {
      totalGames: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      totalAttempts: 0,
      firstTryWins: 0,
      lastPlayedDate: null,
      averageAttempts: 0,
      firstTryPercentage: 0
    }

    const today = new Date().toDateString()
    const lastPlayed = stats.lastPlayedDate === today

    if (!lastPlayed) {
      stats.totalGames += 1

      if (isWin) {
        stats.gamesWon += 1
        stats.currentStreak += 1
        stats.totalAttempts += totalAttempts

        if (totalAttempts === 1) {
          stats.firstTryWins += 1
        }

        if (stats.currentStreak > stats.maxStreak) {
          stats.maxStreak = stats.currentStreak
        }
      } else {
        stats.currentStreak = 0
      }

      stats.lastPlayedDate = today
      stats.averageAttempts = stats.gamesWon > 0 ? (stats.totalAttempts / stats.gamesWon).toFixed(1) : 0
      stats.firstTryPercentage = stats.gamesWon > 0 ? ((stats.firstTryWins / stats.gamesWon) * 100).toFixed(0) : 0

      localStorage.setItem('guess-party-stats', JSON.stringify(stats))
    }
  }

  if (loading) {
    return (
      <div className="daily-game">
        <div className="loading">
          <p>⏳ Chargement du défi quotidien...</p>
        </div>
      </div>
    )
  }

  if (!todayPerson || allPersons.length === 0) {
    return (
      <div className="daily-game">
        <div className="error-state">
          <h2>📭 Aucune personne disponible</h2>
          <p>Veuillez d'abord ajouter des personnes via le panneau admin.</p>
          <button onClick={() => navigate('/admin')} className="btn-admin">
            ⚙️ Aller à l'Admin
          </button>
          <button onClick={() => navigate('/')} className="btn-back">
            ← Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="daily-game">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Retour
        </button>
        <h1>📅 Mode Quotidien</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="game-container">
        <div className="game-main">
          <GuessInput 
            persons={allPersons}
            onGuess={handleGuess}
            disabled={won || lost || attempts.length >= 6}
            attemptsLeft={6 - attempts.length}
          />

          <AttemptsGrid attempts={attempts} />

          {showResult && (
            <div className="result-modal-overlay" onClick={() => navigate('/')}>
              <div className="result-modal" onClick={(e) => e.stopPropagation()}>
                <div className="result-header">
                  {won ? (
                    <>
                      <h2>🎉 Victoire !</h2>
                      <p>Vous avez trouvé {todayPerson.name} en {attempts.length} tentative{attempts.length > 1 ? 's' : ''}</p>
                    </>
                  ) : (
                    <>
                      <h2>😔 Défaite</h2>
                      <p>La personne à trouver était {todayPerson.name}</p>
                    </>
                  )}
                </div>
                <div className="result-person">
                      <h3>{todayPerson.name}</h3>
                      <div className="person-info-grid">
                        <div className="person-detail">
                          <span className="detail-icon">📍</span>
                          <span className="detail-label">Ville</span>
                          <span className="detail-value">{todayPerson.city}</span>
                        </div>
                        <div className="person-detail">
                          <span className="detail-icon">💼</span>
                          <span className="detail-label">Métier</span>
                          <span className="detail-value">{todayPerson.job}</span>
                        </div>
                        <div className="person-detail">
                          <span className="detail-icon">🎯</span>
                          <span className="detail-label">Loisir</span>
                          <span className="detail-value">{todayPerson.hobby}</span>
                        </div>
                        <div className="person-detail">
                          <span className="detail-icon">🎨</span>
                          <span className="detail-label">Couleur</span>
                          <span className="detail-value">{todayPerson.color}</span>
                        </div>
                        <div className="person-detail">
                          <span className="detail-icon">🎂</span>
                          <span className="detail-label">Âge</span>
                          <span className="detail-value">{todayPerson.age}</span>
                        </div>
                        <div className="person-detail">
                          <span className="detail-icon">👥</span>
                          <span className="detail-label">Relation</span>
                          <span className="detail-value">{todayPerson.relation}</span>
                        </div>
                      </div>
                    </div>
                <button onClick={() => navigate('/')} className="result-btn">
                  ← Retour
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="game-sidebar">
          <GameStats />
        </aside>
      </div>
    </div>
  )
}

export default DailyGame
