import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Enseignant.module.css'

import Sidebar from '@/components/enseignant/Sidebar'
import Header from '@/components/enseignant/Header'
import PremiereConnexion from '@/components/enseignant/PremiereConnexion'
import Disponibilites from '@/components/enseignant/Disponibilites'
import EmploiDuTemps from '@/components/enseignant/EmploiDuTemps'
import Demandes from '@/components/enseignant/Demandes'
import Notifications from '@/components/enseignant/Notifications'
import Profil from '@/components/enseignant/Profil'

export default function EnseignantDashboard() {
  const router = useRouter()
  const [sectionActive, setSectionActive] = useState('disponibilites')
  const [premiereConnexion, setPremiereConnexion] = useState(false)

  const [enseignant, setEnseignant] = useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    departement: '',
    grade: '',
    statut: ''
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/connexion')
      return
    }
    const data = JSON.parse(user)
    if (data.role !== 'enseignant') {
      router.push('/connexion')
      return
    }
    setEnseignant({
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      departement: data.departement || '',
      grade: data.grade || '',
      statut: data.statut || 'Actif'
    })
    // Détecter première connexion
    if (data.premiere_connexion) {
      setPremiereConnexion(true)
    }
  }, [])

  const terminerPremiereConnexion = () => {
    setPremiereConnexion(false)
    // Mettre à jour localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    user.premiere_connexion = false
    localStorage.setItem('user', JSON.stringify(user))
  }

  const changerSection = (nouvelleSection) => {
    setSectionActive(nouvelleSection)
  }

  const handleDeconnexion = () => {
    localStorage.removeItem('user')
    router.push('/connexion')
  }

  // Si première connexion, afficher le parcours de choix
  if (premiereConnexion) {
    return (
      <div className={styles.dashboard}>
        <Sidebar 
          sectionActive="premiere-connexion" 
          changerSection={() => {}} 
        />
        <div className={styles.mainContent}>
          <Header 
            titre="Bienvenue ! Configuration initiale"
            enseignant={enseignant}
            onDeconnexion={handleDeconnexion}
          />
          <div className={styles.content}>
            <PremiereConnexion 
              enseignant={enseignant} 
              onTerminer={terminerPremiereConnexion}
            />
          </div>
        </div>
      </div>
    )
  }

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

  const titresSection = {
    disponibilites: 'Mes disponibilités',
    emploi: 'Mon emploi du temps',
    demandes: 'Mes demandes',
    notifications: 'Notifications',
    profil: 'Mon profil'
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar 
        sectionActive={sectionActive} 
        changerSection={changerSection} 
      />
      <div className={styles.mainContent}>
        <Header 
          titre={titresSection[sectionActive]}
          enseignant={enseignant}
          onDeconnexion={handleDeconnexion}
        />
        <div className={styles.content}>
          {afficherContenu()}
        </div>
      </div>
    </div>
  )
}