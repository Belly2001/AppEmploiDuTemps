import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getDemandesEnseignant, apiEnvoyerDemande } from '@/services/api'

export default function Demandes({ enseignant }) {
  
  const typesDemandes = [
    { id: 'empechement', icon: '🚫', label: 'Signaler un empêchement', description: 'Je ne pourrai pas assurer un cours prévu' },
    { id: 'echange_salle', icon: '🔄', label: "Demande d'échange de salle", description: 'Je souhaite changer de salle pour un cours' },
    { id: 'probleme', icon: '🔧', label: 'Signaler un problème', description: 'Problème technique, équipement défaillant...' },
    { id: 'autre', icon: '📝', label: 'Autre demande', description: "Toute autre demande à l'administration" }
  ]

  const [typeSelectionne, setTypeSelectionne] = useState(null)
  const [formData, setFormData] = useState({ sujet: '', date: '', details: '' })
  const [demandesEnvoyees, setDemandesEnvoyees] = useState([])
  const [chargement, setChargement] = useState(true)
  const [message, setMessage] = useState({ type: '', texte: '' })

  useEffect(() => {
    if (enseignant && enseignant.id) {
      chargerDemandes()
    }
  }, [enseignant])

  const chargerDemandes = async () => {
    try {
      setChargement(true)
      const data = await getDemandesEnseignant(enseignant.id)
      setDemandesEnvoyees(data)
    } catch (err) {
      console.error('Erreur chargement demandes:', err)
    } finally {
      setChargement(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const envoyerDemande = async (e) => {
    e.preventDefault()

    if (!typeSelectionne) {
      setMessage({ type: 'erreur', texte: 'Veuillez sélectionner un type de demande' })
      return
    }
    if (!formData.sujet || !formData.details) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir le sujet et les détails' })
      return
    }

    try {
      await apiEnvoyerDemande(enseignant.id, {
        type_demande: typeSelectionne,
        sujet: formData.sujet,
        details: formData.details,
        date_concernee: formData.date || null
      })
      await chargerDemandes()
      setTypeSelectionne(null)
      setFormData({ sujet: '', date: '', details: '' })
      setMessage({ type: 'succes', texte: "Votre demande a été envoyée à l'administration !" })
      setTimeout(() => setMessage({ type: '', texte: '' }), 4000)
    } catch (err) {
      console.error('Erreur envoi demande:', err)
      setMessage({ type: 'erreur', texte: "Erreur lors de l'envoi de la demande" })
    }
  }

  const getIconType = (typeId) => {
    const type = typesDemandes.find(t => t.id === typeId)
    return type ? type.icon : '📨'
  }

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'En attente': return { backgroundColor: '#fff3e0', color: '#f57c00' }
      case 'Acceptée': return { backgroundColor: '#e8f5e9', color: '#388e3c' }
      case 'Refusée': return { backgroundColor: '#ffebee', color: '#d32f2f' }
      default: return { backgroundColor: '#f5f5f5', color: '#666' }
    }
  }

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement des demandes...</div>
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
          <h3 className={styles.cardTitle}>Nouvelle demande</h3>
        </div>

        <p style={{ marginBottom: '15px', color: '#666' }}>1. Choisissez le type de demande :</p>

        <div className={styles.demandeTypes}>
          {typesDemandes.map((type) => (
            <div
              key={type.id}
              onClick={() => setTypeSelectionne(type.id)}
              className={`${styles.demandeType} ${typeSelectionne === type.id ? styles.demandeTypeActive : ''}`}
            >
              <span className={styles.demandeIcon}>{type.icon}</span>
              <div>
                <div className={styles.demandeLabel}>{type.label}</div>
                <div className={styles.demandeDesc}>{type.description}</div>
              </div>
            </div>
          ))}
        </div>

        {typeSelectionne && (
          <form onSubmit={envoyerDemande} style={{ marginTop: '25px' }}>
            <p style={{ marginBottom: '15px', color: '#666' }}>2. Décrivez votre demande :</p>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sujet</label>
                <input type="text" name="sujet" value={formData.sujet} onChange={handleChange} className={styles.input} placeholder="Ex: Impossibilité d'assurer le cours du 20 novembre" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date concernée (si applicable)</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={styles.input} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Détails de la demande</label>
              <textarea name="details" value={formData.details} onChange={handleChange} className={styles.textarea} placeholder="Expliquez votre situation en détail..." />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Envoyer la demande</button>
              <button type="button" onClick={() => { setTypeSelectionne(null); setFormData({ sujet: '', date: '', details: '' }) }} className={`${styles.button} ${styles.buttonSecondary}`}>Annuler</button>
            </div>
          </form>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Historique de mes demandes</h3>
          <span>{demandesEnvoyees.length} demande(s)</span>
        </div>

        {demandesEnvoyees.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h4 className={styles.emptyTitle}>Aucune demande</h4>
            <p className={styles.emptyText}>Vous n'avez pas encore envoyé de demande à l'administration.</p>
          </div>
        ) : (
          <div className={styles.notifList}>
            {demandesEnvoyees.map((demande) => (
              <div key={demande.id_demande} className={styles.notifItem}>
                <span className={styles.notifIcon}>{getIconType(demande.type_demande)}</span>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitre}>{demande.sujet}</div>
                  <div className={styles.notifMessage}>
                    {demande.date_concernee && `Date concernée : ${demande.date_concernee}`}
                  </div>
                  {demande.reponse && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '14px' }}>
                      <strong>Réponse de l'admin :</strong> {demande.reponse}
                    </div>
                  )}
                  <div className={styles.notifDate}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...getStatutStyle(demande.statut) }}>
                      {demande.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}