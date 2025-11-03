import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎉 Guess Party</h1>
        <p>Plateforme de jeux de devinettes personnalisés</p>
      </header>
      
      <main className="app-main">
        <div className="card">
          <h2>Bienvenue dans votre environnement de développement !</h2>
          <p>Votre application React tourne dans GitHub Codespaces 🚀</p>
          
          <button onClick={() => setCount(count + 1)}>
            Clics : {count}
          </button>
          
          <div className="features">
            <h3>Prochaines étapes :</h3>
            <ul>
              <li>✅ Architecture monorepo créée</li>
              <li>✅ React + Vite configuré</li>
              <li>⏳ Mode Quotidien à développer</li>
              <li>⏳ Mode Pokédex à développer</li>
              <li>⏳ Mode Marathon à développer</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
