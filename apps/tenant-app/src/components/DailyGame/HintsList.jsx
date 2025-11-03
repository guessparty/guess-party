import './HintsList.css'

// Composant qui affiche la liste des indices dévoilés
function HintsList({ hints }) {
  // Si pas d'indices, ne rien afficher
  if (hints.length === 0) {
    return (
      <div className="hints-empty">
        <p>🔍 Faites une première tentative pour dévoiler des indices !</p>
      </div>
    )
  }

  return (
    <div className="hints-list">
      <h3>Indices dévoilés :</h3>
      <div className="hints-grid">
        {hints.map((hint, index) => (
          <div key={index} className="hint-item">
            <span className="hint-label">{hint.label}</span>
            <span className="hint-value">{hint.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HintsList
