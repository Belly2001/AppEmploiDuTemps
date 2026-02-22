import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Admin.module.css'

import SidebarAdmin from '@/components/admin/SidebarAdmin'
import HeaderAdmin from '@/components/admin/HeaderAdmin'
import GestionEnseignants from '@/components/admin/GestionEnseignants'
import GestionSalles from '@/components/admin/GestionSalles'
import GestionEDT from '@/components/admin/GestionEDT'
import GestionDemandes from '@/components/admin/GestionDemandes'
import EnvoyerNotification from '@/components/admin/EnvoyerNotification'
import ProfilAdmin from '@/components/admin/ProfilAdmin'
import GestionDepartements from '@/components/admin/GestionDepartements'

export default function AdminDashboard() {
  const router = useRouter()
  const [sectionActive, setSectionActive] = useState('departements')

  // Lire les infos de l'admin depuis localStorage (rempli lors de la connexion)
  const [admin, setAdmin] = useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    poste: '',
    permissions: ''
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      // Pas connecté → retour à la connexion
      router.push('/connexion')
      return
    }
    const data = JSON.parse(user)
    if (data.role !== 'admin') {
      // Ce n'est pas un admin → retour à la connexion
      router.push('/connexion')
      return
    }
    setAdmin({
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      poste: data.poste || '',
      permissions: data.permissions || ''
    })
  }, [])

  const changerSection = (nouvelleSection) => {
    setSectionActive(nouvelleSection)
  }

  const handleDeconnexion = () => {
    localStorage.removeItem('user')
    router.push('/connexion')
  }

  const afficherContenu = () => {
    switch (sectionActive) {
      case 'departements':
        return <GestionDepartements />
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

  const titresSection = {
    departements: 'Départements & Formations',
    enseignants: 'Gestion des enseignants',
    salles: 'Gestion des salles',
    edt: 'Emplois du temps',
    demandes: 'Demandes reçues',
    notifications: 'Envoyer une notification',
    profil: 'Mon profil'
  }

  return (
    <div className={styles.dashboard}>
      <SidebarAdmin 
        sectionActive={sectionActive} 
        changerSection={changerSection} 
      />
      <div className={styles.mainContent}>
        <HeaderAdmin 
          titre={titresSection[sectionActive]}
          admin={admin}
          onDeconnexion={handleDeconnexion}
        />
        <div className={styles.content}>
          {afficherContenu()}
        </div>
      </div>
    </div>
  )
}