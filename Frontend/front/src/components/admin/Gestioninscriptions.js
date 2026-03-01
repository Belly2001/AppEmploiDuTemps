import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { apiGetDemandesInscription, apiRepondreDemandeInscription } from '@/services/api'

// icones
import { 
  FaUserGraduate, FaDownload, FaCheck, FaTimes, 
  FaSpinner, FaClock, FaCheckCircle, FaTimesCircle,
  FaFilePdf, FaEnvelope, FaBuilding
} from 'react-icons/fa'

export default function GestionInscriptions() {
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [messageReponse, setMessageReponse] = useState({}) // { id: "message..." }
  const [enCours, setEnCours] = useState(null) // id de la demande en cours de traitement

  // charger les demandes au montage
  useEffect(() => {
    chargerDemandes()
  }, [])

  const chargerDemandes = async () => {
    try {
      const data = await apiGetDemandesInscription()
      setDemandes(data)
    } catch (err) {
      console.error('Erreur chargement demandes:', err)
    } finally {
      setChargement(false)
    }
  }

  // telecharger le CV (on décode le base64 et on crée un lien de téléchargement)
  const telechargerCV = (demande) => {
    if (!demande.cv_base64) {
      alert('Aucun CV disponible')
      return
    }

    // on reconstruit le fichier PDF à partir du base64
    const byteCharacters = atob(demande.cv_base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // on crée un lien temporaire pour le téléchargement
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = demande.cv_nom_fichier || `CV_${demande.nom}_${demande.prenom}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // répondre à une demande (accepter ou rejeter)
  const repondre = async (idDemande, statut) => {
    setEnCours(idDemande)
    try {
      await apiRepondreDemandeInscription(idDemande, {
        statut: statut,
        message_reponse: messageReponse[idDemande] || ''
      })
      // recharger la liste
      await chargerDemandes()
    } catch (err) {
      console.error('Erreur:', err)
      alert('Erreur lors de la réponse')
    } finally {
      setEnCours(null)
    }
  }

  // séparer les demandes par statut
  const enAttente = demandes.filter(d => d.statut === 'en_attente')
  const traitees = demandes.filter(d => d.statut !== 'en_attente')

  if (chargement) {
    return (
      <div className={styles.pageContent}>
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
          <FaSpinner className={styles.spinner || ''} style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '15px' }}>Chargement des demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <FaUserGraduate style={{ marginRight: '12px', color: '#818cf8' }} />
          Demandes d&apos;inscription
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '5px' }}>
          {enAttente.length} demande{enAttente.length > 1 ? 's' : ''} en attente
        </p>
      </div>

      {/* ===== DEMANDES EN ATTENTE ===== */}
      {enAttente.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '50px 20px',
          background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <FaCheckCircle style={{ fontSize: '40px', color: 'rgba(255,255,255,0.15)', marginBottom: '15px' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Aucune demande en attente</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {enAttente.map((demande) => (
            <div key={demande.id_demande} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '25px',
              transition: 'all 0.3s ease'
            }}>
              {/* en-tête : nom + badge en attente */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
                    {demande.prenom} {demande.nom}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaEnvelope size={11} /> {demande.email}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaBuilding size={11} /> {demande.departement || '—'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaUserGraduate size={11} /> {demande.grade || '—'}
                    </span>
                  </div>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
                  background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <FaClock size={10} /> En attente
                </span>
              </div>

              {/* date + bouton télécharger CV */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                  Reçue le {new Date(demande.date_demande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                {demande.cv_base64 && (
                  <button
                    onClick={() => telechargerCV(demande)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px', background: 'rgba(129, 140, 248, 0.1)',
                      border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: '10px',
                      color: '#818cf8', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                  >
                    <FaDownload size={12} /> Télécharger le CV
                    <FaFilePdf size={12} style={{ color: '#ef4444' }} />
                  </button>
                )}
              </div>

              {/* message optionnel de l'admin */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', display: 'block' }}>
                  Message (optionnel) :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bienvenue dans notre département..."
                  value={messageReponse[demande.id_demande] || ''}
                  onChange={(e) => setMessageReponse(prev => ({ ...prev, [demande.id_demande]: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', color: 'white', fontSize: '14px',
                    outline: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* boutons valider / rejeter */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => repondre(demande.id_demande, 'acceptee')}
                  disabled={enCours === demande.id_demande}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', background: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: '10px',
                    color: '#4ade80', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'inherit'
                  }}
                >
                  <FaCheck /> Valider
                </button>
                <button
                  onClick={() => repondre(demande.id_demande, 'rejetee')}
                  disabled={enCours === demande.id_demande}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px',
                    color: '#ef4444', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'inherit'
                  }}
                >
                  <FaTimes /> Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== DEMANDES TRAITÉES ===== */}
      {traitees.length > 0 && (
        <>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '40px 0 15px' }}>
            Demandes traitées
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {traitees.map((demande) => (
              <div key={demande.id_demande} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '10px'
              }}>
                <div>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
                    {demande.prenom} {demande.nom}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginLeft: '10px' }}>
                    {demande.email}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
                  background: demande.statut === 'acceptee' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: demande.statut === 'acceptee' ? '#4ade80' : '#ef4444',
                  border: `1px solid ${demande.statut === 'acceptee' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  {demande.statut === 'acceptee' ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                  {demande.statut === 'acceptee' ? 'Acceptée' : 'Rejetée'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}