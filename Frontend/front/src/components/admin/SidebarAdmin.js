import styles from '@/styles/Admin.module.css'
import { HiOutlineBuildingLibrary } from 'react-icons/hi2'
import { FaChalkboardTeacher, FaDoorOpen, FaCalendarAlt, FaEnvelopeOpenText, FaBell, FaUserCircle } from 'react-icons/fa'

export default function SidebarAdmin({ sectionActive, changerSection }) {
  
  const menuItems = [
    { id: 'departements', label: 'Départements', icon: <HiOutlineBuildingLibrary size={20} /> },
    { id: 'enseignants', label: 'Enseignants', icon: <FaChalkboardTeacher size={20} /> },
    { id: 'salles', label: 'Salles', icon: <FaDoorOpen size={20} /> },
    { id: 'edt', label: 'Emplois du temps', icon: <FaCalendarAlt size={20} /> },
    { id: 'demandes', label: 'Demandes', icon: <FaEnvelopeOpenText size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell size={20} /> },
    { id: 'profil', label: 'Mon profil', icon: <FaUserCircle size={20} /> }
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>Schedule APP</h1>
        <p className={styles.logoSub}>Espace Administration</p>
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