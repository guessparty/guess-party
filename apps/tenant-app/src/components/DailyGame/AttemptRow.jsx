import { CHARACTERISTIC_ORDER, CHARACTERISTIC_LABELS } from '../../utils/comparisonLogic'
import CharacteristicCard from './CharacteristicCard'
import './AttemptRow.css'

// Composant pour afficher une tentative complète (layout verticale dans les cartes)
function AttemptRow({ attemptNumber, personName, comparisonResults = {} }) {
  // Vérifier que comparisonResults existe et a des données
  if (!comparisonResults || Object.keys(comparisonResults).length === 0) {
    return null
  }

  return (
    <div className="attempt-row-horizontal">
      {/* En-tête avec le numéro de tentative et le nom de la personne */}
      <div className="attempt-header-horizontal">
        <div className="attempt-info">
          <span className="attempt-number">#{attemptNumber}</span>
          <span className="attempt-person-name">{personName}</span>
        </div>
      </div>

      {/* Grille des cartes de caractéristiques */}
      <div className="attempt-cards-horizontal">
        {CHARACTERISTIC_ORDER.map((key, index) => {
          const result = comparisonResults[key]
          
          // Vérifier que le résultat existe
          if (!result) {
            return null
          }

          return (
            <CharacteristicCard
              key={key}
              label={CHARACTERISTIC_LABELS[key] || key}
              guessValue={result.guessValue || '?'}
              matchType={result.match || 'unknown'}
              index={index}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AttemptRow
