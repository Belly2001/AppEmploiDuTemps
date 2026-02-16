import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/Connexion.module.css'

export default function Inscription() {
  const router = useRouter()

  // États pour chaque champ du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmMotDePasse: '',
    departement: '',
    grade: ''
  })

  // État pour les erreurs de validation
  const [erreur, setErreur] = useState('')

  // Listes pour les selects (tu pourras les modifier selon tes besoins)
  const departements = [
    'Informatique',
    'Mathématiques',
    'Physique',
    'Chimie',
    'Biologie',
    'Lettres',
    'Histoire',
    'Géographie'
  ]

  const grades = [
    'Assistant',
    'Maître de conférences',
    'Professeur',
    'Vacataire'
  ]

  // Gestion des changements dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Efface l'erreur quand l'utilisateur modifie un champ
    setErreur('')
  }

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    // Vérification : tous les champs sont remplis ?
    if (!formData.nom || !formData.prenom || !formData.email || 
        !formData.motDePasse || !formData.confirmMotDePasse || 
        !formData.departement || !formData.grade) {
      setErreur('Veuillez remplir tous les champs')
      return
    }

    // Vérification : les mots de passe correspondent ?
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    // Vérification : mot de passe assez long ?
    if (formData.motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    // Tout est OK — affichage console pour debug
    console.log('Inscription:', formData)

    // TODO: Appel API pour créer le compte
    // Pour l'instant, on simule une inscription réussie
    alert('Compte créé avec succès ! (simulation)')
    router.push('/connexion')
  }

  return (
    <div className={styles.connexionPage}>
      {/* Navigation retour */}
      <nav className={styles.nav}>
        <Link href="/">
          <button className={styles.backButton}>← Retour</button>
        </Link>
      </nav>

      {/* Container principal avec 2 colonnes */}
      <div className={styles.mainContainer}>
        
        {/* SECTION GAUCHE - Slogans (identique à connexion) */}
        <div className={styles.leftSection}>
          <div className={styles.brandSection}>
            <h1 className={styles.brandTitle}>Schedule APP</h1>
            <div className={styles.divider}></div>
            <p className={styles.brandSlogan}>
              Rejoignez-nous et simplifiez votre gestion du temps
            </p>
          </div>

          <div className={styles.featuresSection}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📝</div>
              <div>
                <h3 className={styles.featureTitle}>Inscription simple</h3>
                <p className={styles.featureText}>
                  Créez votre compte en quelques minutes
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <div>
                <h3 className={styles.featureTitle}>Sécurisé</h3>
                <p className={styles.featureText}>
                  Vos données sont protégées et confidentielles
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚀</div>
              <div>
                <h3 className={styles.featureTitle}>Accès immédiat</h3>
                <p className={styles.featureText}>
                  Commencez à utiliser l'application dès maintenant
                </p>
              </div>
            </div>
          </div>

          <p className={styles.quote}>
            "Votre temps est précieux, nous vous aidons à le gérer"
          </p>
        </div>

        {/* SECTION DROITE - Formulaire d'inscription */}
        <div className={styles.rightSection}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Créer un compte</h1>
            <p className={styles.subtitle}>Remplissez vos informations</p>

            {/* Affichage des erreurs */}
            {erreur && (
              <div style={{
                backgroundColor: '#ffe6e6',
                color: '#cc0000',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Ligne 1 : Nom et Prénom côte à côte */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                  <label className={styles.label}>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Votre nom"
                  />
                </div>

                <div className={styles.inputGroup} style={{ flex: 1 }}>
                  <label className={styles.label}>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="votre.email@universite.fr"
                />
              </div>

              {/* Mot de passe */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Minimum 6 caractères"
                />
              </div>

              {/* Confirmer mot de passe */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmMotDePasse"
                  value={formData.confirmMotDePasse}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Retapez votre mot de passe"
                />
              </div>

              {/* Ligne 2 : Département et Grade côte à côte */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                  <label className={styles.label}>Département</label>
                  <select
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    className={styles.input}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">-- Choisir --</option>
                    {departements.map((dep, index) => (
                      <option key={index} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup} style={{ flex: 1 }}>
                  <label className={styles.label}>Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className={styles.input}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">-- Choisir --</option>
                    {grades.map((gr, index) => (
                      <option key={index} value={gr}>{gr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bouton S'inscrire */}
              <button type="submit" className={styles.submitButton}>
                S'inscrire
              </button>

              {/* Lien vers connexion */}
              <p className={styles.signupText}>
                Déjà un compte ?{' '}
                <Link href="/connexion" className={styles.signupLink}>
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}