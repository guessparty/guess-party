import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import './DatabaseManager.css'

function DatabaseManager({ persons, onLoadPersons }) {
  const navigate = useNavigate()
  const {
    planConfig,
    databases,
    selectedDbId,
    saveDatabase,
    selectDatabase,
    deleteDatabase
  } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  // Formules sans sauvegarde (Invité / Gratuit)
  if (!planConfig.canSaveDatabases) {
    return (
      <div className="db-manager">
        <div className="db-locked">
          <h2>🔒 Sauvegarde des bases réservée au Premium</h2>
          <p>
            Avec la formule <strong>{planConfig.name}</strong>, vous devez recréer la
            base de personnes à chaque partie. Passez à la formule{' '}
            <strong>Premium</strong> pour enregistrer jusqu'à 5 bases et les rejouer
            quand vous le souhaitez.
          </p>
          <button className="db-upgrade-btn" onClick={() => navigate('/tarifs')}>
            💎 Découvrir Premium
          </button>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    setError('')
    try {
      saveDatabase(name, persons)
      setName('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSelect = (id) => {
    const loaded = selectDatabase(id)
    if (loaded) onLoadPersons(loaded)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette base de données ?')) {
      deleteDatabase(id)
    }
  }

  return (
    <div className="db-manager">
      <h2>💾 Mes bases de données</h2>
      <p className="db-subtitle">
        {databases.length} / {planConfig.maxDatabases} bases enregistrées · Premium
      </p>

      <div className="db-save-box">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Nom de la base (ex: Famille, Collègues...)`}
          className="db-input"
        />
        <button
          className="db-save-btn"
          onClick={handleSave}
          disabled={databases.length >= planConfig.maxDatabases}
        >
          ➕ Sauvegarder la base actuelle ({persons.length})
        </button>
      </div>
      {error && <div className="db-error">{error}</div>}

      {databases.length === 0 ? (
        <p className="db-empty">
          Aucune base sauvegardée pour l'instant. Ajoutez des personnes puis
          enregistrez-les ici.
        </p>
      ) : (
        <ul className="db-list">
          {databases.map((db) => (
            <li
              key={db.id}
              className={`db-item ${selectedDbId === db.id ? 'selected' : ''}`}
            >
              <div className="db-item-info">
                <span className="db-item-name">{db.name}</span>
                <span className="db-item-count">{db.persons.length} personnes</span>
              </div>
              <div className="db-item-actions">
                {selectedDbId === db.id ? (
                  <span className="db-badge">✓ Sélectionnée</span>
                ) : (
                  <button className="db-select-btn" onClick={() => handleSelect(db.id)}>
                    Sélectionner
                  </button>
                )}
                <button className="db-delete-btn" onClick={() => handleDelete(db.id)}>
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DatabaseManager
