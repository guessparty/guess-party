import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PLANS } from '../utils/pricing'
import './Auth.css'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const intendedPlan = location.state?.intendedPlan || null
  const { user, plan, login, register, logout, changePlan } = useApp()

  const [mode, setMode] = useState('register') // 'register' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        register(email, password)
      } else {
        login(email, password)
      }

      if (intendedPlan === 'premium') {
        const ok = window.confirm(
          'Paiement simulé : confirmer le passage à la formule Premium (5€/mois) ?'
        )
        if (ok) {
          changePlan('premium')
          navigate('/marathon')
          return
        }
      }
      navigate('/marathon')
    } catch (err) {
      setError(err.message)
    }
  }

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Mon compte</h1>
          <p className="auth-connected">
            Connecté en tant que <strong>{user.email}</strong>
          </p>
          <div className="auth-plan-badge">Formule : {PLANS[plan].name}</div>

          <div className="auth-actions">
            <button className="auth-submit" onClick={() => navigate('/tarifs')}>
              Voir les tarifs
            </button>
            <button className="auth-submit secondary" onClick={() => navigate('/marathon')}>
              Jouer au Marathon
            </button>
            <button
              className="auth-link"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate('/')}>
          ← Accueil
        </button>
        <h1>{mode === 'register' ? '✍️ Inscription' : '🔑 Connexion'}</h1>
        {intendedPlan && (
          <p className="auth-intent">
            Formule sélectionnée : <strong>{PLANS[intendedPlan].name}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
            />
          </div>
          <div className="auth-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit">
            {mode === 'register' ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        <button
          className="auth-link"
          onClick={() => {
            setError('')
            setMode(mode === 'register' ? 'login' : 'register')
          }}
        >
          {mode === 'register'
            ? 'Déjà un compte ? Se connecter'
            : "Pas de compte ? S'inscrire"}
        </button>

        <p className="auth-note">
          Authentification simulée (stockée localement) — à des fins de démonstration.
        </p>
      </div>
    </div>
  )
}

export default Auth
