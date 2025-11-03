// Fonctions utilitaires pour le jeu

// Système de points selon le nombre de tentatives
export const POINTS_BY_ATTEMPT = [100, 80, 60, 40, 20, 10]

// Nombre maximum de tentatives
export const MAX_ATTEMPTS = 6

// Calcule le score selon le numéro de la tentative
export const calculateScore = (attemptNumber) => {
  if (attemptNumber < 1 || attemptNumber > POINTS_BY_ATTEMPT.length) {
    return 0
  }
  return POINTS_BY_ATTEMPT[attemptNumber - 1]
}

// Vérifie si la réponse est correcte (ignore les majuscules et espaces)
export const checkGuess = (guess, correctAnswer) => {
  const normalize = (str) => str.toLowerCase().trim()
  return normalize(guess) === normalize(correctAnswer)
}

// Labels en français pour les caractéristiques
export const CHARACTERISTIC_LABELS = {
  age: 'Âge',
  city: 'Ville',
  job: 'Métier',
  hobby: 'Loisir',
  favoriteColor: 'Couleur préférée',
  relationship: 'Relation'
}

// Ordre d'affichage des indices
export const HINT_ORDER = ['age', 'city', 'job', 'hobby', 'favoriteColor', 'relationship']

// Génère les indices à afficher selon le nombre de tentatives
export const getVisibleHints = (person, attemptNumber) => {
  const hints = []
  
  // Pour chaque tentative ratée, on dévoile un indice
  for (let i = 0; i < attemptNumber && i < HINT_ORDER.length; i++) {
    const key = HINT_ORDER[i]
    hints.push({
      label: CHARACTERISTIC_LABELS[key],
      value: person.characteristics[key]
    })
  }
  
  return hints
}

// Formate les statistiques pour l'affichage
export const formatStats = (stats) => {
  return {
    totalGames: stats.totalGames || 0,
    gamesWon: stats.gamesWon || 0,
    winRate: stats.totalGames > 0 
      ? Math.round((stats.gamesWon / stats.totalGames) * 100) 
      : 0,
    currentStreak: stats.currentStreak || 0,
    maxStreak: stats.maxStreak || 0,
    averageAttempts: stats.averageAttempts?.toFixed(1) || '0.0',
    firstTryPercentage: stats.firstTryPercentage || 0
  }
}
