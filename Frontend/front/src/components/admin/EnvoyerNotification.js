import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getEnseignants, apiEnvoyerNotification } from '@/services/api'

export default function EnvoyerNotification() {
  
  const [enseignants, setEnseignants] = useState([])
  const [chargement, setChargement] = useState(true)

  const [formData, setFormData] = useState({
    destinataire: '',
    titre: '',
    message: ''
  })

  const [notificationsEnvoyees, setNotificationsEnvoyees] = useState([])
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Charger les enseignants depuis la base
  useEffect(() => {
    chargerEnseignants()
  }, [])

  const chargerEnseignants = async () => {
    try {
      const data = await getEnseignants()
      setEnseignants(data)
    } catch (err) {
      console.error('Erreur chargement enseignants:', err)
    } finally {
      setChargement(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Envoyer la notification via l'API
  const envoyerNotification = async (e) => {
    e.preventDefault()

    if (!formData.destinataire || !formData.titre || !formData.message) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir tous les champs' })
      return
    }

    // Récupérer l'admin connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    try {
      if (formData.destinataire === 'tous') {
        // Envoyer à tous les enseignants
        for (const ens of enseignants) {
          await apiEnvoyerNotification({
            destinataire_type: 'Enseignant',
            id_enseignant: ens.id_enseignant,
            id_admin: user.id,
            titre: formData.titre,
            message: formData.message
          })
        }
      } else {
        // Envoyer à un seul enseignant
        await apiEnvoyerNotification({
          destinataire_type: 'Enseignant',
          id_enseignant: parseInt(formData.destinataire),
          id_admin: user.id,
          titre: formData.titre,
          message: formData.message
        })
      }

      // Trouver le nom du destinataire pour l'historique
      let nomDestinataire = 'Tous les enseignants'
      if (formData.destinataire !== 'tous') {
        const ens = enseignants.find(e => e.id_enseignant === parseInt(formData.destinataire))
        if (ens) nomDestinataire = `${ens.prenom} ${ens.nom}`
      }

      setNotificationsEnvoyees(prev => [{
        id: Date.now(),
        titre: formData.titre,
        destinataire: nomDestinataire,
        date: new Date().toLocaleString('fr-FR')
      }, ...prev])

      setFormData({ destinataire: '', titre: '', message: '' })
      setMessage({ type: 'succes', texte: 'Notification envoyée avec succès !' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    } catch (err) {
      console.error('Erreur envoi notification:', err)
      setMessage({ type: 'erreur', texte: "Erreur lors de l'envoi de la notification" })
    }
  }

  const modeles = [
    { titre: 'Changement de salle', message: 'Votre cours a été déplacé. Veuillez consulter votre emploi du temps pour voir la nouvelle salle assignée.' },
    { titre: 'Cours annulé', message: 'Un de vos cours a été annulé. Veuillez consulter votre emploi du temps pour plus de détails.' },
    { titre: 'Réunion pédagogique', message: 'Une réunion pédagogique est prévue. Votre présence est requise.' },
    { titre: 'Mise à jour emploi du temps', message: 'Votre emploi du temps a été mis à jour. Veuillez le consulter.' }
  ]

  const appliquerModele = (modele) => {
    setFormData(prev => ({
      ...prev,
      titre: modele.titre,
      message: modele.message
    }))
  }

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement...</div>
  }

  return (
    <div>
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Nouvelle notification</h3>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Modèles rapides :</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {modeles.map((modele, index) => (
              <button
                key={index}
                onClick={() => appliquerModele(modele)}
                className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}
              >
                {modele.titre}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={envoyerNotification}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Destinataire *</label>
            <select
              name="destinataire"
              value={formData.destinataire}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">-- Choisir un destinataire --</option>
              <option value="tous">📢 Tous les enseignants</option>
              <optgroup label="Enseignants individuels">
                {enseignants.map(ens => (
                  <option key={ens.id_enseignant} value={ens.id_enseignant}>
                    {ens.prenom} {ens.nom} ({ens.email})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Titre de la notification *</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: Changement de salle"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Écrivez votre message..."
            />
          </div>

          <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
            🔔 Envoyer la notification
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Historique des notifications</h3>
          <span>{notificationsEnvoyees.length} envoyée(s)</span>
        </div>

        {notificationsEnvoyees.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <h4 className={styles.emptyTitle}>Aucune notification envoyée</h4>
            <p className={styles.emptyText}>Les notifications envoyées durant cette session apparaîtront ici.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Destinataire</th>
                <th>Date d'envoi</th>
              </tr>
            </thead>
            <tbody>
              {notificationsEnvoyees.map((notif) => (
                <tr key={notif.id}>
                  <td><strong>{notif.titre}</strong></td>
                  <td>{notif.destinataire}</td>
                  <td>{notif.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}