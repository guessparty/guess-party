import { useState, useEffect } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { getDailyPerson, getTodayDate, mockPersons } from '../../data/mockPersons'
import { 
  comparePersons,
  isWin,
  MATCH_TYPES
} from '../../utils/comparisonLogic'
import AutocompleteInput from './AutocompleteInput'
import AttemptsGrid from './AttemptsGrid'
import GameStats from './GameStats'
import ResultModal from '../ResultModal/ResultModal'
import './DailyGame.css'

function DailyGame() {
  // État du jeu
  const [dailyPerson] = useState(() => getDailyPerson())
  const [attempts, setAttempts] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [score, setScore] = useState(0)

  // Statistiques sauvegardées
  const [stats, setStats] = useLocalStorage('guess-party-stats', {
    totalGames: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalAttempts: 0,
    firstTryWins: 0,
    lastPlayedDate: null
  })

  // État de la partie du jour
  const [todayGame, setTodayGame] = useLocalStorage('guess-party-today', {
    date: null,
    played: false,
    won: false,
    attempts: 0
  })

  // Vérifier si la partie d'aujourd'hui a déjà été jouée
  useEffect(() => {
    const today = new Date().toDateString()
    
    if (todayGame.date === today && todayGame.played) {
      // Partie déjà jouée aujourd'hui
      setGameOver(true)
      setIsGameWon(todayGame.won)
    }
  }, [todayGame])

  // Calculer le score selon le nombre de tentatives
  const calculateScore = (numAttempts) => {
    const scores = [100, 80, 60, 40, 20, 10]
    return scores[numAttempts - 1] || 0
  }

  // Quand on sélectionne une personne
  const handleSelectPerson = (selectedPerson) => {
    if (gameOver) return

    // Comparer les caractéristiques
    const comparisonResults = comparePersons(selectedPerson, dailyPerson)

    // Créer une nouvelle tentative
    const newAttempt = {
      person: selectedPerson,
      comparisonResults
    }

    // Ajouter à la liste des tentatives
    const newAttempts = [...attempts, newAttempt]
    setAttempts(newAttempts)

    // Vérifier si c'est une victoire
    if (isWin(comparisonResults)) {
      const finalScore = calculateScore(newAttempts.length)
      setScore(finalScore)
      setIsGameWon(true)
      setGameOver(true)
      setShowModal(true)

      // Mettre à jour les stats
      updateStats(true, newAttempts.length)

      // Sauvegarder la partie du jour
      saveTodayGame(true, newAttempts.length)
    } else {
      // Vérifier si c'était la dernière tentative
      if (newAttempts.length >= 6) {
        setIsGameWon(false)
        setGameOver(true)
        setShowModal(true)

        // Mettre à jour les stats
        updateStats(false, newAttempts.length)

        // Sauvegarder la partie du jour
        saveTodayGame(false, newAttempts.length)
      }
    }
  }

  // Mettre à jour les statistiques
  const updateStats = (won, finalAttempts) => {
    const today = new Date().toDateString()
    const lastPlayed = stats.lastPlayedDate
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    // Calculer la nouvelle série
    let newStreak = stats.currentStreak
    if (won) {
      newStreak = lastPlayed === yesterdayStr ? stats.currentStreak + 1 : 1
    } else {
      newStreak = 0
    }

    const newStats = {
      totalGames: stats.totalGames + 1,
      gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
      currentStreak: newStreak,
      maxStreak: Math.max(stats.maxStreak, newStreak),
      totalAttempts: stats.totalAttempts + finalAttempts,
      firstTryWins: finalAttempts === 1 && won ? stats.firstTryWins + 1 : stats.firstTryWins,
      lastPlayedDate: today
    }

    newStats.averageAttempts = (newStats.totalAttempts / newStats.totalGames).toFixed(1)
    newStats.firstTryPercentage = Math.round((newStats.firstTryWins / newStats.totalGames) * 100)

    setStats(newStats)
  }

  // Sauvegarder l'état de la partie du jour
  const saveTodayGame = (won, finalAttempts) => {
    const today = new Date().toDateString()
    setTodayGame({
      date: today,
      played: true,
      won,
      attempts: finalAttempts
    })
  }

  return (
    <div className="daily-game">
      {/* En-tête */}
      <header className="daily-game-header">
        <h1>🎯 Guess Party - Mode Quotidien</h1>
        <p className="date">{getTodayDate()}</p>
      </header>

      {/* Contenu principal */}
      <div className="daily-game-content">
        {/* Champ de saisie avec autocomplétion */}
        {!gameOver && (
          <AutocompleteInput
            persons={mockPersons}
            onSelect={handleSelectPerson}
            disabled={gameOver}
          />
        )}

        {/* Message si partie déjà jouée */}
        {gameOver && (
          <div className="game-over-banner">
            <p className="game-over-text">
              {isGameWon
                ? `🎉 Partie gagnée en ${attempts.length} tentative${attempts.length > 1 ? 's' : ''} !`
                : `😔 Partie perdue. C'était ${dailyPerson.name}.`
              }
            </p>
            <p className="next-game-text">⏰ Revenez demain pour une nouvelle personne !</p>
          </div>
        )}

        {/* Grille des tentatives */}
        <AttemptsGrid attempts={attempts} />

        {/* Statistiques */}
        <GameStats stats={stats} />
      </div>

      {/* Modal de résultat */}
      <ResultModal
        isOpen={showModal}
        isWin={isGameWon}
        person={dailyPerson}
        attempts={attempts.length}
        score={score}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default DailyGame
