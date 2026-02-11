import { useState } from 'react'
import styles from '@/styles/Admin.module.css'

export default function ProfilAdmin({ admin, setAdmin }) {
  
  // Mode édition
  const [modeEdition, setModeEdition] = useState(false)

  // Copie des données pour l'édition
  const [formData, setFormData] = useState({ ...admin })

  // Message de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Sauvegarder les modifications
  const sauvegarder = (e) => {
    e.preventDefault()

    if (!formData.nom || !formData.prenom || !formData.email) {
      setMessage({ type: 'erreur', texte: 'Les champs nom, prénom et email sont obligatoires' })
      return
    }

    setAdmin(formData)
    setModeEdition(false)
    setMessage({ type: 'succes', texte: 'Profil mis à jour avec succès !' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API
    console.log('Profil admin mis à jour:', formData)
  }

  // Annuler
  const annuler = () => {
    setFormData({ ...admin })
    setModeEdition(false)
  }

  // Initiales pour l'avatar
  const initiales = `${admin.prenom.charAt(0)}${admin.nom.charAt(0)}`

  return (
    <div>
      {/* Message de feedback */}
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* En-tête du profil */}
      <div className={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div className={styles.enseignantAvatar} style={{ width: '100px', height: '100px', fontSize: '36px', backgroundColor: '#1a1a2e' }}>
            {initiales}
          </div>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#1a1a2e', fontSize: '28px' }}>
              {admin.prenom} {admin.nom}
            </h2>
            <p style={{ color: '#666', margin: '0 0 10px 0' }}>{admin.email}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className={styles.adminBadge}>Administrateur</span>
              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#e3f2fd', color: '#1976d2' }}>
                {admin.poste}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations (mode affichage) */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>Nom</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{admin.nom}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>Prénom</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{admin.prenom}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>Email</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{admin.email}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>Poste</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{admin.poste}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>Permissions</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{admin.permissions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'édition */}
      {modeEdition && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Modifier mes informations</h3>
          </div>

          <form onSubmit={sauvegarder}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Prénom *</label>
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
              <label className={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Poste</label>
              <input
                type="text"
                name="poste"
                value={formData.poste}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
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

      {/* Sécurité */}
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