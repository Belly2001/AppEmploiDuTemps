import { useState } from 'react'
import styles from '@/styles/Admin.module.css'

export default function GestionDemandes() {
  
  // Liste des demandes reçues (simulation)
  const [demandes, setDemandes] = useState([
    { 
      id: 1, 
      type: 'empechement', 
      sujet: 'Absence cours du 15 novembre', 
      details: 'Je ne pourrai pas assurer mon cours de Programmation Web prévu le 15 novembre pour raisons médicales.',
      date: '2025-11-15',
      dateEnvoi: '2025-11-10 14:30',
      enseignant: { nom: 'Sane', prenom: 'Moussa', email: 'moussa.sane@univ.com' },
      statut: 'En attente',
      reponse: null
    },
    { 
      id: 2, 
      type: 'echange_salle', 
      sujet: 'Demande changement de salle pour TP', 
      details: 'Je souhaiterais changer la salle B2 pour la salle A1 car j\'ai besoin des ordinateurs pour mon TP.',
      date: '2025-11-12',
      dateEnvoi: '2025-11-08 09:15',
      enseignant: { nom: 'Izere', prenom: 'Divan', email: 'divan.izere@univ.com' },
      statut: 'En attente',
      reponse: null
    },
    { 
      id: 3, 
      type: 'probleme', 
      sujet: 'Vidéoprojecteur en panne', 
      details: 'Le vidéoprojecteur de la salle C3 ne fonctionne plus depuis ce matin.',
      date: '2025-11-10',
      dateEnvoi: '2025-11-09 16:00',
      enseignant: { nom: 'Ali', prenom: 'Hassane', email: 'hassane.ali@univ.com' },
      statut: 'Acceptée',
      reponse: 'Un technicien interviendra demain matin.'
    }
  ])

  // Modal pour répondre
  const [modalOuvert, setModalOuvert] = useState(false)
  const [demandeSelectionnee, setDemandeSelectionnee] = useState(null)
  const [reponse, setReponse] = useState('')

  // Message
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Filtre
  const [filtreStatut, setFiltreStatut] = useState('tous')

  // Filtrer les demandes
  const demandesFiltrees = demandes.filter(d => {
    if (filtreStatut === 'tous') return true
    return d.statut === filtreStatut
  })

  // Icône selon le type
  const getIcon = (type) => {
    switch (type) {
      case 'empechement': return '🚫'
      case 'echange_salle': return '🔄'
      case 'probleme': return '🔧'
      default: return '📝'
    }
  }

  // Label du type
  const getTypeLabel = (type) => {
    switch (type) {
      case 'empechement': return 'Empêchement'
      case 'echange_salle': return 'Échange de salle'
      case 'probleme': return 'Problème technique'
      default: return 'Autre'
    }
  }

  // Ouvrir le modal de réponse
  const ouvrirModal = (demande) => {
    setDemandeSelectionnee(demande)
    setReponse(demande.reponse || '')
    setModalOuvert(true)
  }

  // Répondre à une demande
  const repondre = (statut) => {
    if (!reponse.trim() && statut !== 'Refusée') {
      setMessage({ type: 'erreur', texte: 'Veuillez écrire une réponse' })
      return
    }

    setDemandes(prev => prev.map(d => {
      if (d.id === demandeSelectionnee.id) {
        return { ...d, statut, reponse: reponse.trim() || 'Demande refusée.' }
      }
      return d
    }))

    setModalOuvert(false)
    setDemandeSelectionnee(null)
    setReponse('')
    setMessage({ type: 'succes', texte: `Demande ${statut.toLowerCase()} !` })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API + Envoyer notification à l'enseignant
    console.log('Réponse envoyée:', { demande: demandeSelectionnee.id, statut, reponse })
  }

  // Compter les demandes
  const nbEnAttente = demandes.filter(d => d.statut === 'En attente').length

  return (
    <div>
      {/* Message de feedback */}
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Stats rapides */}
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

      {/* Liste des demandes */}
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

        {/* Filtres */}
        <div className={styles.filterBar}>
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className={styles.select}
            style={{ width: '200px' }}
          >
            <option value="tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Acceptée">Acceptées</option>
            <option value="Refusée">Refusées</option>
          </select>
        </div>

        {/* Liste */}
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
              <div 
                key={demande.id} 
                className={`${styles.demandeItem} ${demande.statut === 'En attente' ? styles.demandeNouvelle : ''}`}
              >
                <span className={styles.demandeIcon}>{getIcon(demande.type)}</span>
                
                <div className={styles.demandeContent}>
                  <div className={styles.demandeHeader}>
                    <div>
                      <div className={styles.demandeTitre}>{demande.sujet}</div>
                      <div className={styles.demandeAuteur}>
                        De : {demande.enseignant.prenom} {demande.enseignant.nom} ({demande.enseignant.email})
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
                    <span style={{ fontSize: '12px', color: '#999', marginRight: '15px' }}>
                      📅 Date concernée : {demande.date}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      🕐 Envoyé le : {demande.dateEnvoi}
                    </span>
                  </div>

                  <div className={styles.demandeMessage}>
                    <strong>Type :</strong> {getTypeLabel(demande.type)}<br/><br/>
                    {demande.details}
                  </div>

                  {demande.reponse && (
                    <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '6px', marginBottom: '15px' }}>
                      <strong>Votre réponse :</strong> {demande.reponse}
                    </div>
                  )}

                  <div className={styles.demandeActions}>
                    {demande.statut === 'En attente' ? (
                      <>
                        <button 
                          onClick={() => ouvrirModal(demande)}
                          className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSuccess}`}
                        >
                          Répondre
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => ouvrirModal(demande)}
                        className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}
                      >
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

      {/* Modal : Répondre à une demande */}
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
                De : {demandeSelectionnee.enseignant.prenom} {demandeSelectionnee.enseignant.nom}
              </p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '10px' }}>
                {demandeSelectionnee.details}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Votre réponse</label>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                className={styles.textarea}
                placeholder="Écrivez votre réponse à l'enseignant..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => repondre('Acceptée')}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                ✅ Accepter
              </button>
              <button 
                onClick={() => repondre('Refusée')}
                className={`${styles.button} ${styles.buttonDanger}`}
              >
                ❌ Refuser
              </button>
              <button 
                onClick={() => setModalOuvert(false)}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}