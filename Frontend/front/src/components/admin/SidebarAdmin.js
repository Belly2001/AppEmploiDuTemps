import styles from '@/styles/Admin.module.css'

export default function SidebarAdmin({ sectionActive, changerSection }) {
  
  // Liste des éléments du menu admin
  const menuItems = [
    { id: 'enseignants', label: 'Enseignants', icon: '👥' },
    { id: 'salles', label: 'Salles', icon: '🏫' },
    { id: 'edt', label: 'Emplois du temps', icon: '📅' },
    { id: 'demandes', label: 'Demandes', icon: '📨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profil', label: 'Mon profil', icon: '👤' }
  ]

  return (
    <aside className={styles.sidebar}>
      {/* Logo / Titre de l'app */}
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>Schedule APP</h1>
        <p className={styles.logoSub}>Espace Administration</p>
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