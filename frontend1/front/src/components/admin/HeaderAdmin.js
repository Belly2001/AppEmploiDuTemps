import styles from '@/styles/Admin.module.css'

export default function HeaderAdmin({ titre, admin, onDeconnexion }) {
  return (
    <header className={styles.header}>
      {/* Titre de la section actuelle */}
      <h2 className={styles.headerTitle}>{titre}</h2>

      {/* Partie droite : badge admin + nom + bouton déconnexion */}
      <div className={styles.headerRight}>
        <span className={styles.adminBadge}>Admin</span>
        <span className={styles.userName}>
          {admin.prenom} {admin.nom}
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