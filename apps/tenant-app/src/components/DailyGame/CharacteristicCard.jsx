import { MATCH_TYPES } from '../../utils/comparisonLogic'
import './CharacteristicCard.css'

// Composant pour afficher une caractéristique avec code couleur
function CharacteristicCard({ label, guessValue, targetValue, matchType, index }) {
  // Déterminer les classe CSS selon le type de correspondance
  const getMatchClass = () => {
    switch (matchType) {
      case MATCH_TYPES.EXACT:
        return 'match-exact'  // Vert
      case MATCH_TYPES.PARTIAL:
        return 'match-partial'  // Orange
      case MATCH_TYPES.WRONG:
        return 'match-wrong'  // Rouge
      default:
        return ''
    }
  }

  // Obtenir le texte descriptif du résultat
  const getMatchText = () => {
    switch (matchType) {
      case MATCH_TYPES.EXACT:
        return '✓ Exact'
      case MATCH_TYPES.PARTIAL:
        return '~ Proche'
      case MATCH_TYPES.WRONG:
        return '✗ Faux'
      default:
        return ''
    }
  }

  // Animation d'apparition échelonnée (chaque carte apparaît après l'autre)
  const animationDelay = index * 0.1

  return (
    <div 
      className={`characteristic-card ${getMatchClass()}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Haut de la carte : Label et statut */}
      <div className="card-header">
        <span className="card-label">{label}</span>
        <span className={`card-match-status match-${matchType}`}>
          {getMatchText()}
        </span>
      </div>

      {/* Milieu de la carte : Valeurs */}
      <div className="card-values">
        <div className="value-section">
          <span className="value-label">Votre choix</span>
          <span className="value-text guess-value">{guessValue}</span>
        </div>
        
        <div className="value-divider">vs</div>
        
        <div className="value-section">
          <span className="value-label">À deviner</span>
          <span className="value-text target-value">{targetValue}</span>
        </div>
      </div>

      {/* Bas de la carte : Message court */}
      <div className="card-footer">
        {matchType === MATCH_TYPES.EXACT && '🎯 C\'est bon !'}
        {matchType === MATCH_TYPES.PARTIAL && '🔔 Proche mais pas exact'}
        {matchType === MATCH_TYPES.WRONG && '❌ Recommence'}
      </div>
    </div>
  )
}

export default CharacteristicCard
