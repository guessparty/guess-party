import './Footer.css'

function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>À Propos</h4>
          <p>GuessParty est un jeu simple et addictif pour tester votre intuition.</p>
        </div>

        <div className="footer-section">
          <h4>Liens</h4>
          <ul>
            <li><a href="#modes">Modes de Jeu</a></li>
            <li><a href="#">Conditions d'utilisation</a></li>
            <li><a href="#">Politique de confidentialité</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Avez-vous des questions ?</p>
          <a href="mailto:contact@guessparty.com">contact@guessparty.com</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 GuessParty. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer
