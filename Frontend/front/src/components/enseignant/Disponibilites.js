import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getDisponibilites, apiAjouterDisponibilite, apiSupprimerDisponibilite, getCreneauxOccupes } from '@/services/api'
import { FaCheckCircle, FaClock, FaSave, FaLock } from 'react-icons/fa'

export default function Disponibilites({ enseignant }) {

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']

  const creneaux = [
    { label: '08h20 - 10h20', debut: '08:20', fin: '10:20' },
    { label: '10h50 - 12h50', debut: '10:50', fin: '12:50' },
    { label: '14h10 - 16h10', debut: '14:10', fin: '16:10' },
    { label: '16h25 - 18h25', debut: '16:25', fin: '18:25' },
    { label: '18h30 - 20h30', debut: '18:30', fin: '20:30' },
  ]

  const [disponibilites, setDisponibilites] = useState([])
  const [creneauxOccupes, setCreneauxOccupes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', texte: '' })

  useEffect(() => {
    if (enseignant && enseignant.id) {
      chargerTout()
    }
  }, [enseignant])

  // Charger les disponibilités de l'enseignant ET les créneaux occupés par les autres
  const chargerTout = async () => {
    try {
      setChargement(true)
      const [mesDispos, tousLesCreneaux] = await Promise.all([
        getDisponibilites(enseignant.id),
        getCreneauxOccupes(enseignant.id)
      ])
      setDisponibilites(mesDispos)
      // Filtrer pour ne garder que les créneaux des AUTRES enseignants
      const creneauxAutres = tousLesCreneaux.filter(c => c.id_enseignant !== enseignant.id)
      setCreneauxOccupes(creneauxAutres)
    } catch (err) {
      console.error('Erreur chargement:', err)
    } finally {
      setChargement(false)
    }
  }

  // Vérifie si un créneau est coché par MOI
  const estCoche = (jour, debut, fin) => {
    return disponibilites.some(d =>
      d.jour === jour &&
      d.heure_debut === debut + ':00' &&
      d.heure_fin === fin + ':00'
    )
  }

  // Vérifie si un créneau est pris par un AUTRE enseignant
  const estOccupe = (jour, debut, fin) => {
    return creneauxOccupes.find(c =>
      c.jour === jour &&
      c.heure_debut === debut + ':00' &&
      c.heure_fin === fin + ':00'
    )
  }

  // Trouver l'id d'une dispo existante
  const getDispoId = (jour, debut, fin) => {
    const dispo = disponibilites.find(d =>
      d.jour === jour &&
      d.heure_debut === debut + ':00' &&
      d.heure_fin === fin + ':00'
    )
    return dispo ? dispo.id_disponibilite : null
  }

  // Toggle un créneau (seulement si pas occupé par un autre)
  const toggleCreneau = async (jour, creneau) => {
    // Vérifier si le créneau est pris par quelqu'un d'autre
    const occupe = estOccupe(jour, creneau.debut, creneau.fin)
    if (occupe) {
      setMessage({ 
        type: 'erreur', 
        texte: `Ce créneau est déjà pris par ${occupe.nom_enseignant}` 
      })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
      return
    }

    const coche = estCoche(jour, creneau.debut, creneau.fin)

    try {
      setSaving(true)
      if (coche) {
        const id = getDispoId(jour, creneau.debut, creneau.fin)
        if (id) {
          await apiSupprimerDisponibilite(id)
        }
      } else {
        await apiAjouterDisponibilite(enseignant.id, {
          jour: jour,
          heure_debut: creneau.debut,
          heure_fin: creneau.fin,
          type_disponibilite: 'Disponible',
          commentaire: ''
        })
      }
      await chargerTout()
    } catch (err) {
      console.error('Erreur toggle créneau:', err)
      setMessage({ type: 'erreur', texte: 'Erreur lors de la mise à jour' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Tout cocher un jour (en ignorant les créneaux occupés)
  const toutCocherJour = async (jour) => {
    const creneauxLibres = creneaux.filter(c => !estOccupe(jour, c.debut, c.fin))
    const tousCoches = creneauxLibres.every(c => estCoche(jour, c.debut, c.fin))
    
    try {
      setSaving(true)
      if (tousCoches) {
        for (const c of creneauxLibres) {
          const id = getDispoId(jour, c.debut, c.fin)
          if (id) await apiSupprimerDisponibilite(id)
        }
      } else {
        for (const c of creneauxLibres) {
          if (!estCoche(jour, c.debut, c.fin)) {
            await apiAjouterDisponibilite(enseignant.id, {
              jour: jour,
              heure_debut: c.debut,
              heure_fin: c.fin,
              type_disponibilite: 'Disponible',
              commentaire: ''
            })
          }
        }
      }
      await chargerTout()
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  // Tout cocher un créneau (en ignorant les jours occupés)
  const toutCocherCreneau = async (creneau) => {
    const joursLibres = jours.filter(j => !estOccupe(j, creneau.debut, creneau.fin))
    const tousCoches = joursLibres.every(j => estCoche(j, creneau.debut, creneau.fin))
    
    try {
      setSaving(true)
      if (tousCoches) {
        for (const j of joursLibres) {
          const id = getDispoId(j, creneau.debut, creneau.fin)
          if (id) await apiSupprimerDisponibilite(id)
        }
      } else {
        for (const j of joursLibres) {
          if (!estCoche(j, creneau.debut, creneau.fin)) {
            await apiAjouterDisponibilite(enseignant.id, {
              jour: j,
              heure_debut: creneau.debut,
              heure_fin: creneau.fin,
              type_disponibilite: 'Disponible',
              commentaire: ''
            })
          }
        }
      }
      await chargerTout()
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  const nbCoches = disponibilites.length
  const nbOccupes = creneauxOccupes.length
  const nbTotal = jours.length * creneaux.length

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement des disponibilités...</div>
  }

  return (
    <div>
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Stats */}
      <div className={styles.card} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: '18px' }}>
              Mes disponibilités
            </h3>
            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
              Cliquez sur les créneaux où vous êtes disponible. Les créneaux grisés sont déjà pris.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600',
              backgroundColor: nbCoches > 0 ? '#e8f5e9' : '#fff3e0',
              color: nbCoches > 0 ? '#388e3c' : '#f57c00',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <FaCheckCircle size={14} />
              {nbCoches} sélectionné(s)
            </span>
            {nbOccupes > 0 && (
              <span style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600',
                backgroundColor: '#f5f5f5', color: '#999',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <FaLock size={12} />
                {nbOccupes} occupé(s)
              </span>
            )}
            {saving && (
              <span style={{ color: '#999', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaSave size={13} /> Enregistrement...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grille des créneaux */}
      <div className={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{
                  padding: '12px 15px', textAlign: 'left', backgroundColor: '#1a1a2e',
                  color: 'white', borderRadius: '8px 0 0 0', fontSize: '14px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaClock size={14} /> Créneaux
                  </span>
                </th>
                {jours.map((jour, i) => (
                  <th
                    key={jour}
                    onClick={() => toutCocherJour(jour)}
                    style={{
                      padding: '12px 10px', textAlign: 'center', backgroundColor: '#1a1a2e',
                      color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                      borderRadius: i === jours.length - 1 ? '0 8px 0 0' : '0',
                      transition: 'background-color 0.2s'
                    }}
                    title={`Cliquez pour tout cocher/décocher ${jour}`}
                  >
                    {jour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creneaux.map((creneau, rowIndex) => (
                <tr key={creneau.label}>
                  <td
                    onClick={() => toutCocherCreneau(creneau)}
                    style={{
                      padding: '15px', fontWeight: '600', color: '#1a1a2e',
                      backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                      cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap',
                      borderBottom: '1px solid #e0e0e0'
                    }}
                    title="Cliquez pour tout cocher/décocher ce créneau"
                  >
                    {creneau.label}
                  </td>
                  {jours.map((jour) => {
                    const coche = estCoche(jour, creneau.debut, creneau.fin)
                    const occupe = estOccupe(jour, creneau.debut, creneau.fin)

                    // CRÉNEAU OCCUPÉ PAR UN AUTRE ENSEIGNANT
                    if (occupe) {
                      return (
                        <td
                          key={`${jour}-${creneau.debut}`}
                          style={{
                            padding: '10px', textAlign: 'center',
                            backgroundColor: '#f0f0f0',
                            cursor: 'not-allowed',
                            borderBottom: '1px solid #e0e0e0',
                          }}
                          title={`Pris par ${occupe.nom_enseignant}`}
                        >
                          <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '4px'
                          }}>
                            <FaLock size={16} color="#bbb" />
                            <span style={{ 
                              fontSize: '10px', color: '#999', 
                              maxWidth: '80px', overflow: 'hidden',
                              textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                              {occupe.nom_enseignant}
                            </span>
                          </div>
                        </td>
                      )
                    }

                    // CRÉNEAU LIBRE OU MON CRÉNEAU
                    return (
                      <td
                        key={`${jour}-${creneau.debut}`}
                        onClick={() => !saving && toggleCreneau(jour, creneau)}
                        style={{
                          padding: '15px', textAlign: 'center',
                          backgroundColor: coche
                            ? '#e8f5e9'
                            : rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                          cursor: saving ? 'wait' : 'pointer',
                          borderBottom: '1px solid #e0e0e0',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {coche ? (
                          <FaCheckCircle size={22} color="#388e3c" />
                        ) : (
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            border: '2px solid #ccc', margin: '0 auto'
                          }} />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div style={{ 
          marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', 
          borderRadius: '8px', display: 'flex', gap: '25px', flexWrap: 'wrap',
          fontSize: '13px', color: '#666'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaCheckCircle size={16} color="#388e3c" /> Mon créneau
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ccc' }} /> Libre
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaLock size={14} color="#bbb" /> Pris par un autre enseignant
          </span>
          <span>Astuce : cliquez sur un jour ou un créneau pour tout cocher/décocher</span>
        </div>
      </div>
    </div>
  )
}