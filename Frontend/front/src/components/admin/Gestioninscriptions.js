import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { apiGetDemandesInscription, apiRepondreDemandeInscription } from '@/services/api'

import { 
  FaUserGraduate, FaCheck, FaTimes, FaSpinner, FaClock, 
  FaCheckCircle, FaTimesCircle, FaEnvelope, FaBuilding, FaIdBadge
} from 'react-icons/fa'

export default function GestionInscriptions() {
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [messageReponse, setMessageReponse] = useState({})
  const [enCours, setEnCours] = useState(null)

  useEffect(() => {
    chargerDemandes()
    const interval = setInterval(chargerDemandes, 10000)
    return () => clearInterval(interval)
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

  const repondre = async (idDemande, statut) => {
    setEnCours(idDemande)
    try {
      await apiRepondreDemandeInscription(idDemande, {
        statut: statut,
        message_reponse: messageReponse[idDemande] || ''
      })
      await chargerDemandes()
    } catch (err) {
      console.error('Erreur:', err)
      alert('Erreur lors de la réponse')
    } finally {
      setEnCours(null)
    }
  }

  const enAttente = demandes.filter(d => d.statut === 'en_attente')
  const traitees = demandes.filter(d => d.statut !== 'en_attente')

  if (chargement) {
    return (
      <div className={styles.pageContent}>
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
          <FaSpinner style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '15px' }}>Chargement des demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContent}>
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: '700',
          color: '#1E293B', margin: '0', display: 'flex', alignItems: 'center'
        }}>
          <FaUserGraduate style={{ marginRight: '12px', color: '#3B82F6' }} />
          Demandes d&apos;inscription
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '5px' }}>
          {enAttente.length} demande{enAttente.length > 1 ? 's' : ''} en attente
        </p>
      </div>

      {/* ===== EN ATTENTE ===== */}
      {enAttente.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '50px 20px',
          background: 'white', borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <FaCheckCircle style={{ fontSize: '40px', color: '#CBD5E1', marginBottom: '15px' }} />
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>Aucune demande en attente</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {enAttente.map((demande) => (
            <div key={demande.id_demande} style={{
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '16px', padding: '25px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.25s ease'
            }}>
              {/* en-tête */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>
                    {demande.prenom} {demande.nom}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaEnvelope size={11} /> {demande.email}
                    </span>
                    <span style={{ color: '#64748B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaBuilding size={11} /> {demande.departement || '—'}
                    </span>
                    <span style={{ color: '#64748B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaUserGraduate size={11} /> {demande.grade || '—'}
                    </span>
                  </div>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
                  background: '#FFFBEB', color: '#F59E0B',
                  border: '1px solid #FDE68A',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <FaClock size={10} /> En attente
                </span>
              </div>

              {/* code enseignant */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', marginBottom: '15px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '10px'
              }}>
                <FaIdBadge style={{ color: '#3B82F6', fontSize: '16px' }} />
                <span style={{ color: '#64748B', fontSize: '13px' }}>Code enseignant :</span>
                <span style={{
                  color: '#1E3A5F', fontSize: '18px', fontWeight: '700',
                  fontFamily: "'Sora', monospace", letterSpacing: '2px'
                }}>
                  {demande.code_enseignant}
                </span>
              </div>

              {/* date */}
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>
                  Reçue le {new Date(demande.date_demande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* message optionnel */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                  Message (optionnel) :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bienvenue dans notre département..."
                  value={messageReponse[demande.id_demande] || ''}
                  onChange={(e) => setMessageReponse(prev => ({ ...prev, [demande.id_demande]: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px', color: '#1E293B', fontSize: '14px',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'border-color 0.25s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* boutons valider / rejeter */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => repondre(demande.id_demande, 'acceptee')}
                  disabled={enCours === demande.id_demande}
                  onMouseEnter={(e) => { if (!e.target.disabled) { e.target.style.background = '#10B981'; e.target.style.color = 'white'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)' } }}
                  onMouseLeave={(e) => { e.target.style.background = '#F0FDF4'; e.target.style.color = '#10B981'; e.target.style.transform = 'none'; e.target.style.boxShadow = 'none' }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', background: '#F0FDF4',
                    border: '1px solid #BBF7D0', borderRadius: '10px',
                    color: '#10B981', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.25s ease', fontFamily: 'inherit'
                  }}
                >
                  <FaCheck /> Valider
                </button>
                <button
                  onClick={() => repondre(demande.id_demande, 'rejetee')}
                  disabled={enCours === demande.id_demande}
                  onMouseEnter={(e) => { if (!e.target.disabled) { e.target.style.background = '#EF4444'; e.target.style.color = 'white'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)' } }}
                  onMouseLeave={(e) => { e.target.style.background = '#FEF2F2'; e.target.style.color = '#EF4444'; e.target.style.transform = 'none'; e.target.style.boxShadow = 'none' }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', background: '#FEF2F2',
                    border: '1px solid #FECACA', borderRadius: '10px',
                    color: '#EF4444', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.25s ease', fontFamily: 'inherit'
                  }}
                >
                  <FaTimes /> Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== TRAITÉES ===== */}
      {traitees.length > 0 && (
        <>
          <h2 style={{
            color: '#1E293B', fontSize: '18px', fontWeight: '700', margin: '40px 0 15px',
            fontFamily: "'Sora', sans-serif"
          }}>
            Demandes traitées
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {traitees.map((demande) => (
              <div key={demande.id_demande} style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '12px', padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#1E293B', fontWeight: '600', fontSize: '15px' }}>
                    {demande.prenom} {demande.nom}
                  </span>
                  <span style={{ 
                    color: '#3B82F6', fontSize: '13px', 
                    fontFamily: "'Sora', monospace", letterSpacing: '1px',
                    fontWeight: '600'
                  }}>
                    {demande.code_enseignant}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                    {demande.email}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
                  background: demande.statut === 'acceptee' ? '#F0FDF4' : '#FEF2F2',
                  color: demande.statut === 'acceptee' ? '#10B981' : '#EF4444',
                  border: `1px solid ${demande.statut === 'acceptee' ? '#BBF7D0' : '#FECACA'}`,
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