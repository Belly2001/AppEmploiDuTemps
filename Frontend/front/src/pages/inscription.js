import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/Connexion.module.css'
import { apiAjouterEnseignant } from '@/services/api'

export default function Inscription() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmMotDePasse: '',
    departement: '',
    grade: ''
  })

  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setErreur('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    if (!formData.nom || !formData.prenom || !formData.email || 
        !formData.motDePasse || !formData.confirmMotDePasse || 
        !formData.departement || !formData.grade) {
      setErreur('Veuillez remplir tous les champs')
      return
    }

    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setChargement(true)

    try {
      // On utilise la route d'ajout d'enseignant du backend
      // Les noms des champs correspondent au serializer Django
      await apiAjouterEnseignant({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        grade: formData.grade,
        departement: formData.departement,
        statut: 'Actif'
      })

      alert('Compte créé avec succès !')
      router.push('/connexion')

    } catch (err) {
      console.error('Erreur inscription:', err)
      setErreur("Erreur lors de l'inscription. Vérifiez que l'email n'est pas déjà utilisé.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className={styles.connexionPage}>
      <nav className={styles.nav}>
        <Link href="/">
          <button className={styles.backButton}>← Retour</button>
        </Link>
      </nav>

      <div className={styles.mainContainer}>
        
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

        <div className={styles.rightSection}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Créer un compte</h1>
            <p className={styles.subtitle}>Remplissez vos informations</p>

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

              <button type="submit" className={styles.submitButton} disabled={chargement}>
                {chargement ? 'Inscription en cours...' : "S'inscrire"}
              </button>

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