import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getDepartements, getFormationsByDepartement, getEnseignantsByFormation, rechercherEnseignant, apiGenererEDT } from '@/services/api'
import { FaSearch, FaUsers, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaCalendarCheck, FaBook, FaArrowLeft, FaLaptopCode, FaCalculator, FaAtom, FaFlask, FaDna, FaMicrochip, FaScroll, FaBookOpen, FaGlobeAmericas, FaClock } from 'react-icons/fa'

export default function GestionDepartements() {

  const [vue, setVue] = useState('departements') // departements | formations | enseignants
  const [departements, setDepartements] = useState([])
  const [formations, setFormations] = useState([])
  const [enseignantsData, setEnseignantsData] = useState(null)
  const [deptSelectionne, setDeptSelectionne] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [resultatsRecherche, setResultatsRecherche] = useState([])
  const [rechercheActive, setRechercheActive] = useState(false)

  useEffect(() => {
    chargerDepartements()
  }, [])

  // Recherche en temps réel
  useEffect(() => {
    if (recherche.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const data = await rechercherEnseignant(recherche)
          setResultatsRecherche(data)
          setRechercheActive(true)
        } catch (err) {
          console.error(err)
        }
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setResultatsRecherche([])
      setRechercheActive(false)
    }
  }, [recherche])

  const chargerDepartements = async () => {
    try {
      setChargement(true)
      const data = await getDepartements()
      setDepartements(data)
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const voirFormations = async (departement) => {
    try {
      setChargement(true)
      setDeptSelectionne(departement)
      const data = await getFormationsByDepartement(departement)
      setFormations(data)
      setVue('formations')
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const voirEnseignants = async (idFormation) => {
    try {
      setChargement(true)
      const data = await getEnseignantsByFormation(idFormation)
      setEnseignantsData(data)
      setVue('enseignants')
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const retour = () => {
    if (vue === 'enseignants') {
      setVue('formations')
      setEnseignantsData(null)
    } else if (vue === 'formations') {
      setVue('departements')
      setDeptSelectionne(null)
    }
  }

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'pret':
        return { icon: <FaCheckCircle size={14} />, label: 'Prêt', bg: '#e8f5e9', color: '#388e3c' }
      case 'matieres_ok':
        return { icon: <FaExclamationTriangle size={14} />, label: 'Disponibilités manquantes', bg: '#fff3e0', color: '#f57c00' }
      default:
        return { icon: <FaTimesCircle size={14} />, label: 'Incomplet', bg: '#ffebee', color: '#d32f2f' }
    }
  }

  const deptIcons = {
    'Informatique': <FaLaptopCode size={36} color="#1a1a2e" />,
    'Mathématiques': <FaCalculator size={36} color="#1a1a2e" />,
    'Physique': <FaAtom size={36} color="#1a1a2e" />,
    'Chimie': <FaFlask size={36} color="#1a1a2e" />,
    'Biologie': <FaDna size={36} color="#1a1a2e" />,
    'Électronique': <FaMicrochip size={36} color="#1a1a2e" />,
    'Histoire': <FaScroll size={36} color="#1a1a2e" />,
    'Lettres': <FaBookOpen size={36} color="#1a1a2e" />,
    'Géographie': <FaGlobeAmericas size={36} color="#1a1a2e" />
  }

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement...</div>
  }

  return (
    <div>
      {/* Barre de recherche */}
      <div className={styles.card} style={{ marginBottom: '20px', position: 'relative' }}>
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un enseignant (nom, prénom ou email)..."
          className={styles.input}
          style={{ fontSize: '15px', padding: '12px 15px' }}
        />
        {rechercheActive && resultatsRecherche.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
            backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '0 0 10px 10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '300px', overflowY: 'auto'
          }}>
            {resultatsRecherche.map((ens) => (
              <div key={ens.id_enseignant} style={{
                padding: '12px 15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: '600', color: '#1a1a2e' }}>
                  {ens.prenom} {ens.nom}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {ens.email} — {ens.departement}
                </div>
                {ens.formations.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '3px' }}>
                    Formations : {ens.formations.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {rechercheActive && resultatsRecherche.length === 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
            backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '0 0 10px 10px',
            padding: '15px', textAlign: 'center', color: '#999'
          }}>
            Aucun enseignant trouvé
          </div>
        )}
      </div>

      {/* Fil d'Ariane */}
      {vue !== 'departements' && (
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <span onClick={() => { setVue('departements'); setDeptSelectionne(null) }}
            style={{ color: '#1a1a2e', cursor: 'pointer', textDecoration: 'underline' }}>
            Départements
          </span>
          {deptSelectionne && (
            <>
              <span style={{ color: '#999' }}>›</span>
              <span onClick={() => setVue('formations')}
                style={{ color: vue === 'formations' ? '#666' : '#1a1a2e', cursor: vue === 'enseignants' ? 'pointer' : 'default', textDecoration: vue === 'enseignants' ? 'underline' : 'none' }}>
                {deptSelectionne}
              </span>
            </>
          )}
          {vue === 'enseignants' && enseignantsData && (
            <>
              <span style={{ color: '#999' }}>›</span>
              <span style={{ color: '#666' }}>{enseignantsData.formation.nom_formation}</span>
            </>
          )}
        </div>
      )}

      {/* VUE DÉPARTEMENTS */}
      {vue === 'departements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {departements.map((dept) => (
            <div
              key={dept.departement}
              onClick={() => voirFormations(dept.departement)}
              className={styles.card}
              style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', padding: '25px' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ marginBottom: '12px' }}>
                {deptIcons[dept.departement] || <FaBook size={36} color="#1a1a2e" />}
              </div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '10px', fontSize: '18px' }}>
                {dept.departement}
              </h3>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaBook size={14} /> {dept.nb_formations} formation(s)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaUsers size={14} /> {dept.nb_enseignants} enseignant(s)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VUE FORMATIONS */}
      {vue === 'formations' && (
        <div>
          <button onClick={retour} className={`${styles.button} ${styles.buttonSecondary}`} style={{ marginBottom: '20px' }}>
            <FaArrowLeft size={14} /> Retour aux départements
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {formations.map((f) => (
              <div
                key={f.id_formation}
                onClick={() => voirEnseignants(f.id_formation)}
                className={styles.card}
                style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '25px' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ color: '#1a1a2e', fontSize: '17px', margin: 0 }}>
                    {f.nom_formation}
                  </h3>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                    backgroundColor: '#e8eaf6', color: '#3949ab', fontWeight: '600'
                  }}>
                    {f.niveau}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Semestre {f.semestre_actuel}
                </div>
                <div style={{ marginTop: '15px', fontSize: '13px', color: '#1a1a2e', fontWeight: '500' }}>
                  Voir les enseignants →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VUE ENSEIGNANTS */}
      {vue === 'enseignants' && enseignantsData && (
        <div>
          <button onClick={retour} className={`${styles.button} ${styles.buttonSecondary}`} style={{ marginBottom: '20px' }}>
            <FaArrowLeft size={14} /> Retour aux formations
          </button>

          {/* Stats */}
          <div className={styles.statsGrid} style={{ marginBottom: '20px' }}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconBlue}`}><FaUsers size={20} /></div>
              <div className={styles.statInfo}>
                <h3>{enseignantsData.enseignants.length}</h3>
                <p>Enseignants</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}><FaCheckCircle size={20} /></div>
              <div className={styles.statInfo}>
                <h3>{enseignantsData.enseignants.filter(e => e.statut_pret === 'pret').length}</h3>
                <p>Prêts</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconOrange}`}><FaExclamationTriangle size={20} /></div>
              <div className={styles.statInfo}>
                <h3>{enseignantsData.enseignants.filter(e => e.statut_pret === 'matieres_ok').length}</h3>
                <p>Dispos manquantes</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                {enseignantsData.tous_prets ? <FaCheckCircle size={20} /> : <FaClock size={20} />}
              </div>
              <div className={styles.statInfo}>
                <h3>{enseignantsData.tous_prets ? 'Oui' : 'Non'}</h3>
                <p>Tous prêts ?</p>
              </div>
            </div>
          </div>

          {/* Bouton générer EDT si tous prêts */}
          {enseignantsData.tous_prets && (
            <div className={styles.card} style={{ 
              marginBottom: '20px', padding: '20px', textAlign: 'center',
              backgroundColor: '#e8f5e9', border: '2px solid #4caf50'
            }}>
              <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '10px', fontSize: '16px' }}>
                ✅ Tous les enseignants sont prêts !
              </p>
              <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                Vous pouvez générer l'emploi du temps pour {enseignantsData.formation.nom_formation}
              </p>
              <button 
                onClick={async () => {
                  try {
                    const res = await apiGenererEDT(enseignantsData.formation.id_formation)
                    alert(`${res.detail}\n${res.erreurs.length > 0 ? '\nAvertissements :\n' + res.erreurs.join('\n') : ''}`)
                  } catch (err) {
                    alert(err.message)
                  }
                }}
                className={`${styles.button} ${styles.buttonSuccess}`} 
                style={{ fontSize: '16px', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaCalendarCheck size={18} /> Générer l'emploi du temps
              </button>
            </div>
          )}

          {/* Liste des enseignants */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                Enseignants — {enseignantsData.formation.nom_formation}
              </h3>
            </div>

            {enseignantsData.enseignants.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👥</div>
                <h4 className={styles.emptyTitle}>Aucun enseignant</h4>
                <p className={styles.emptyText}>Aucun enseignant n'a encore choisi de matières dans cette formation.</p>
              </div>
            ) : (
              <div className={styles.demandesList}>
                {enseignantsData.enseignants.map((ens) => {
                  const badge = getStatutBadge(ens.statut_pret)
                  return (
                    <div key={ens.id_enseignant} className={styles.demandeItem} style={{ alignItems: 'center' }}>
                      <div style={{
                        width: '45px', height: '45px', borderRadius: '50%',
                        backgroundColor: '#1a1a2e', color: 'white', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                        fontSize: '16px', flexShrink: 0
                      }}>
                        {ens.prenom[0]}{ens.nom[0]}
                      </div>
                      <div className={styles.demandeContent}>
                        <div className={styles.demandeHeader}>
                          <div>
                            <div className={styles.demandeTitre}>{ens.prenom} {ens.nom}</div>
                            <div className={styles.demandeAuteur}>
                              {ens.email} {ens.grade && `— ${ens.grade}`}
                            </div>
                          </div>
                          <span style={{
                            padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                            fontWeight: '600', backgroundColor: badge.bg, color: badge.color
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{badge.icon} {badge.label}</span>
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666', marginTop: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaBook size={13} /> {ens.nb_matieres} matière(s)</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaClock size={13} /> {ens.nb_dispos} créneau(x) de disponibilité</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}