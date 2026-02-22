import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getDisponibilites, apiAjouterDisponibilite, apiSupprimerDisponibilite } from '@/services/api'
import { FaCheckCircle, FaClock, FaSave, FaTrash } from 'react-icons/fa'

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
  const [chargement, setChargement] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', texte: '' })

  useEffect(() => {
    if (enseignant && enseignant.id) {
      chargerDisponibilites()
    }
  }, [enseignant])

  const chargerDisponibilites = async () => {
    try {
      setChargement(true)
      const data = await getDisponibilites(enseignant.id)
      setDisponibilites(data)
    } catch (err) {
      console.error('Erreur chargement disponibilités:', err)
    } finally {
      setChargement(false)
    }
  }

  // Vérifie si un créneau est coché
  const estCoche = (jour, debut, fin) => {
    return disponibilites.some(d =>
      d.jour === jour &&
      d.heure_debut === debut + ':00' &&
      d.heure_fin === fin + ':00'
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

  // Toggle un créneau
  const toggleCreneau = async (jour, creneau) => {
    const coche = estCoche(jour, creneau.debut, creneau.fin)

    try {
      setSaving(true)
      if (coche) {
        // Supprimer
        const id = getDispoId(jour, creneau.debut, creneau.fin)
        if (id) {
          await apiSupprimerDisponibilite(id)
        }
      } else {
        // Ajouter
        await apiAjouterDisponibilite(enseignant.id, {
          jour: jour,
          heure_debut: creneau.debut,
          heure_fin: creneau.fin,
          type_disponibilite: 'Disponible',
          commentaire: ''
        })
      }
      await chargerDisponibilites()
    } catch (err) {
      console.error('Erreur toggle créneau:', err)
      setMessage({ type: 'erreur', texte: 'Erreur lors de la mise à jour' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Tout cocher un jour
  const toutCocherJour = async (jour) => {
    const tousCoches = creneaux.every(c => estCoche(jour, c.debut, c.fin))
    
    try {
      setSaving(true)
      if (tousCoches) {
        // Tout décocher
        for (const c of creneaux) {
          const id = getDispoId(jour, c.debut, c.fin)
          if (id) await apiSupprimerDisponibilite(id)
        }
      } else {
        // Cocher les manquants
        for (const c of creneaux) {
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
      await chargerDisponibilites()
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  // Tout cocher un créneau (même heure tous les jours)
  const toutCocherCreneau = async (creneau) => {
    const tousCoches = jours.every(j => estCoche(j, creneau.debut, creneau.fin))
    
    try {
      setSaving(true)
      if (tousCoches) {
        for (const j of jours) {
          const id = getDispoId(j, creneau.debut, creneau.fin)
          if (id) await apiSupprimerDisponibilite(id)
        }
      } else {
        for (const j of jours) {
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
      await chargerDisponibilites()
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  const nbCoches = disponibilites.length
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
              Cliquez sur les créneaux où vous êtes disponible
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{
              padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600',
              backgroundColor: nbCoches > 0 ? '#e8f5e9' : '#fff3e0',
              color: nbCoches > 0 ? '#388e3c' : '#f57c00',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <FaCheckCircle size={14} />
              {nbCoches} / {nbTotal} créneaux sélectionnés
            </span>
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
            <FaCheckCircle size={16} color="#388e3c" /> Disponible
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ccc' }} /> Non renseigné
          </span>
          <span>Astuce : cliquez sur un jour ou un créneau pour tout cocher/décocher</span>
        </div>
      </div>
    </div>
  )
}