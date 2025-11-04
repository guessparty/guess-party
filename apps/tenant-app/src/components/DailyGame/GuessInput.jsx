import { useState, useEffect } from 'react'
import './GuessInput.css'

// Composant pour saisir une réponse avec autocomplétion
function GuessInput({ persons = [], onGuess, disabled, attemptsLeft = 6, attempts = [] }) {
  const [guess, setGuess] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Mettre à jour les suggestions quand on tape
  useEffect(() => {
    if (guess.trim() === '') {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
      return
    }

    const searchTerm = guess.toLowerCase()
    
    // ✅ Obtenir les IDs des personnes déjà devinées
    const guessedIds = attempts.map(attempt => attempt.id)
    
    // Filtrer par première lettre ET exclure les doublons
    const filtered = persons.filter(person => 
      person.name.toLowerCase().startsWith(searchTerm) &&
      !guessedIds.includes(person.id) // ✅ Bloquer les doublons
    )

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
    setSelectedIndex(-1)
  }, [guess, persons, attempts])

  // Fonction appelée quand on soumet le formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    if (guess.trim() === '') {
      alert('Veuillez entrer un nom')
      return
    }

    // Chercher la personne exacte
    const foundPerson = persons.find(p => 
      p.name.toLowerCase() === guess.toLowerCase()
    )

    if (!foundPerson) {
      alert('Personne non trouvée. Utilisez l\'autocomplétion !')
      return
    }

    // ✅ Vérifier si la personne a déjà été devinée
    const alreadyGuessed = attempts.some(attempt => attempt.id === foundPerson.id)
    if (alreadyGuessed) {
      alert('❌ Vous avez déjà deviné cette personne !')
      setGuess('')
      return
    }

    // Appeler la fonction du parent avec la personne trouvée
    onGuess(foundPerson)

    // Vider le champ
    setGuess('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSelectSuggestion = (person) => {
    // ✅ Double check : vérifier si la personne a déjà été devinée
    const alreadyGuessed = attempts.some(attempt => attempt.id === person.id)
    if (alreadyGuessed) {
      alert('❌ Vous avez déjà deviné cette personne !')
      setGuess('')
      return
    }

    setGuess(person.name)
    setSuggestions([])
    setShowSuggestions(false)
    // Appeler directement onGuess
    onGuess(person)
    setGuess('')
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          handleSelectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setSuggestions([])
        setShowSuggestions(false)
        break
      default:
        break
    }
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
        <div className="input-wrapper">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => guess && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Entrez le nom de la personne..."
            className="guess-input"
            disabled={disabled}
            autoFocus
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((person, index) => (
                <li
                  key={person.id}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectSuggestion(person)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="suggestion-name">{person.name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

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
