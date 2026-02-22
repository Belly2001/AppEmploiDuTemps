import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getDemandesAdmin, apiRepondreDemande } from '@/services/api'

export default function GestionDemandes() {
  
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [modalOuvert, setModalOuvert] = useState(false)
  const [demandeSelectionnee, setDemandeSelectionnee] = useState(null)
  const [reponse, setReponse] = useState('')
  const [message, setMessage] = useState({ type: '', texte: '' })
  const [filtreStatut, setFiltreStatut] = useState('tous')

  useEffect(() => {
    chargerDemandes()
  }, [])

  const chargerDemandes = async () => {
    try {
      setChargement(true)
      const data = await getDemandesAdmin()
      setDemandes(data)
    } catch (err) {
      console.error('Erreur chargement demandes:', err)
    } finally {
      setChargement(false)
    }
  }

  const demandesFiltrees = demandes.filter(d => {
    if (filtreStatut === 'tous') return true
    return d.statut === filtreStatut
  })

  const getIcon = (type) => {
    switch (type) {
      case 'empechement': return '🚫'
      case 'echange_salle': return '🔄'
      case 'probleme': return '🔧'
      default: return '📝'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'empechement': return 'Empêchement'
      case 'echange_salle': return 'Échange de salle'
      case 'probleme': return 'Problème technique'
      default: return 'Autre'
    }
  }

  const ouvrirModal = (demande) => {
    setDemandeSelectionnee(demande)
    setReponse(demande.reponse || '')
    setModalOuvert(true)
  }

  const repondre = async (statut) => {
    if (!reponse.trim() && statut !== 'Refusée') {
      setMessage({ type: 'erreur', texte: 'Veuillez écrire une réponse' })
      return
    }

    try {
      await apiRepondreDemande(demandeSelectionnee.id_demande, {
        statut: statut,
        reponse: reponse.trim() || 'Demande refusée.'
      })
      await chargerDemandes()
      setModalOuvert(false)
      setDemandeSelectionnee(null)
      setReponse('')
      setMessage({ type: 'succes', texte: `Demande ${statut.toLowerCase()} !` })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    } catch (err) {
      console.error('Erreur réponse:', err)
      setMessage({ type: 'erreur', texte: 'Erreur lors de la réponse' })
    }
  }

  const nbEnAttente = demandes.filter(d => d.statut === 'En attente').length

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

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>📨</div>
          <div className={styles.statInfo}>
            <h3>{demandes.length}</h3>
            <p>Demandes total</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>⏳</div>
          <div className={styles.statInfo}>
            <h3>{nbEnAttente}</h3>
            <p>En attente</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>✅</div>
          <div className={styles.statInfo}>
            <h3>{demandes.filter(d => d.statut === 'Acceptée').length}</h3>
            <p>Acceptées</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>❌</div>
          <div className={styles.statInfo}>
            <h3>{demandes.filter(d => d.statut === 'Refusée').length}</h3>
            <p>Refusées</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            Demandes reçues
            {nbEnAttente > 0 && (
              <span style={{ marginLeft: '10px', padding: '4px 10px', backgroundColor: '#f57c00', color: 'white', borderRadius: '20px', fontSize: '13px' }}>
                {nbEnAttente} en attente
              </span>
            )}
          </h3>
        </div>

        <div className={styles.filterBar}>
          <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className={styles.select} style={{ width: '200px' }}>
            <option value="tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Acceptée">Acceptées</option>
            <option value="Refusée">Refusées</option>
          </select>
        </div>

        {demandesFiltrees.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h4 className={styles.emptyTitle}>Aucune demande</h4>
            <p className={styles.emptyText}>
              {filtreStatut !== 'tous' ? 'Aucune demande avec ce statut.' : 'Aucune demande reçue pour le moment.'}
            </p>
          </div>
        ) : (
          <div className={styles.demandesList}>
            {demandesFiltrees.map((demande) => (
              <div key={demande.id_demande} className={`${styles.demandeItem} ${demande.statut === 'En attente' ? styles.demandeNouvelle : ''}`}>
                <span className={styles.demandeIcon}>{getIcon(demande.type_demande)}</span>
                
                <div className={styles.demandeContent}>
                  <div className={styles.demandeHeader}>
                    <div>
                      <div className={styles.demandeTitre}>{demande.sujet}</div>
                      <div className={styles.demandeAuteur}>
                        De : {demande.enseignant_prenom} {demande.enseignant_nom} ({demande.enseignant_email})
                      </div>
                    </div>
                    <span className={`${styles.badge} ${
                      demande.statut === 'En attente' ? styles.badgeEnAttente :
                      demande.statut === 'Acceptée' ? styles.badgeAcceptee :
                      styles.badgeRefusee
                    }`}>
                      {demande.statut}
                    </span>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    {demande.date_concernee && (
                      <span style={{ fontSize: '12px', color: '#999', marginRight: '15px' }}>
                        📅 Date concernée : {demande.date_concernee}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      🕐 Envoyé le : {new Date(demande.date_envoi).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <div className={styles.demandeMessage}>
                    <strong>Type :</strong> {getTypeLabel(demande.type_demande)}<br/><br/>
                    {demande.details}
                  </div>

                  {demande.reponse && (
                    <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '6px', marginBottom: '15px' }}>
                      <strong>Votre réponse :</strong> {demande.reponse}
                    </div>
                  )}

                  <div className={styles.demandeActions}>
                    {demande.statut === 'En attente' ? (
                      <button onClick={() => ouvrirModal(demande)} className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSuccess}`}>
                        Répondre
                      </button>
                    ) : (
                      <button onClick={() => ouvrirModal(demande)} className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}>
                        Voir / Modifier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOuvert && demandeSelectionnee && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Répondre à la demande</h3>
              <button onClick={() => setModalOuvert(false)} className={styles.modalClose}>✕</button>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ fontWeight: '600', marginBottom: '5px' }}>{demandeSelectionnee.sujet}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                De : {demandeSelectionnee.enseignant_prenom} {demandeSelectionnee.enseignant_nom}
              </p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '10px' }}>
                {demandeSelectionnee.details}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Votre réponse</label>
              <textarea value={reponse} onChange={(e) => setReponse(e.target.value)} className={styles.textarea} placeholder="Écrivez votre réponse à l'enseignant..." />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => repondre('Acceptée')} className={`${styles.button} ${styles.buttonSuccess}`}>✅ Accepter</button>
              <button onClick={() => repondre('Refusée')} className={`${styles.button} ${styles.buttonDanger}`}>❌ Refuser</button>
              <button onClick={() => setModalOuvert(false)} className={`${styles.button} ${styles.buttonSecondary}`}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}