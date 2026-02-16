import styles from '@/styles/Enseignant.module.css'

export default function Sidebar({ sectionActive, changerSection }) {
  
  // Liste des éléments du menu
  const menuItems = [
    { id: 'disponibilites', label: 'Disponibilités', icon: '🕐' },
    { id: 'emploi', label: 'Emploi du temps', icon: '📅' },
    { id: 'demandes', label: 'Mes demandes', icon: '📨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profil', label: 'Mon profil', icon: '👤' }
  ]

  return (
    <aside className={styles.sidebar}>
      {/* Logo / Titre de l'app */}
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>Schedule APP</h1>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => changerSection(item.id)}
            className={`${styles.navItem} ${sectionActive === item.id ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}