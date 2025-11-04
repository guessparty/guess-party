import './PersonList.css'

function PersonList({ persons, onEdit, onDelete }) {
  if (persons.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 Aucune personne ajoutée</p>
        <p className="empty-text">Commencez par ajouter une personne ou importer un CSV</p>
      </div>
    )
  }

  return (
    <div className="person-list">
      <h2>Gestion des Personnes</h2>
      
      <div className="persons-table">
        <div className="table-header">
          <div className="col col-name">Nom</div>
          <div className="col col-city">Ville</div>
          <div className="col col-job">Métier</div>
          <div className="col col-hobby">Loisir</div>
          <div className="col col-actions">Actions</div>
        </div>

        {persons.map((person) => (
          <div key={person.id} className="table-row">
            <div className="col col-name">{person.name}</div>
            <div className="col col-city">{person.city}</div>
            <div className="col col-job">{person.job}</div>
            <div className="col col-hobby">{person.hobby}</div>
            <div className="col col-actions">
              <button className="btn-edit" onClick={() => onEdit(person)}>
                ✏️ Éditer
              </button>
              <button className="btn-delete" onClick={() => onDelete(person.id)}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="stats">
        Total: <strong>{persons.length}</strong> personne(s)
      </div>
    </div>
  )
}

export default PersonList
