import { useState } from 'react'
import './GuessInput.css'

// Composant pour saisir une réponse
function GuessInput({ onGuess, disabled, attemptsLeft }) {
  // État local pour la valeur du champ (controlled component)
  const [guess, setGuess] = useState('')

  // Fonction appelée quand on soumet le formulaire
  const handleSubmit = (e) => {
    e.preventDefault() // Empêcher le rechargement de la page
    
    // Vérifier que le champ n'est pas vide
    if (guess.trim() === '') {
      alert('Veuillez entrer un nom')
      return
    }
    
    // Appeler la fonction du parent avec la réponse
    onGuess(guess)
    
    // Vider le champ
    setGuess('')
  }

  return (
    <div className="guess-input-container">
      <div className="attempts-counter">
        <span className="attempts-text">
          Tentatives restantes : 
          <strong className={attemptsLeft <= 2 ? 'attempts-warning' : ''}>
            {attemptsLeft}
          </strong>
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="guess-form">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Entrez le nom de la personne..."
          className="guess-input"
          disabled={disabled}
          autoFocus
        />
        <button 
          type="submit" 
          className="guess-button"
          disabled={disabled || guess.trim() === ''}
        >
          Deviner
        </button>
      </form>
    </div>
  )
}

export default GuessInput
