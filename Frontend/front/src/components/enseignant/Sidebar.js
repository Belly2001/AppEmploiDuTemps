import styles from '@/styles/Enseignant.module.css'
import { FaClock, FaCalendarAlt, FaEnvelopeOpenText, FaBell, FaUserCircle } from 'react-icons/fa'

export default function Sidebar({ sectionActive, changerSection }) {
  
  const menuItems = [
    { id: 'disponibilites', label: 'Disponibilités', icon: <FaClock size={20} /> },
    { id: 'emploi', label: 'Emploi du temps', icon: <FaCalendarAlt size={20} /> },
    { id: 'demandes', label: 'Mes demandes', icon: <FaEnvelopeOpenText size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell size={20} /> },
    { id: 'profil', label: 'Mon profil', icon: <FaUserCircle size={20} /> }
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>Schedule APP</h1>
      </div>

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