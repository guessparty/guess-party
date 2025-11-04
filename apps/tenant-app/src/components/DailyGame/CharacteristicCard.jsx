import { MATCH_TYPES } from '../../utils/comparisonLogic'
import './CharacteristicCard.css'

// Composant pour afficher une caractéristique avec code couleur (version horizontale)
function CharacteristicCard({ label, guessValue, matchType, index }) {
  // Déterminer la classe CSS selon le type de correspondance
  const getMatchClass = () => {
    switch (matchType) {
      case MATCH_TYPES.EXACT:
      case 'exact':
        return 'match-exact'  // Vert
      case MATCH_TYPES.PARTIAL:
      case 'partial':
        return 'match-partial'  // Orange
      case MATCH_TYPES.WRONG:
      case 'wrong':
      case 'different':
        return 'match-wrong'  // Rouge
      default:
        return 'match-wrong'
    }
  }

  // Animation d'apparition échelonnée
  const animationDelay = index * 0.1

  return (
    <div 
      className={`characteristic-card-horizontal ${getMatchClass()}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Label de la caractéristique */}
      <div className="card-label-section">
        <span className="card-label">{label}</span>
      </div>

      {/* Valeur avec le code couleur */}
      <div className="card-value-section">
        <span className="card-value">{guessValue || '?'}</span>
      </div>

      {/* Indicateur de correspondance */}
      <div className="card-indicator">
        {(matchType === MATCH_TYPES.EXACT || matchType === 'exact') && '✓'}
        {(matchType === MATCH_TYPES.PARTIAL || matchType === 'partial') && '~'}
        {(matchType === MATCH_TYPES.WRONG || matchType === 'wrong' || matchType === 'different') && '✗'}
      </div>
    </div>
  )
}

export default CharacteristicCard
