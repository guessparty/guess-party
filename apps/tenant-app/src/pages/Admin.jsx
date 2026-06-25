import { useState } from 'react'
import Header from '../components/Admin/Header'
import PersonList from '../components/Admin/PersonList'
import PersonForm from '../components/Admin/PersonForm'
import CSVUpload from '../components/Admin/CSVUpload'
import DatabaseManager from '../components/Admin/DatabaseManager'
import { useApp } from '../context/AppContext'
import './Admin.css'

function Admin() {
  const { planConfig } = useApp()
  const [persons, setPersons] = useState(() => {
    const saved = localStorage.getItem('guess-party-persons')
    return saved ? JSON.parse(saved) : []
  })

  const [view, setView] = useState('list') // 'list', 'add', 'edit', 'upload'
  const [editingId, setEditingId] = useState(null)
  const [editingPerson, setEditingPerson] = useState(null)

  // Sauvegarder les personnes
  const savePersons = (newPersons) => {
    setPersons(newPersons)
    localStorage.setItem('guess-party-persons', JSON.stringify(newPersons))
  }

  // Ajouter une personne
  const handleAddPerson = (person) => {
    const newPerson = {
      id: Date.now(),
      ...person
    }
    savePersons([...persons, newPerson])
    setView('list')
  }

  // Éditer une personne
  const handleEditPerson = (id, person) => {
    const updated = persons.map(p => p.id === id ? { ...p, ...person } : p)
    savePersons(updated)
    setView('list')
    setEditingId(null)
  }

  // Supprimer une personne
  const handleDeletePerson = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) {
      savePersons(persons.filter(p => p.id !== id))
    }
  }

  // Upload CSV
  const handleCSVUpload = (newPersons) => {
    savePersons(newPersons)
    setView('list')
  }

  return (
    <div className="admin">
      <Header setView={setView} />

      <div className="admin-container">
        <nav className="admin-nav">
          <button 
            className={`nav-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => { setView('list'); setEditingId(null) }}
          >
            📋 Personnes ({persons.length})
          </button>
          <button 
            className={`nav-btn ${view === 'add' ? 'active' : ''}`}
            onClick={() => { setView('add'); setEditingId(null) }}
          >
            ➕ Ajouter
          </button>
          <button 
            className={`nav-btn ${view === 'upload' ? 'active' : ''}`}
            onClick={() => { setView('upload'); setEditingId(null) }}
          >
            📤 Import CSV
          </button>
          <button 
            className={`nav-btn ${view === 'databases' ? 'active' : ''}`}
            onClick={() => { setView('databases'); setEditingId(null) }}
          >
            💾 Bases {planConfig.canSaveDatabases ? `(${planConfig.maxDatabases})` : '🔒'}
          </button>
        </nav>

        <div className="admin-content">
          {view === 'list' && (
            <PersonList 
              persons={persons}
              onEdit={(person) => {
                setEditingPerson(person)
                setEditingId(person.id)
                setView('edit')
              }}
              onDelete={handleDeletePerson}
            />
          )}

          {view === 'add' && (
            <PersonForm 
              onSubmit={handleAddPerson}
              onCancel={() => setView('list')}
            />
          )}

          {view === 'edit' && editingPerson && (
            <PersonForm 
              person={editingPerson}
              onSubmit={(data) => handleEditPerson(editingId, data)}
              onCancel={() => { setView('list'); setEditingId(null) }}
              isEditing={true}
            />
          )}

          {view === 'upload' && (
            <CSVUpload 
              onUpload={handleCSVUpload}
              onCancel={() => setView('list')}
            />
          )}

          {view === 'databases' && (
            <DatabaseManager
              persons={persons}
              onLoadPersons={(loaded) => setPersons(loaded)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
