import './PersonCard.css'

// Composant qui affiche la photo de la personne à deviner
function PersonCard({ person, isRevealed }) {
  return (
    <div className="person-card">
      <div className="person-card-inner">
        {/* Photo avec effet de flou si pas encore deviné */}
        <img 
          src={person.photo} 
          alt={isRevealed ? person.name : 'Personne mystère'}
          className={`person-photo ${!isRevealed ? 'blurred' : ''}`}
        />
        
        {/* Nom affiché seulement si deviné */}
        {isRevealed && (
          <div className="person-name">
            <h2>{person.name}</h2>
          </div>
        )}
        
        {/* Point d'interrogation si pas encore deviné */}
        {!isRevealed && (
          <div className="mystery-overlay">
            <span className="mystery-icon">?</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonCard
