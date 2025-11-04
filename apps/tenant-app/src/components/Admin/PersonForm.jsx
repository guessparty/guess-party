import { useState } from 'react'
import './PersonForm.css'

function PersonForm({ person, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState(person || {
    name: '',
    age: '',
    city: '',
    job: '',
    hobby: '',
    color: '',
    relation: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.age) newErrors.age = 'L\'âge est requis'
    if (!formData.city.trim()) newErrors.city = 'La ville est requise'
    if (!formData.job.trim()) newErrors.job = 'Le métier est requis'
    if (!formData.hobby.trim()) newErrors.hobby = 'Le loisir est requis'
    if (!formData.color.trim()) newErrors.color = 'La couleur est requise'
    if (!formData.relation.trim()) newErrors.relation = 'La relation est requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="person-form">
      <h2>{isEditing ? '✏️ Éditer une Personne' : '➕ Ajouter une Personne'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {[
            { label: 'Nom', name: 'name', placeholder: 'Ex: Julie Petit' },
            { label: 'Âge', name: 'age', placeholder: 'Ex: 25', type: 'number' },
            { label: 'Ville', name: 'city', placeholder: 'Ex: Paris' },
            { label: 'Métier', name: 'job', placeholder: 'Ex: Infirmière' },
            { label: 'Loisir', name: 'hobby', placeholder: 'Ex: Yoga' },
            { label: 'Couleur Préférée', name: 'color', placeholder: 'Ex: Bleu' },
            { label: 'Relation', name: 'relation', placeholder: 'Ex: Amie' }
          ].map(({ label, name, placeholder, type = 'text' }) => (
            <div key={name} className="form-group">
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name] || ''}
                onChange={handleChange}
                className={errors[name] ? 'error' : ''}
              />
              {errors[name] && <span className="error-text">{errors[name]}</span>}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {isEditing ? '💾 Mettre à jour' : '✅ Ajouter'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm
