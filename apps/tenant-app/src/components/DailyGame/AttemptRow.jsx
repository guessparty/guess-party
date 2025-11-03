import { CHARACTERISTIC_ORDER, CHARACTERISTIC_LABELS } from '../../utils/comparisonLogic'
import CharacteristicCard from './CharacteristicCard'
import './AttemptRow.css'

// Composant pour afficher une tentative complète (toutes les caractéristiques)
function AttemptRow({ attemptNumber, personName, comparisonResults }) {
  return (
    <div className="attempt-row">
      {/* En-tête avec le numéro de tentative et le nom de la personne */}
      <div className="attempt-header">
        <span className="attempt-number">Tentative #{attemptNumber}</span>
        <span className="attempt-person-name">{personName}</span>
      </div>

      {/* Grille des cartes de caractéristiques */}
      <div className="attempt-cards">
        {CHARACTERISTIC_ORDER.map((key, index) => {
          const result = comparisonResults[key]
          
          return (
            <CharacteristicCard
              key={key}
              label={CHARACTERISTIC_LABELS[key]}
              guessValue={result.guessValue}
              targetValue={result.targetValue}
              matchType={result.match}
              index={index}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AttemptRow
