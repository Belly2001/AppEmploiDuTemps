import { useState } from 'react'
import styles from '@/styles/Enseignant.module.css'

export default function Profil({ enseignant, setEnseignant }) {
  
  // Mode édition ou affichage
  const [modeEdition, setModeEdition] = useState(false)

  // Copie des données pour l'édition
  const [formData, setFormData] = useState({ ...enseignant })

  // Message de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Listes pour les selects
  const departements = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Lettres']
  const grades = ['Assistant', 'Maître de conférences', 'Professeur', 'Vacataire']

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Sauvegarder les modifications
  const sauvegarder = (e) => {
    e.preventDefault()

    // Vérifications basiques
    if (!formData.nom || !formData.prenom || !formData.email) {
      setMessage({ type: 'erreur', texte: 'Le nom, prénom et email sont obligatoires' })
      return
    }

    // Mettre à jour les données
    setEnseignant(formData)
    setModeEdition(false)

    // Message de succès
    setMessage({ type: 'succes', texte: 'Profil mis à jour avec succès !' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API pour sauvegarder en BDD
    console.log('Profil à sauvegarder:', formData)
  }

  // Annuler les modifications
  const annuler = () => {
    setFormData({ ...enseignant })
    setModeEdition(false)
  }

  // Initiales pour l'avatar
  const initiales = `${enseignant.prenom.charAt(0)}${enseignant.nom.charAt(0)}`

  return (
    <div>
      {/* Message de feedback */}
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Section : En-tête du profil */}
      <div className={styles.card}>
        <div className={styles.profilHeader}>
          <div className={styles.profilAvatar}>
            {initiales}
          </div>
          <div>
            <h2 className={styles.profilNom}>
              {enseignant.prenom} {enseignant.nom}
            </h2>
            <p className={styles.profilEmail}>{enseignant.email}</p>
            <span style={{
              display: 'inline-block',
              marginTop: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: enseignant.statut === 'Actif' ? '#e8f5e9' : '#ffebee',
              color: enseignant.statut === 'Actif' ? '#388e3c' : '#d32f2f'
            }}>
              {enseignant.statut}
            </span>
          </div>
        </div>
      </div>

      {/* Section : Informations (mode affichage) */}
      {!modeEdition && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Mes informations</h3>
            <button
              onClick={() => setModeEdition(true)}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Modifier
            </button>
          </div>

          <div className={styles.profilInfos}>
            <div className={styles.profilInfo}>
              <div className={styles.profilInfoLabel}>Nom</div>
              <div className={styles.profilInfoValue}>{enseignant.nom}</div>
            </div>
            <div className={styles.profilInfo}>
              <div className={styles.profilInfoLabel}>Prénom</div>
              <div className={styles.profilInfoValue}>{enseignant.prenom}</div>
            </div>
            <div className={styles.profilInfo}>
              <div className={styles.profilInfoLabel}>Email</div>
              <div className={styles.profilInfoValue}>{enseignant.email}</div>
            </div>
            <div className={styles.profilInfo}>
              <div className={styles.profilInfoLabel}>Département</div>
              <div className={styles.profilInfoValue}>{enseignant.departement}</div>
            </div>
            <div className={styles.profilInfo}>
              <div className={styles.profilInfoLabel}>Grade</div>
              <div className={styles.profilInfoValue}>{enseignant.grade}</div>
            </div>
            <div className={styles.profilInfo}>
              <div className={styles.profilInfoLabel}>Statut</div>
              <div className={styles.profilInfoValue}>{enseignant.statut}</div>
            </div>
          </div>
        </div>
      )}

      {/* Section : Formulaire d'édition */}
      {modeEdition && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Modifier mes informations</h3>
          </div>

          <form onSubmit={sauvegarder}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Département</label>
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {departements.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {grades.map((gr) => (
                    <option key={gr} value={gr}>{gr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={annuler}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section : Changer mot de passe */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Sécurité</h3>
        </div>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Pour des raisons de sécurité, changez régulièrement votre mot de passe.
        </p>
        <button className={`${styles.button} ${styles.buttonSecondary}`}>
          Changer mon mot de passe
        </button>
      </div>
    </div>
  )
}