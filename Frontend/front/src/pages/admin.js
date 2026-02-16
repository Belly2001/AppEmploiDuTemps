import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Admin.module.css'

// Import des composants
import SidebarAdmin from '@/components/admin/SidebarAdmin'
import HeaderAdmin from '@/components/admin/HeaderAdmin'
import GestionEnseignants from '@/components/admin/GestionEnseignants'
import GestionSalles from '@/components/admin/GestionSalles'
import GestionEDT from '@/components/admin/GestionEDT'
import GestionDemandes from '@/components/admin/GestionDemandes'
import EnvoyerNotification from '@/components/admin/EnvoyerNotification'
import ProfilAdmin from '@/components/admin/ProfilAdmin'

export default function AdminDashboard() {
  const router = useRouter()

  // Section active (par défaut : gestion des enseignants)
  const [sectionActive, setSectionActive] = useState('enseignants')

  // Données de l'admin (simulation, viendra de l'API plus tard)
  const [admin, setAdmin] = useState({
    id: 1,
    nom: 'Sadia',
    prenom: 'Emmanuel',
    email: 'emmanuel.sadia@gmail.com',
    poste: 'Responsable Pédagogique',
    permissions: 'Gestion complète des emplois du temps'
  })

  // Fonction pour changer de section
  const changerSection = (nouvelleSection) => {
    setSectionActive(nouvelleSection)
  }

  // Fonction de déconnexion
  const handleDeconnexion = () => {
    console.log('Déconnexion admin...')
    router.push('/connexion')
  }

  // Affiche le bon composant selon la section active
  const afficherContenu = () => {
    switch (sectionActive) {
      case 'enseignants':
        return <GestionEnseignants />
      case 'salles':
        return <GestionSalles />
      case 'edt':
        return <GestionEDT />
      case 'demandes':
        return <GestionDemandes />
      case 'notifications':
        return <EnvoyerNotification />
      case 'profil':
        return <ProfilAdmin admin={admin} setAdmin={setAdmin} />
      default:
        return <GestionEnseignants />
    }
  }

  // Titres des sections pour le header
  const titresSection = {
    enseignants: 'Gestion des enseignants',
    salles: 'Gestion des salles',
    edt: 'Emplois du temps',
    demandes: 'Demandes reçues',
    notifications: 'Envoyer une notification',
    profil: 'Mon profil'
  }

  return (
    <div className={styles.dashboard}>
      {/* Menu latéral gauche */}
      <SidebarAdmin 
        sectionActive={sectionActive} 
        changerSection={changerSection} 
      />

      {/* Zone principale (header + contenu) */}
      <div className={styles.mainContent}>
        {/* Barre du haut */}
        <HeaderAdmin 
          titre={titresSection[sectionActive]}
          admin={admin}
          onDeconnexion={handleDeconnexion}
        />

        {/* Contenu qui change selon la section */}
        <div className={styles.content}>
          {afficherContenu()}
        </div>
      </div>
    </div>
  )
}