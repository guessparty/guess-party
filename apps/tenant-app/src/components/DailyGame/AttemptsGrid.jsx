import AttemptRow from './AttemptRow'
import './AttemptsGrid.css'

// Composant pour afficher toutes les tentatives empilées
function AttemptsGrid({ attempts }) {
  // Si pas de tentatives, afficher un message
  if (attempts.length === 0) {
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
        {attempts.map((attempt, index) => (
          <AttemptRow
            key={index}
            attemptNumber={index + 1}
            personName={attempt.person.name}
            comparisonResults={attempt.comparisonResults}
          />
        ))}
      </div>
    </div>
  )
}

export default AttemptsGrid
