import { useState } from 'react'

// Hook personnalisé pour sauvegarder des données dans le navigateur
// C'est comme useState mais les données restent même si on ferme l'onglet
function useLocalStorage(key, initialValue) {
  // key = nom de la donnée (ex: "game-stats")
  // initialValue = valeur par défaut si rien n'existe
  
  // useState avec une fonction pour récupérer la valeur sauvegardée
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Essayer de récupérer la valeur dans localStorage
      const item = window.localStorage.getItem(key)
      
      // Si elle existe, la parser (transformer le texte en objet JavaScript)
      // Sinon, utiliser la valeur par défaut
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Si erreur, afficher dans la console et utiliser la valeur par défaut
      console.error('Erreur localStorage:', error)
      return initialValue
    }
  })

  // Fonction pour modifier la valeur (comme setCount dans useState)
  const setValue = (value) => {
    try {
      // Permettre que value soit une fonction (comme avec useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Sauvegarder dans l'état React
      setStoredValue(valueToStore)
      
      // Sauvegarder dans localStorage (transformer l'objet en texte)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Erreur localStorage:', error)
    }
  }

  // Retourner la valeur et la fonction de modification (comme useState)
  return [storedValue, setValue]
}

export default useLocalStorage
