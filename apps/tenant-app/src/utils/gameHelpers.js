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
export const getVisibleHints = (person, attemptNumber, characteristics) => {
  const hints = []
  const availableChars = characteristics || Object.keys(person.characteristics)
  
  for (let i = 0; i < attemptNumber && i < availableChars.length; i++) {
    const charKey = availableChars[i]
    hints.push({
      label: CHARACTERISTIC_LABELS[charKey],
      value: person.characteristics[charKey]
    })
  }
  
  return hints
}

// Calcule le flou progressif pour le mode blur
export const calculateBlurAmount = (attemptNumber, maxAttempts) => {
  const blurStart = 20 // Flou maximum au début
  const blurEnd = 0 // Pas de flou à la fin
  const progress = attemptNumber / maxAttempts
  return blurStart - (blurStart - blurEnd) * progress
}

// Sélectionne une personne aléatoire
export const selectRandomPerson = (persons, excludeIds = []) => {
  const available = persons.filter(p => !excludeIds.includes(p.id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

// Sélectionne une personne pour le mode Pokédex (probabilité réduite si déjà capturée)
export const selectPokedexPerson = (persons, captureCount = {}) => {
  // Créer un tableau pondéré
  const weighted = []
  persons.forEach(person => {
    const captures = captureCount[person.id] || 0
    const weight = Math.max(1, 10 - captures * 2) // Poids diminue avec captures
    for (let i = 0; i < weight; i++) {
      weighted.push(person)
    }
  })
  
  return weighted[Math.floor(Math.random() * weighted.length)]
}

// Formate les statistiques pour l'affichage
export const formatStats = (stats) => {
  // Vérifier que stats existe
  if (!stats) {
    return {
      totalGames: 0,
      gamesWon: 0,
      winRate: 0,
      currentStreak: 0,
      maxStreak: 0,
      averageAttempts: '0.0',
      firstTryPercentage: 0
    }
  }

  // Calculer la moyenne si elle n'existe pas
  let avgAttempts = '0.0'
  if (stats.totalGames > 0) {
    if (stats.averageAttempts) {
      // Si c'est déjà un nombre, utiliser toFixed
      avgAttempts = typeof stats.averageAttempts === 'number' 
        ? stats.averageAttempts.toFixed(1)
        : stats.averageAttempts
    } else if (stats.totalAttempts) {
      // Sinon calculer à partir du total
      avgAttempts = (stats.totalAttempts / stats.totalGames).toFixed(1)
    }
  }

  return {
    totalGames: stats.totalGames || 0,
    gamesWon: stats.gamesWon || 0,
    winRate: stats.totalGames > 0 
      ? Math.round((stats.gamesWon / stats.totalGames) * 100) 
      : 0,
    currentStreak: stats.currentStreak || 0,
    maxStreak: stats.maxStreak || 0,
    averageAttempts: avgAttempts,
    firstTryPercentage: stats.firstTryPercentage || 0
  }
}
