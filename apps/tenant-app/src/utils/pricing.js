// Système de pricing (simulé côté client via localStorage)
// 3 formules décrites par le cahier des charges.

export const PLANS = {
  invite: {
    id: 'invite',
    name: 'Invité',
    emoji: '👋',
    price: 0,
    priceLabel: '0€',
    period: 'sans inscription',
    color: 'gray',
    requiresAuth: false,
    gamesPerMonth: 5,
    canSaveDatabases: false,
    maxDatabases: 0,
    tagline: 'Essayez sans créer de compte.',
    features: [
      '5 parties gratuites par mois',
      'Base de données à recréer à chaque partie',
      'Aucune sauvegarde de base'
    ]
  },
  gratuit: {
    id: 'gratuit',
    name: 'Gratuit',
    emoji: '🆓',
    price: 0,
    priceLabel: '0€',
    period: 'avec compte',
    color: 'blue',
    requiresAuth: true,
    gamesPerMonth: 10,
    canSaveDatabases: false,
    maxDatabases: 0,
    tagline: 'Créez un compte gratuit.',
    features: [
      '10 parties par mois',
      'Base de données à recréer à chaque partie',
      'Compte personnel'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    emoji: '⭐',
    price: 5,
    priceLabel: '5€',
    period: 'par mois',
    color: 'purple',
    requiresAuth: true,
    gamesPerMonth: Infinity,
    canSaveDatabases: true,
    maxDatabases: 5,
    tagline: 'Pour les joueurs passionnés.',
    features: [
      'Parties illimitées',
      "Sauvegardez jusqu'à 5 bases de données",
      'Rejouez avec une base en la sélectionnant'
    ]
  }
}

// Ordre d'affichage sur la page Tarifs
export const PLAN_ORDER = ['invite', 'gratuit', 'premium']

export const getPlanConfig = (planId) => PLANS[planId] || PLANS.invite

export const getCurrentMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const USAGE_KEY = 'guess-party-usage'

// Récupère l'usage du mois courant (remis à zéro automatiquement chaque mois)
export const getUsage = () => {
  const month = getCurrentMonth()
  try {
    const raw = JSON.parse(localStorage.getItem(USAGE_KEY))
    if (!raw || raw.month !== month) return { month, count: 0 }
    return raw
  } catch {
    return { month, count: 0 }
  }
}

export const incrementUsage = () => {
  const current = getUsage()
  const next = { month: current.month, count: current.count + 1 }
  localStorage.setItem(USAGE_KEY, JSON.stringify(next))
  return next
}

export const getRemainingGames = (planId) => {
  const cfg = getPlanConfig(planId)
  if (cfg.gamesPerMonth === Infinity) return Infinity
  return Math.max(0, cfg.gamesPerMonth - getUsage().count)
}

export const canPlay = (planId) => getRemainingGames(planId) > 0
