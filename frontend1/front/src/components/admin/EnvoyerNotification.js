import { useState } from 'react'
import styles from '@/styles/Admin.module.css'

export default function EnvoyerNotification() {
  
  // Liste des enseignants (simulation)
  const enseignants = [
    { id: 1, nom: 'Sane', prenom: 'Moussa', email: 'moussa.sane@univ.com' },
    { id: 2, nom: 'Izere', prenom: 'Divan', email: 'divan.izere@univ.com' },
    { id: 3, nom: 'Ali', prenom: 'Hassane', email: 'hassane.ali@univ.com' }
  ]

  // Formulaire
  const [formData, setFormData] = useState({
    destinataire: '', // 'tous' ou id de l'enseignant
    titre: '',
    message: ''
  })

  // Historique des notifications envoyées
  const [notificationsEnvoyees, setNotificationsEnvoyees] = useState([
    { id: 1, titre: 'Réunion pédagogique', destinataire: 'Tous les enseignants', date: '2025-11-10 10:00' },
    { id: 2, titre: 'Changement de salle', destinataire: 'Moussa Sane', date: '2025-11-09 14:30' }
  ])

  // Message
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Envoyer la notification
  const envoyerNotification = (e) => {
    e.preventDefault()

    if (!formData.destinataire || !formData.titre || !formData.message) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir tous les champs' })
      return
    }

    // Trouver le nom du destinataire
    let nomDestinataire = 'Tous les enseignants'
    if (formData.destinataire !== 'tous') {
      const ens = enseignants.find(e => e.id === parseInt(formData.destinataire))
      if (ens) nomDestinataire = `${ens.prenom} ${ens.nom}`
    }

    const nouvelleNotif = {
      id: Date.now(),
      titre: formData.titre,
      destinataire: nomDestinataire,
      date: new Date().toLocaleString('fr-FR')
    }

    setNotificationsEnvoyees(prev => [nouvelleNotif, ...prev])
    setFormData({ destinataire: '', titre: '', message: '' })
    setMessage({ type: 'succes', texte: 'Notification envoyée avec succès !' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API
    console.log('Notification envoyée:', { ...formData, nomDestinataire })
  }

  // Modèles de notifications prédéfinis
  const modeles = [
    { titre: 'Changement de salle', message: 'Votre cours a été déplacé. Veuillez consulter votre emploi du temps pour voir la nouvelle salle assignée.' },
    { titre: 'Cours annulé', message: 'Un de vos cours a été annulé. Veuillez consulter votre emploi du temps pour plus de détails.' },
    { titre: 'Réunion pédagogique', message: 'Une réunion pédagogique est prévue. Votre présence est requise.' },
    { titre: 'Mise à jour emploi du temps', message: 'Votre emploi du temps a été mis à jour. Veuillez le consulter.' }
  ]

  // Appliquer un modèle
  const appliquerModele = (modele) => {
    setFormData(prev => ({
      ...prev,
      titre: modele.titre,
      message: modele.message
    }))
  }

  return (
    <div>
      {/* Message de feedback */}
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Formulaire d'envoi */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Nouvelle notification</h3>
        </div>

        {/* Modèles rapides */}
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
                  <option key={ens.id} value={ens.id}>
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

      {/* Historique */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Historique des notifications</h3>
          <span>{notificationsEnvoyees.length} envoyée(s)</span>
        </div>

        {notificationsEnvoyees.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <h4 className={styles.emptyTitle}>Aucune notification</h4>
            <p className={styles.emptyText}>Vous n'avez pas encore envoyé de notification.</p>
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