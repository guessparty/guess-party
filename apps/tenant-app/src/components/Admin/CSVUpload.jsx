import { useState } from 'react'
import './CSVUpload.css'

function CSVUpload({ onUpload, onCancel }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState([])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError('')
    setPreview([])

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const csv = event.target.result
          const lines = csv.split('\n').filter(line => line.trim())
          
          if (lines.length < 2) {
            setError('Le fichier doit contenir au moins un en-tête et une ligne de données')
            return
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
          const requiredHeaders = ['name', 'age', 'city', 'job', 'hobby', 'color', 'relation']
          
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
          if (missingHeaders.length > 0) {
            setError(`Colonnes manquantes: ${missingHeaders.join(', ')}`)
            return
          }

          const persons = []
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            if (values.length >= headers.length && values[0]) {
              const person = {}
              headers.forEach((header, idx) => {
                person[header] = values[idx] || ''
              })
              person.id = Date.now() + i
              persons.push(person)
            }
          }

          if (persons.length === 0) {
            setError('Aucune personne valide trouvée')
            return
          }

          setPreview(persons.slice(0, 3))
        } catch (err) {
          setError('Erreur lors de la lecture du fichier: ' + err.message)
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleUpload = () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csv = event.target.result
        const lines = csv.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

        const persons = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim())
          if (values.length >= headers.length && values[0]) {
            const person = {}
            headers.forEach((header, idx) => {
              person[header] = values[idx] || ''
            })
            person.id = Date.now() + i
            persons.push(person)
          }
        }

        onUpload(persons)
      } catch (err) {
        setError('Erreur lors du traitement: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  // Télécharger le fichier exemple
  const downloadTemplate = () => {
    const csvContent = [
      ['name', 'age', 'city', 'job', 'hobby', 'color', 'relation'],
      ['Julie Petit', '25', 'Marseille', 'Infirmière', 'Yoga', 'Rose', 'Amie'],
      ['Thomas Dubois', '32', 'Lyon', 'Développeur', 'Gaming', 'Vert', 'Collègue'],
      ['Emma Moreau', '30', 'Toulouse', 'Professeure', 'Lecture', 'Violet', 'Voisine'],
      ['Marc Leroux', '28', 'Bordeaux', 'Chef', 'Cuisine', 'Orange', 'Ami'],
      ['Sophie Martin', '26', 'Nice', 'Designer', 'Photographie', 'Bleu', 'Collègue']
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'guessparty-template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="csv-upload">
      <h2>📤 Importer des Personnes (CSV)</h2>

      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file-input"
          id="csv-file"
        />
        <label htmlFor="csv-file" className="file-label">
          📁 Sélectionnez un fichier CSV
        </label>
      </div>

      {file && <p className="file-name">✅ Fichier: {file.name}</p>}

      {error && <div className="error-message">{error}</div>}

      {preview.length > 0 && (
        <div className="preview">
          <h3>Aperçu ({preview.length} premiers)</h3>
          <div className="preview-table">
            {preview.map((person, idx) => (
              <div key={idx} className="preview-row">
                <span>{person.name}</span>
                <span>{person.age} ans</span>
                <span>{person.city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="upload-actions">
        <button onClick={handleUpload} className="btn-upload" disabled={!file || error}>
          ✅ Importer
        </button>
        <button onClick={onCancel} className="btn-cancel">
          ❌ Annuler
        </button>
      </div>

      <div className="csv-template">
        <div className="template-header">
          <h4>📝 Format CSV attendu:</h4>
          <button onClick={downloadTemplate} className="btn-download">
            📥 Télécharger le modèle
          </button>
        </div>
        <pre>name,age,city,job,hobby,color,relation /
Julie Petit,25,Marseille,Infirmière,Yoga,Rose,Amie
</pre>
      </div>
    </div>
  )
}

export default CSVUpload
