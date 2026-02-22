import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getEDTPersonnel } from '@/services/api'
import { FaCalendarAlt, FaChalkboardTeacher, FaDoorOpen, FaClock } from 'react-icons/fa'

export default function EmploiDuTemps({ enseignant }) {

  const [cours, setCours] = useState([])
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
    if (enseignant && enseignant.id) {
      chargerEDT()
    }
  }, [enseignant])

  const chargerEDT = async () => {
    try {
      setChargement(true)
      const data = await getEDTPersonnel(enseignant.id)
      setCours(data)
    } catch (err) {
      console.error('Erreur chargement EDT:', err)
    } finally {
      setChargement(false)
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
    return cours.find(c => c.jour === jour && c.heure_debut === creneau.debut + ':00')
  }

  // Compter les cours par type
  const nbCM = cours.filter(c => c.type_cours === 'CM').length
  const nbTD = cours.filter(c => c.type_cours === 'TD').length
  const nbTP = cours.filter(c => c.type_cours === 'TP').length

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement de l'emploi du temps...</div>
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>{cours.length}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Total cours</div>
        </div>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1565c0' }}>{nbCM}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>CM</div>
        </div>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#e65100' }}>{nbTD}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>TD</div>
        </div>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2e7d32' }}>{nbTP}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>TP</div>
        </div>
      </div>

      {cours.length === 0 ? (
        <div className={styles.card} style={{ textAlign: 'center', padding: '50px' }}>
          <FaCalendarAlt size={50} color="#ccc" />
          <h4 style={{ color: '#666', marginTop: '15px' }}>Aucun cours assigné</h4>
          <p style={{ color: '#999' }}>
            Votre emploi du temps sera disponible une fois que l'administration l'aura généré.
          </p>
        </div>
      ) : (
        <div className={styles.card} style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
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
                    const c = getCoursForSlot(jour, creneau)
                    return (
                      <td key={`${jour}-${creneau.debut}`} style={{
                        padding: '8px', borderBottom: '1px solid #e0e0e0',
                        backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        verticalAlign: 'top'
                      }}>
                        {c ? (
                          <div style={{
                            ...getTypeStyle(c.type_cours),
                            borderRadius: '8px', padding: '10px',
                            fontSize: '12px', minHeight: '60px'
                          }}>
                            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>
                              {c.cours_intitule || c.matiere_nom || 'Cours'}
                            </div>
                            <span style={{
                              display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
                              fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.6)',
                              marginBottom: '5px'
                            }}>
                              {c.type_cours}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
                              <FaDoorOpen size={10} /> {c.salle_nom || '—'}
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
  )
}