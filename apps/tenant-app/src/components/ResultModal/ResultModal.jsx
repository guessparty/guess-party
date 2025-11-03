import './ResultModal.css'

// Composant modal qui affiche le résultat (victoire ou défaite)
function ResultModal({ isOpen, isWin, person, attempts, score, onClose }) {
  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Empêcher la fermeture si on clique sur le contenu */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* En-tête selon victoire ou défaite */}
        <div className={`modal-header ${isWin ? 'win' : 'lose'}`}>
          <h2>{isWin ? '🎉 Bravo !' : '😔 Perdu...'}</h2>
        </div>

        {/* Photo de la personne dévoilée */}
        <div className="modal-person">
          <img src={person.photo} alt={person.name} />
          <h3>{person.name}</h3>
        </div>

        {/* Détails du résultat */}
        <div className="modal-details">
          {isWin ? (
            <>
              <p className="result-text success">
                Vous avez trouvé en <strong>{attempts} tentative{attempts > 1 ? 's' : ''}</strong> !
              </p>
              <p className="score-text">
                Score : <strong>{score} points</strong>
              </p>
            </>
          ) : (
            <p className="result-text fail">
              C'était <strong>{person.name}</strong>. Revenez demain pour une nouvelle personne !
            </p>
          )}
        </div>

        {/* Informations sur la personne */}
        <div className="person-info">
          <h4>À propos de {person.name}</h4>
          <div className="info-grid">
            {Object.entries(person.characteristics).map(([key, value]) => (
              <div key={key} className="info-item">
                <span className="info-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de fermeture */}
        <button className="close-button" onClick={onClose}>
          Voir mes statistiques
        </button>

        {/* Message de retour */}
        <p className="next-game-text">
          ⏰ Prochaine personne disponible demain !
        </p>
      </div>
    </div>
  )
}

export default ResultModal
