import { useState, useRef, useEffect } from 'react'
import './AutocompleteInput.css'

// Composant champ de saisie avec autocomplétion
function AutocompleteInput({ persons, onSelect, disabled }) {
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredPersons, setFilteredPersons] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Filtrer les personnes selon la saisie
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredPersons([])
      setShowDropdown(false)
      return
    }

    const filtered = persons.filter(person =>
      person.name.toLowerCase().startsWith(inputValue.toLowerCase())
    )

    setFilteredPersons(filtered)
    setShowDropdown(filtered.length > 0)
    setSelectedIndex(-1)
  }, [inputValue, persons])

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gérer la sélection d'une personne
  const handleSelectPerson = (person) => {
    setInputValue('')
    setShowDropdown(false)
    onSelect(person)
    inputRef.current.focus()
  }

  // Gérer les touches clavier (flèches et Entrée)
  const handleKeyDown = (e) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < filteredPersons.length - 1 ? prev + 1 : prev
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectPerson(filteredPersons[selectedIndex])
        } else if (filteredPersons.length === 1) {
          handleSelectPerson(filteredPersons[0])
        }
        break
      
      case 'Escape':
        setShowDropdown(false)
        break
      
      default:
        break
    }
  }

  return (
    <div className="autocomplete-container">
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tapez le nom d'une personne..."
          className="autocomplete-input"
          disabled={disabled}
          autoFocus
        />
        
        {showDropdown && (
          <div ref={dropdownRef} className="autocomplete-dropdown">
            {filteredPersons.map((person, index) => (
              <div
                key={person.id}
                className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelectPerson(person)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="person-name">{person.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="autocomplete-hint">
        💡 Commencez à taper pour voir les suggestions
      </div>
    </div>
  )
}

export default AutocompleteInput
