import { useState } from 'react'
import styles from '@/styles/Admin.module.css'
import { HiOutlineBuildingLibrary } from 'react-icons/hi2'
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { FaChalkboardTeacher, FaDoorOpen, FaCalendarAlt, FaEnvelopeOpenText, FaBell, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'

export default function SidebarAdmin({ sectionActive, changerSection }) {
  const [menuOuvert, setMenuOuvert] = useState(false)

  const menuItems = [
    { id: 'departements', label: 'Départements', icon: <HiOutlineBuildingLibrary size={20} /> },
    { id: 'enseignants', label: 'Enseignants', icon: <FaChalkboardTeacher size={20} /> },
    { id: 'salles', label: 'Salles', icon: <FaDoorOpen size={20} /> },
    { id: 'edt', label: 'Emplois du temps', icon: <FaCalendarAlt size={20} /> },
    { id: 'demandes', label: 'Demandes', icon: <FaEnvelopeOpenText size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell size={20} /> },
    { id: 'inscriptions', label: 'Candidatures', icon: <FaPersonCircleQuestion size={20} /> },
    { id: 'profil', label: 'Mon profil', icon: <FaUserCircle size={20} /> }
  ]

  const handleClick = (id) => {
    changerSection(id)
    setMenuOuvert(false)
  }

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button 
        className={styles.hamburger} 
        onClick={() => setMenuOuvert(!menuOuvert)}
      >
        {menuOuvert ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Overlay sombre quand menu ouvert sur mobile */}
      {menuOuvert && (
        <div className={styles.sidebarOverlay} onClick={() => setMenuOuvert(false)} />
      )}

      <aside className={`${styles.sidebar} ${menuOuvert ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Schedule APP</h1>
          <p className={styles.logoSub}>Espace Administration</p>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`${styles.navItem} ${sectionActive === item.id ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}