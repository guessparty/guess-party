import { useState, useEffect } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { getDailyPerson, getTodayDate } from '../../data/mockPersons'
import { 
  checkGuess, 
  calculateScore, 
  getVisibleHints,
  MAX_ATTEMPTS 
} from '../../utils/gameHelpers'
import PersonCard from './PersonCard'
import GuessInput from './GuessInput'
import HintsList from './HintsList'
import GameStats from './GameStats'
import ResultModal from '../ResultModal/ResultModal'
import './DailyGame.css'

// Composant principal du mode quotidien
function DailyGame() {
  // États pour le jeu actuel
  const [dailyPerson] = useState(() => getDailyPerson())
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [score, setScore] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [visibleHints, setVisibleHints] = useState([])

  // Sauvegarder les stats dans localStorage
  const [stats, setStats] = useLocalStorage('guess-party-stats', {
    totalGames: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalAttempts: 0,
    firstTryWins: 0,
    lastPlayedDate: null
  })

  // Sauvegarder l'état de la partie du jour
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
      // La partie du jour a déjà été jouée
      setGameOver(true)
      setIsWin(todayGame.won)
      setAttempts(todayGame.attempts)
      setScore(calculateScore(todayGame.attempts))
      setVisibleHints(getVisibleHints(dailyPerson, todayGame.attempts))
    }
  }, [todayGame, dailyPerson])

  // Fonction appelée quand le joueur fait une tentative
  const handleGuess = (guess) => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    // Vérifier si la réponse est correcte
    const correct = checkGuess(guess, dailyPerson.name)

    if (correct) {
      // Victoire !
      const finalScore = calculateScore(newAttempts)
      setScore(finalScore)
      setIsWin(true)
      setGameOver(true)
      setShowModal(true)
      
      // Mettre à jour les statistiques
      updateStats(true, newAttempts)
      
      // Sauvegarder la partie du jour
      saveTodayGame(true, newAttempts)
    } else {
      // Mauvaise réponse, dévoiler un nouvel indice
      setVisibleHints(getVisibleHints(dailyPerson, newAttempts))

      // Vérifier si c'était la dernière tentative
      if (newAttempts >= MAX_ATTEMPTS) {
        // Défaite
        setIsWin(false)
        setGameOver(true)
        setShowModal(true)
        
        // Mettre à jour les statistiques
        updateStats(false, newAttempts)
        
        // Sauvegarder la partie du jour
        saveTodayGame(false, newAttempts)
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
      // Si victoire et joué hier, continuer la série
      // Sinon, recommencer à 1
      newStreak = lastPlayed === yesterdayStr ? stats.currentStreak + 1 : 1
    } else {
      // Si défaite, série cassée
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

    // Calculer les stats dérivées
    newStats.averageAttempts = newStats.totalAttempts / newStats.totalGames
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
      {/* En-tête avec la date */}
      <header className="daily-game-header">
        <h1>🎯 Guess Party - Mode Quotidien</h1>
        <p className="date">{getTodayDate()}</p>
      </header>

      {/* Contenu principal */}
      <div className="daily-game-content">
        {/* Carte de la personne */}
        <PersonCard person={dailyPerson} isRevealed={gameOver} />

        {/* Liste des indices */}
        <HintsList hints={visibleHints} />

        {/* Champ de saisie (désactivé si partie terminée) */}
        {!gameOver && (
          <GuessInput 
            onGuess={handleGuess}
            disabled={gameOver}
            attemptsLeft={MAX_ATTEMPTS - attempts}
          />
        )}

        {/* Message si partie déjà jouée */}
        {gameOver && !showModal && (
          <div className="game-over-message">
            <p>
              {isWin 
                ? `🎉 Vous avez gagné aujourd'hui en ${attempts} tentative${attempts > 1 ? 's' : ''} !`
                : `😔 Vous avez perdu aujourd'hui. C'était ${dailyPerson.name}.`
              }
            </p>
            <p className="next-game">⏰ Revenez demain pour une nouvelle personne !</p>
          </div>
        )}

        {/* Statistiques */}
        <GameStats stats={stats} />
      </div>

      {/* Modal de résultat */}
      <ResultModal
        isOpen={showModal}
        isWin={isWin}
        person={dailyPerson}
        attempts={attempts}
        score={score}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default DailyGame
