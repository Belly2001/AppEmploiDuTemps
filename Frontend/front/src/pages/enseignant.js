import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Enseignant.module.css'

// Import des composants (on les crée juste après)
import Sidebar from '@/components/enseignant/Sidebar'
import Header from '@/components/enseignant/Header'
import Disponibilites from '@/components/enseignant/Disponibilites'
import EmploiDuTemps from '@/components/enseignant/EmploiDuTemps'
import Demandes from '@/components/enseignant/Demandes'
import Notifications from '@/components/enseignant/Notifications'
import Profil from '@/components/enseignant/Profil'

export default function EnseignantDashboard() {
  const router = useRouter()

  // Section active (par défaut : disponibilités, car c'est la première chose à remplir)
  const [sectionActive, setSectionActive] = useState('disponibilites')

  // Données de l'enseignant (pour l'instant en dur, plus tard viendra de l'API)
  const [enseignant, setEnseignant] = useState({
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie.dupont@univ.fr',
    departement: 'Informatique',
    grade: 'Maître de conférences',
    statut: 'Actif'
  })

  // Fonction pour changer de section
  const changerSection = (nouvelleSection) => {
    setSectionActive(nouvelleSection)
  }

  // Fonction de déconnexion
  const handleDeconnexion = () => {
    // TODO: Vider la session / token
    console.log('Déconnexion...')
    router.push('/connexion')
  }

  // Affiche le bon composant selon la section active
  const afficherContenu = () => {
    switch (sectionActive) {
      case 'disponibilites':
        return <Disponibilites enseignant={enseignant} />
      case 'emploi':
        return <EmploiDuTemps enseignant={enseignant} />
      case 'demandes':
        return <Demandes enseignant={enseignant} />
      case 'notifications':
        return <Notifications enseignant={enseignant} />
      case 'profil':
        return <Profil enseignant={enseignant} setEnseignant={setEnseignant} />
      default:
        return <Disponibilites enseignant={enseignant} />
    }
  }

  // Titres des sections pour le header
  const titresSection = {
    disponibilites: 'Mes disponibilités',
    emploi: 'Mon emploi du temps',
    demandes: 'Mes demandes',
    notifications: 'Notifications',
    profil: 'Mon profil'
  }

  return (
    <div className={styles.dashboard}>
      {/* Menu latéral gauche */}
      <Sidebar 
        sectionActive={sectionActive} 
        changerSection={changerSection} 
      />

      {/* Zone principale (header + contenu) */}
      <div className={styles.mainContent}>
        {/* Barre du haut */}
        <Header 
          titre={titresSection[sectionActive]}
          enseignant={enseignant}
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