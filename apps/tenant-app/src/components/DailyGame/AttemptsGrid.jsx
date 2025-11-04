import AttemptRow from './AttemptRow'
import './AttemptsGrid.css'

// Composant pour afficher toutes les tentatives empilées
function AttemptsGrid({ attempts }) {
  // Si pas de tentatives, afficher un message
  if (!attempts || attempts.length === 0) {
    return (
      <div className="attempts-grid-empty">
        <div className="empty-state">
          <p className="empty-icon">🎯</p>
          <p className="empty-text">Aucune tentative encore</p>
          <p className="empty-subtext">Sélectionnez une personne pour commencer !</p>
        </div>
      </div>
    )
  }

  return (
    <div className="attempts-grid">
      <div className="attempts-header">
        <h2>📋 Vos Tentatives ({attempts.length})</h2>
      </div>
      
      <div className="attempts-list">
        {/* Inverser l'ordre pour afficher la dernière tentative en premier */}
        {attempts.slice().reverse().map((attempt, index) => {
          // Calculer le vrai numéro (la dernière tentative = le plus grand numéro)
          const attemptNumber = attempts.length - index
          
          // Vérifier que les données existent avant de les afficher
          if (!attempt || !attempt.name) {
            return null
          }

          return (
            <AttemptRow
              key={`attempt-${attemptNumber}`}
              attemptNumber={attemptNumber}
              personName={attempt.name}
              comparisonResults={attempt.comparisonResults || {}}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AttemptsGrid
