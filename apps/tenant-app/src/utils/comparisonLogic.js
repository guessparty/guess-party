// Logique de comparaison des caractéristiques entre deux personnes

// Types de correspondance
export const MATCH_TYPES = {
  EXACT: 'exact',      // Vert - Identique
  PARTIAL: 'partial',  // Orange - Partiellement correct
  WRONG: 'wrong'       // Rouge - Incorrect
}

// Compare deux valeurs et retourne le type de correspondance
export const compareCharacteristic = (guessValue, targetValue, characteristicType) => {
  // Normaliser les valeurs (minuscules, sans espaces superflus)
  const normalize = (str) => str.toLowerCase().trim()
  const guessNorm = normalize(guessValue)
  const targetNorm = normalize(targetValue)

  // 1. Correspondance exacte
  if (guessNorm === targetNorm) {
    return MATCH_TYPES.EXACT
  }

  // 2. Correspondances partielles selon le type de caractéristique
  
  // AGE : Vérifier si les tranches d'âge se chevauchent
  if (characteristicType === 'age') {
    const guessAge = extractNumber(guessValue)
    const targetAge = extractNumber(targetValue)
    
    if (guessAge && targetAge) {
      // Si écart de moins de 5 ans, c'est partiel
      if (Math.abs(guessAge - targetAge) <= 5) {
        return MATCH_TYPES.PARTIAL
      }
    }
  }

  // VILLE : Vérifier si même ville mais quartier différent
  if (characteristicType === 'city') {
    // Ex: "Paris 15e" contient "Paris"
    if (targetNorm.includes(guessNorm) || guessNorm.includes(targetNorm)) {
      return MATCH_TYPES.PARTIAL
    }
  }

  // MÉTIER : Vérifier si même domaine
  if (characteristicType === 'job') {
    const jobDomains = [
      ['développeur', 'developer', 'programmeur', 'ingénieur logiciel'],
      ['médecin', 'docteur', 'chirurgien', 'infirmier'],
      ['professeur', 'enseignant', 'instituteur', 'formateur'],
      ['commercial', 'vendeur', 'représentant'],
      ['designer', 'graphiste', 'illustrateur'],
      ['cuisinier', 'chef', 'pâtissier']
    ]

    for (const domain of jobDomains) {
      const guessInDomain = domain.some(job => guessNorm.includes(job))
      const targetInDomain = domain.some(job => targetNorm.includes(job))
      
      if (guessInDomain && targetInDomain) {
        return MATCH_TYPES.PARTIAL
      }
    }
  }

  // TEXTE GÉNÉRAL : Vérifier si un mot est contenu dans l'autre
  // Ex: "Yeux : vert bleu" vs "Yeux : vert" → Partiel
  const guessWords = guessNorm.split(/\s+/)
  const targetWords = targetNorm.split(/\s+/)

  // Si au moins un mot en commun (et pas un mot trop court)
  const commonWords = guessWords.filter(word => 
    word.length > 2 && targetWords.includes(word)
  )

  if (commonWords.length > 0) {
    return MATCH_TYPES.PARTIAL
  }

  // 3. Aucune correspondance
  return MATCH_TYPES.WRONG
}

// Extrait le premier nombre d'une chaîne (pour l'âge)
const extractNumber = (str) => {
  const match = str.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

// Compare toutes les caractéristiques entre deux personnes
export const comparePersons = (guessPerson, targetPerson) => {
  const results = {}
  
  // Pour chaque caractéristique de la personne cible
  for (const [key, targetValue] of Object.entries(targetPerson.characteristics)) {
    const guessValue = guessPerson.characteristics[key]
    
    results[key] = {
      guessValue,
      targetValue,
      match: compareCharacteristic(guessValue, targetValue, key)
    }
  }

  return results
}

// Vérifie si toutes les caractéristiques sont exactes (victoire)
export const isWin = (comparisonResults) => {
  return Object.values(comparisonResults).every(
    result => result.match === MATCH_TYPES.EXACT
  )
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

// Ordre d'affichage des caractéristiques
export const CHARACTERISTIC_ORDER = [
  'age',
  'city', 
  'job',
  'hobby',
  'favoriteColor',
  'relationship'
]

