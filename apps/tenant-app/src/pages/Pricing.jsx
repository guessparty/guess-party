import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PLANS, PLAN_ORDER } from '../utils/pricing'
import './Pricing.css'

function Pricing() {
  const navigate = useNavigate()
  const { user, plan, changePlan, logout } = useApp()

  const handleChoose = (planId) => {
    if (planId === 'invite') {
      // Mode invité : pas de compte nécessaire
      if (user) logout()
      navigate('/marathon')
      return
    }

    if (!user) {
      // Inscription/connexion requise
      navigate('/connexion', { state: { intendedPlan: planId } })
      return
    }

    if (planId === 'premium' && plan !== 'premium') {
      const ok = window.confirm(
        'Paiement simulé : confirmer le passage à la formule Premium (5€/mois) ?'
      )
      if (!ok) return
    }

    changePlan(planId)
    navigate('/marathon')
  }

  const getCtaLabel = (planId) => {
    if (plan === planId) return '✓ Formule actuelle'
    if (planId === 'invite') return 'Jouer en invité'
    if (planId === 'gratuit') return user ? 'Choisir Gratuit' : "S'inscrire gratuitement"
    return user ? 'Passer Premium' : 'Devenir Premium'
  }

  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <button className="pricing-back" onClick={() => navigate('/')}>
          ← Accueil
        </button>
        <div className="pricing-account">
          {user ? (
            <span className="pricing-account-info">
              {user.email} · <strong>{PLANS[plan].name}</strong>
            </span>
          ) : (
            <button className="pricing-login-link" onClick={() => navigate('/connexion')}>
              Connexion
            </button>
          )}
        </div>
      </header>

      <section className="pricing-hero">
        <h1>💎 Nos Tarifs</h1>
        <p>Choisissez la formule qui correspond à votre façon de jouer.</p>
      </section>

      <section className="pricing-grid">
        {PLAN_ORDER.map((planId) => {
          const config = PLANS[planId]
          const isCurrent = plan === planId
          const isFeatured = planId === 'premium'
          return (
            <div
              key={planId}
              className={`pricing-card pricing-${config.color} ${isFeatured ? 'featured' : ''} ${
                isCurrent ? 'current' : ''
              }`}
            >
              {isFeatured && <div className="pricing-badge">Le plus complet</div>}
              <div className="pricing-emoji">{config.emoji}</div>
              <h2 className="pricing-name">{config.name}</h2>
              <p className="pricing-tagline">{config.tagline}</p>

              <div className="pricing-price">
                <span className="pricing-amount">{config.priceLabel}</span>
                <span className="pricing-period">/{config.period}</span>
              </div>

              <ul className="pricing-features">
                {config.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>

              <button
                className="pricing-cta"
                disabled={isCurrent}
                onClick={() => handleChoose(planId)}
              >
                {getCtaLabel(planId)}
              </button>
            </div>
          )
        })}
      </section>

      <p className="pricing-footnote">
        Paiement simulé à des fins de démonstration — aucune transaction réelle.
      </p>
    </div>
  )
}

export default Pricing
