import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getDepartements, getFormationsByDepartement, getEDTFormation } from '@/services/api'
import { FaCalendarAlt, FaArrowLeft, FaChalkboardTeacher, FaDoorOpen, FaClock } from 'react-icons/fa'

export default function GestionEDT() {

  const [vue, setVue] = useState('departements')
  const [departements, setDepartements] = useState([])
  const [formations, setFormations] = useState([])
  const [edtData, setEdtData] = useState(null)
  const [deptSelectionne, setDeptSelectionne] = useState(null)
  const [chargement, setChargement] = useState(true)

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  const creneaux = [
    { label: '08h20 - 10h20', debut: '08:20', fin: '10:20' },
    { label: '10h50 - 12h50', debut: '10:50', fin: '12:50' },
    { label: '14h10 - 16h10', debut: '14:10', fin: '16:10' },
    { label: '16h25 - 18h25', debut: '16:25', fin: '18:25' },
    { label: '18h30 - 20h30', debut: '18:30', fin: '20:30' },
  ]

  useEffect(() => {
    chargerDepartements()
  }, [])

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

  const voirFormations = async (dept) => {
    try {
      setChargement(true)
      setDeptSelectionne(dept)
      const data = await getFormationsByDepartement(dept)
      setFormations(data)
      setVue('formations')
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const voirEDT = async (idFormation) => {
    try {
      setChargement(true)
      const data = await getEDTFormation(idFormation)
      setEdtData(data)
      setVue('edt')
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const retour = () => {
    if (vue === 'edt') {
      setVue('formations')
      setEdtData(null)
    } else if (vue === 'formations') {
      setVue('departements')
      setDeptSelectionne(null)
    }
  }

  const getTypeStyle = (type) => {
    switch (type) {
      case 'CM': return { backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb' }
      case 'TD': return { backgroundColor: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2' }
      case 'TP': return { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }
      default: return { backgroundColor: '#f5f5f5', color: '#666' }
    }
  }

  const getCoursForSlot = (jour, creneau) => {
    if (!edtData) return null
    return edtData.cours.find(c => c.jour === jour && c.heure_debut === creneau.debut)
  }

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement...</div>
  }

  return (
    <div>
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
                style={{ color: vue === 'formations' ? '#666' : '#1a1a2e', cursor: vue === 'edt' ? 'pointer' : 'default', textDecoration: vue === 'edt' ? 'underline' : 'none' }}>
                {deptSelectionne}
              </span>
            </>
          )}
          {vue === 'edt' && edtData && (
            <>
              <span style={{ color: '#999' }}>›</span>
              <span style={{ color: '#666' }}>{edtData.formation.nom_formation}</span>
            </>
          )}
        </div>
      )}

      {/* VUE DÉPARTEMENTS */}
      {vue === 'departements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {departements.map((dept) => (
            <div key={dept.departement} onClick={() => voirFormations(dept.departement)}
              className={styles.card}
              style={{ cursor: 'pointer', padding: '25px', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <FaCalendarAlt size={30} color="#1a1a2e" />
              <h3 style={{ color: '#1a1a2e', margin: '10px 0 5px', fontSize: '17px' }}>{dept.departement}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{dept.nb_formations} formation(s)</p>
            </div>
          ))}
        </div>
      )}

      {/* VUE FORMATIONS */}
      {vue === 'formations' && (
        <div>
          <button onClick={retour} className={`${styles.button} ${styles.buttonSecondary}`} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft size={14} /> Retour
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {formations.map((f) => (
              <div key={f.id_formation} onClick={() => voirEDT(f.id_formation)}
                className={styles.card}
                style={{ cursor: 'pointer', padding: '25px', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ color: '#1a1a2e', margin: '0 0 8px', fontSize: '17px' }}>{f.nom_formation}</h3>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#e8eaf6', color: '#3949ab', fontWeight: '600' }}>
                  {f.niveau}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VUE EDT */}
      {vue === 'edt' && edtData && (
        <div>
          <button onClick={retour} className={`${styles.button} ${styles.buttonSecondary}`} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft size={14} /> Retour aux formations
          </button>

          {edtData.cours.length === 0 ? (
            <div className={styles.card} style={{ textAlign: 'center', padding: '50px' }}>
              <FaCalendarAlt size={50} color="#ccc" />
              <h4 style={{ color: '#666', marginTop: '15px' }}>Aucun cours planifié</h4>
              <p style={{ color: '#999' }}>Générez l'emploi du temps depuis la section Départements.</p>
            </div>
          ) : (
            <div className={styles.card} style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 10px', backgroundColor: '#1a1a2e', color: 'white', borderRadius: '8px 0 0 0', textAlign: 'left', fontSize: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaClock size={14} /> Créneaux</span>
                    </th>
                    {jours.map((jour, i) => (
                      <th key={jour} style={{
                        padding: '12px 10px', backgroundColor: '#1a1a2e', color: 'white',
                        textAlign: 'center', fontSize: '14px', fontWeight: '600',
                        borderRadius: i === jours.length - 1 ? '0 8px 0 0' : '0'
                      }}>
                        {jour}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creneaux.map((creneau, rowIndex) => (
                    <tr key={creneau.label}>
                      <td style={{
                        padding: '15px 10px', fontWeight: '600', fontSize: '13px', color: '#1a1a2e',
                        backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e0e0e0', whiteSpace: 'nowrap'
                      }}>
                        {creneau.label}
                      </td>
                      {jours.map((jour) => {
                        const cours = getCoursForSlot(jour, creneau)
                        return (
                          <td key={`${jour}-${creneau.debut}`} style={{
                            padding: '8px', borderBottom: '1px solid #e0e0e0',
                            backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                            verticalAlign: 'top'
                          }}>
                            {cours ? (
                              <div style={{
                                ...getTypeStyle(cours.type_cours),
                                borderRadius: '8px', padding: '10px',
                                fontSize: '12px', minHeight: '70px'
                              }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>
                                  {cours.matiere}
                                </div>
                                <span style={{
                                  display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
                                  fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.6)',
                                  marginBottom: '5px'
                                }}>
                                  {cours.type_cours}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
                                  <FaChalkboardTeacher size={10} /> {cours.enseignant}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '11px', opacity: 0.8 }}>
                                  <FaDoorOpen size={10} /> {cours.salle}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}