import styles from '@/styles/Enseignant.module.css'

export default function Header({ titre, enseignant, onDeconnexion }) {
  return (
    <header className={styles.header}>
      {/* Titre de la section actuelle */}
      <h2 className={styles.headerTitle}>{titre}</h2>

      {/* Partie droite : nom + bouton déconnexion */}
      <div className={styles.headerRight}>
        <span className={styles.userName}>
          Bonjour, {enseignant.prenom} {enseignant.nom}
        </span>
        <button 
          onClick={onDeconnexion} 
          className={styles.logoutButton}
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}