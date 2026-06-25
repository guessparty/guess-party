import { createContext, useContext, useState, useCallback } from 'react'
import {
  getPlanConfig,
  getUsage,
  incrementUsage as incrementUsageStorage,
  getRemainingGames
} from '../utils/pricing'

const AppContext = createContext(null)

const USER_KEY = 'guess-party-user'
const ACCOUNTS_KEY = 'guess-party-accounts'
const DB_KEY = 'guess-party-databases'
const SELECTED_DB_KEY = 'guess-party-selected-db'
const PERSONS_KEY = 'guess-party-persons'

const readJSON = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(USER_KEY, null))
  const [usage, setUsage] = useState(() => getUsage())
  const [databases, setDatabases] = useState(() => readJSON(DB_KEY, []))
  const [selectedDbId, setSelectedDbId] = useState(() => readJSON(SELECTED_DB_KEY, null))

  const plan = user ? user.plan : 'invite'
  const planConfig = getPlanConfig(plan)
  const remainingGames = getRemainingGames(plan)
  const canPlay = remainingGames > 0

  const persistUser = useCallback((nextUser) => {
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
    setUser(nextUser)
  }, [])

  // --- Authentification (simulée) ---
  const register = useCallback((email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) throw new Error('Email et mot de passe requis.')
    const accounts = readJSON(ACCOUNTS_KEY, {})
    if (accounts[cleanEmail]) throw new Error('Un compte existe déjà avec cet email.')
    accounts[cleanEmail] = { password, plan: 'gratuit' }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
    persistUser({ email: cleanEmail, plan: 'gratuit' })
  }, [persistUser])

  const login = useCallback((email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const accounts = readJSON(ACCOUNTS_KEY, {})
    const account = accounts[cleanEmail]
    if (!account || account.password !== password) {
      throw new Error('Email ou mot de passe incorrect.')
    }
    persistUser({ email: cleanEmail, plan: account.plan })
  }, [persistUser])

  const logout = useCallback(() => persistUser(null), [persistUser])

  // Changement de formule (paiement simulé pour Premium)
  // Lit l'utilisateur depuis localStorage (source de vérité) pour fonctionner
  // même juste après un register/login dont l'état React n'est pas encore propagé.
  const changePlan = useCallback((planId) => {
    const currentUser = readJSON(USER_KEY, null)
    if (!currentUser) throw new Error('Connectez-vous pour choisir cette formule.')
    const accounts = readJSON(ACCOUNTS_KEY, {})
    if (accounts[currentUser.email]) {
      accounts[currentUser.email].plan = planId
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
    }
    persistUser({ ...currentUser, plan: planId })
  }, [persistUser])

  // --- Quota de parties ---
  const refreshUsage = useCallback(() => setUsage(getUsage()), [])
  const incrementUsage = useCallback(() => setUsage(incrementUsageStorage()), [])

  // --- Bases de données (Premium) ---
  const persistDatabases = useCallback((next) => {
    localStorage.setItem(DB_KEY, JSON.stringify(next))
    setDatabases(next)
  }, [])

  const persistSelected = useCallback((id) => {
    localStorage.setItem(SELECTED_DB_KEY, JSON.stringify(id))
    setSelectedDbId(id)
  }, [])

  const saveDatabase = useCallback((name, persons) => {
    if (!planConfig.canSaveDatabases) {
      throw new Error('Votre formule ne permet pas de sauvegarder de base.')
    }
    if (!persons || persons.length === 0) {
      throw new Error("Ajoutez d'abord des personnes à la base active.")
    }
    if (databases.length >= planConfig.maxDatabases) {
      throw new Error(`Limite de ${planConfig.maxDatabases} bases atteinte.`)
    }
    const db = {
      id: Date.now(),
      name: (name || '').trim() || `Base ${databases.length + 1}`,
      persons,
      createdAt: new Date().toISOString()
    }
    persistDatabases([...databases, db])
    persistSelected(db.id)
    return db
  }, [planConfig, databases, persistDatabases, persistSelected])

  // Charge une base dans la base active et la renvoie
  const selectDatabase = useCallback((id) => {
    const db = databases.find((d) => d.id === id)
    if (!db) return null
    localStorage.setItem(PERSONS_KEY, JSON.stringify(db.persons))
    persistSelected(id)
    return db.persons
  }, [databases, persistSelected])

  const deleteDatabase = useCallback((id) => {
    persistDatabases(databases.filter((d) => d.id !== id))
    if (selectedDbId === id) persistSelected(null)
  }, [databases, selectedDbId, persistDatabases, persistSelected])

  // Vide la base active (formules sans sauvegarde : à recréer à chaque partie)
  const clearActivePersons = useCallback(() => {
    localStorage.removeItem(PERSONS_KEY)
  }, [])

  const value = {
    user,
    plan,
    planConfig,
    usage,
    remainingGames,
    canPlay,
    register,
    login,
    logout,
    changePlan,
    refreshUsage,
    incrementUsage,
    databases,
    selectedDbId,
    saveDatabase,
    selectDatabase,
    deleteDatabase,
    clearActivePersons
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp doit être utilisé dans un AppProvider')
  return ctx
}
