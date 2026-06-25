import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import GuessInput from '../DailyGame/GuessInput'
import CharacteristicCard from '../DailyGame/CharacteristicCard'
import { MATCH_TYPES } from '../../utils/comparisonLogic'
import { useApp } from '../../context/AppContext'
import './Marathon.css'

function Marathon() {
  const navigate = useNavigate()
  const { plan, planConfig, canPlay, incrementUsage, clearActivePersons } = useApp()
  const [allPersons, setAllPersons] = useState([])
  const [currentPerson, setCurrentPerson] = useState(null)
  const [guessedPersons, setGuessedPersons] = useState([])
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [allAttempts, setAllAttempts] = useState([])
  const [quotaBlocked, setQuotaBlocked] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    // Garde contre le double-montage de React StrictMode (compte une seule partie)
    if (startedRef.current) return
    startedRef.current = true

    const saved = localStorage.getItem('guess-party-persons')
    const persons = saved ? JSON.parse(saved) : []

    if (persons.length === 0) {
      setLoading(false)
      return
    }

    if (!canPlay) {
      setQuotaBlocked(true)
      setLoading(false)
      return
    }

    incrementUsage()
    setAllPersons(persons)
    selectNewPerson(persons, [])
    setLoading(false)
  }, [])

  // Formules sans sauvegarde : la base est à recréer à chaque partie
  useEffect(() => {
    if (gameOver && !planConfig.canSaveDatabases) {
      clearActivePersons()
    }
  }, [gameOver, planConfig.canSaveDatabases, clearActivePersons])

  const selectNewPerson = (persons, alreadyGuessed) => {
    const remaining = persons.filter(p => !alreadyGuessed.find(g => g.id === p.id))
    
    if (remaining.length === 0) {
      setCurrentPerson(null)
      return null
    }
    
    const randomPerson = remaining[Math.floor(Math.random() * remaining.length)]
    setCurrentPerson(randomPerson)
    return randomPerson
  }

  const compareCharacteristics = (guessed, target) => {
    return {
      age: {
        guessValue: guessed.age,
        match: parseInt(target.age) === parseInt(guessed.age) ? MATCH_TYPES.EXACT : MATCH_TYPES.WRONG
      },
      city: {
        guessValue: guessed.city,
        match: target.city.toLowerCase() === guessed.city.toLowerCase() ? MATCH_TYPES.EXACT : MATCH_TYPES.WRONG
      },
      job: {
        guessValue: guessed.job,
        match: target.job.toLowerCase() === guessed.job.toLowerCase() ? MATCH_TYPES.EXACT : MATCH_TYPES.WRONG
      },
      hobby: {
        guessValue: guessed.hobby,
        match: target.hobby.toLowerCase() === guessed.hobby.toLowerCase() ? MATCH_TYPES.EXACT : MATCH_TYPES.WRONG
      },
      favoriteColor: {
        guessValue: guessed.color,
        match: target.color.toLowerCase() === guessed.color.toLowerCase() ? MATCH_TYPES.EXACT : MATCH_TYPES.WRONG
      },
      relationship: {
        guessValue: guessed.relation,
        match: target.relation.toLowerCase() === guessed.relation.toLowerCase() ? MATCH_TYPES.EXACT : MATCH_TYPES.WRONG
      }
    }
  }

  const handleGuess = (guessedPerson) => {
    if (!currentPerson) return

    setTotalAttempts(totalAttempts + 1)
    const comparison = compareCharacteristics(guessedPerson, currentPerson)
    
    const newAttempt = {
      person: guessedPerson,
      comparison: comparison
    }
    setAllAttempts([...allAttempts, newAttempt])

    if (guessedPerson.id === currentPerson.id) {
      const newGuessed = [...guessedPersons, currentPerson]
      setGuessedPersons(newGuessed)

      if (newGuessed.length === allPersons.length) {
        setGameOver(true)
        setShowNameInput(true)
      } else {
        setTimeout(() => {
          setAllAttempts([])
          selectNewPerson(allPersons, newGuessed)
        }, 1000)
      }
    }
  }

  const submitScore = () => {
    if (!playerName.trim()) {
      alert('Veuillez entrer un pseudo !')
      return
    }

    const scoreData = {
      playerName: playerName.trim(),
      attempts: totalAttempts,
      totalPersons: allPersons.length,
      date: new Date().toISOString(),
      guessedPersons: guessedPersons.map(p => p.name)
    }

    const leaderboardStr = localStorage.getItem('guess-party-marathon-leaderboard')
    const leaderboard = leaderboardStr ? JSON.parse(leaderboardStr) : []

    leaderboard.push(scoreData)
    leaderboard.sort((a, b) => a.attempts - b.attempts)

    localStorage.setItem('guess-party-marathon-leaderboard', JSON.stringify(leaderboard))

    setShowNameInput(false)
  }

  const playAgain = () => {
    if (!canPlay) {
      setQuotaBlocked(true)
      return
    }

    // Recharge la base active : vidée pour les formules sans sauvegarde
    const saved = localStorage.getItem('guess-party-persons')
    const persons = saved ? JSON.parse(saved) : []
    if (persons.length === 0) {
      navigate('/admin')
      return
    }

    incrementUsage()
    setAllPersons(persons)
    setTotalAttempts(0)
    setGuessedPersons([])
    setGameOver(false)
    setPlayerName('')
    setShowNameInput(false)
    setAllAttempts([])
    selectNewPerson(persons, [])
  }

  const progress = ((guessedPersons.length / allPersons.length) * 100).toFixed(0)

  if (loading) {
    return (
      <div className="marathon">
        <div className="loading">
          <p>⏳ Chargement du mode Marathon...</p>
        </div>
      </div>
    )
  }

  if (quotaBlocked) {
    return (
      <div className="marathon">
        <div className="error-state">
          <h2>🚫 Quota de parties atteint</h2>
          <p>
            Vous avez utilisé toutes vos {planConfig.gamesPerMonth} parties de ce mois
            (formule {planConfig.name}).
          </p>
          <button onClick={() => navigate('/tarifs')} className="btn-admin">
            💎 Voir les tarifs
          </button>
          <button onClick={() => navigate('/')} className="btn-back">
            ← Retour
          </button>
        </div>
      </div>
    )
  }

  if (allPersons.length === 0) {
    return (
      <div className="marathon">
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
    <div className="marathon">
      <div className="game-header game-header-marathon">
        <button className="back-btn" onClick={() => navigate('/marathon')}>
          ← Retour
        </button>
        <h1>🏃‍♂️ Mode Marathon</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="game-container">
        <div className="marathon-progress">
          <div className="progress-info">
            <span className="progress-text">
              {guessedPersons.length} / {allPersons.length} trouvées
            </span>
            <span className="attempts-text">
              💪 {totalAttempts} coup{totalAttempts > 1 ? 's' : ''}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {!gameOver && currentPerson && (
          <div className="marathon-main">
            <div className="challenge-section">
              <div className="challenge-card">
                <h2>Trouvez cette personne !</h2>
                <GuessInput 
                  persons={allPersons.filter(p => !guessedPersons.find(g => g.id === p.id))}
                  onGuess={handleGuess}
                  disabled={false}
                  attemptsLeft={999}
                />
              </div>

              {allAttempts.length > 0 && (
                <div className="attempt-feedback">
                  <h3>📊 Historique des tentatives</h3>
                  <div className="attempts-history">
                    {allAttempts.map((attempt, idx) => (
                      <div key={idx} className="attempt-item">
                        <div className="attempt-header">
                          <span className="attempt-number">Tentative #{idx + 1}</span>
                          <span className="attempt-name">{attempt.person.name}</span>
                        </div>
                        <div className="characteristics-grid">
                          <CharacteristicCard
                            label="Âge"
                            guessValue={attempt.comparison.age.guessValue}
                            matchType={attempt.comparison.age.match}
                            index={0}
                          />
                          <CharacteristicCard
                            label="Ville"
                            guessValue={attempt.comparison.city.guessValue}
                            matchType={attempt.comparison.city.match}
                            index={1}
                          />
                          <CharacteristicCard
                            label="Métier"
                            guessValue={attempt.comparison.job.guessValue}
                            matchType={attempt.comparison.job.match}
                            index={2}
                          />
                          <CharacteristicCard
                            label="Loisir"
                            guessValue={attempt.comparison.hobby.guessValue}
                            matchType={attempt.comparison.hobby.match}
                            index={3}
                          />
                          <CharacteristicCard
                            label="Couleur"
                            guessValue={attempt.comparison.favoriteColor.guessValue}
                            matchType={attempt.comparison.favoriteColor.match}
                            index={4}
                          />
                          <CharacteristicCard
                            label="Relation"
                            guessValue={attempt.comparison.relationship.guessValue}
                            matchType={attempt.comparison.relationship.match}
                            index={5}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="guessed-list">
              <h3>✅ Trouvées ({guessedPersons.length})</h3>
              <div className="guessed-items">
                {guessedPersons.map((person, index) => (
                  <div key={person.id} className="guessed-person-card" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="gp-number">#{index + 1}</div>
                    <div className="gp-name">{person.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-over-modal-overlay" onClick={() => navigate('/marathon')}>
            <div className="game-over-modal" onClick={(e) => e.stopPropagation()}>
              <div className="game-over-header">
                <h2>🏆 Marathon Terminé !</h2>
                <p>Bravo, vous avez trouvé toutes les personnes !</p>
              </div>

              <div className="game-over-stats">
                <div className="go-stat">
                  <span className="go-label">Coups</span>
                  <span className="go-value">{totalAttempts}</span>
                </div>
                <div className="go-stat">
                  <span className="go-label">Personnes</span>
                  <span className="go-value">{guessedPersons.length}</span>
                </div>
              </div>

              {showNameInput && (
                <div className="name-input-section">
                  <h3>📝 Enregistrer votre score</h3>
                  <div className="name-input-group">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Votre pseudo..."
                      className="name-input"
                      onKeyPress={(e) => e.key === 'Enter' && submitScore()}
                      autoFocus
                    />
                    <button onClick={submitScore} className="btn-submit-score">
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              <div className="game-over-guessed">
                <h3>Personnes trouvées :</h3>
                <div className="guessed-cards-list">
                  {guessedPersons.map((person, index) => (
                    <div key={person.id} className="person-card-item" style={{animationDelay: `${index * 0.05}s`}}>
                      <span className="pc-number">#{index + 1}</span>
                      <span className="pc-name">{person.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!showNameInput && (
                <div className="game-over-buttons">
                  <button onClick={playAgain} className="btn-play-again">
                    🔄 Rejouer
                  </button>
                  <button onClick={() => navigate('/leaderboard')} className="btn-leaderboard">
                    🏅 Classement
                  </button>
                  <button onClick={() => navigate('/marathon')} className="btn-home">
                  ← Marathon
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marathon
