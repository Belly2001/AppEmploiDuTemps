import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getDisponibilites, apiAjouterDisponibilite, apiSupprimerDisponibilite } from '@/services/api'

export default function Disponibilites({ enseignant }) {
  
  const [disponibilites, setDisponibilites] = useState([])
  const [chargement, setChargement] = useState(true)

  const [nouvelleDispo, setNouvelleDispo] = useState({
    jour: '',
    heure_debut: '',
    heure_fin: '',
    commentaire: ''
  })

  const [message, setMessage] = useState({ type: '', texte: '' })

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  // Charger les disponibilités depuis la base
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
      setMessage({ type: 'erreur', texte: 'Impossible de charger les disponibilités' })
    } finally {
      setChargement(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNouvelleDispo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Ajouter une disponibilité — sauvegardée en base
  const ajouterDisponibilite = async (e) => {
    e.preventDefault()

    if (!nouvelleDispo.jour || !nouvelleDispo.heure_debut || !nouvelleDispo.heure_fin) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir le jour et les horaires' })
      return
    }

    if (nouvelleDispo.heure_debut >= nouvelleDispo.heure_fin) {
      setMessage({ type: 'erreur', texte: "L'heure de fin doit être après l'heure de début" })
      return
    }

    try {
      await apiAjouterDisponibilite(enseignant.id, {
        jour: nouvelleDispo.jour,
        heure_debut: nouvelleDispo.heure_debut,
        heure_fin: nouvelleDispo.heure_fin,
        type_disponibilite: 'Disponible',
        commentaire: nouvelleDispo.commentaire || ''
      })
      await chargerDisponibilites()
      setNouvelleDispo({ jour: '', heure_debut: '', heure_fin: '', commentaire: '' })
      setMessage({ type: 'succes', texte: 'Disponibilité ajoutée et sauvegardée !' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    } catch (err) {
      console.error('Erreur ajout:', err)
      setMessage({ type: 'erreur', texte: "Erreur lors de l'ajout de la disponibilité" })
    }
  }

  // Supprimer une disponibilité — supprimée en base
  const supprimerDisponibilite = async (id_disponibilite) => {
    if (confirm('Voulez-vous vraiment supprimer cette disponibilité ?')) {
      try {
        await apiSupprimerDisponibilite(id_disponibilite)
        await chargerDisponibilites()
        setMessage({ type: 'succes', texte: 'Disponibilité supprimée' })
        setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
      } catch (err) {
        console.error('Erreur suppression:', err)
        setMessage({ type: 'erreur', texte: 'Erreur lors de la suppression' })
      }
    }
  }

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

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Ajouter une disponibilité</h3>
        </div>

        <form onSubmit={ajouterDisponibilite}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Jour</label>
              <select
                name="jour"
                value={nouvelleDispo.jour}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">-- Choisir un jour --</option>
                {jours.map((jour) => (
                  <option key={jour} value={jour}>{jour}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Heure de début</label>
              <input
                type="time"
                name="heure_debut"
                value={nouvelleDispo.heure_debut}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Heure de fin</label>
              <input
                type="time"
                name="heure_fin"
                value={nouvelleDispo.heure_fin}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Commentaire (optionnel)</label>
            <input
              type="text"
              name="commentaire"
              value={nouvelleDispo.commentaire}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: Préférence pour les TP, disponible uniquement pour cette période..."
            />
          </div>

          <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
            Ajouter cette disponibilité
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Mes disponibilités actuelles</h3>
          <span>{disponibilites.length} créneau(x)</span>
        </div>

        {disponibilites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h4 className={styles.emptyTitle}>Aucune disponibilité</h4>
            <p className={styles.emptyText}>
              Ajoutez vos créneaux disponibles pour que l'administration puisse vous assigner des cours.
            </p>
          </div>
        ) : (
          <div className={styles.dispoList}>
            {disponibilites.map((dispo) => (
              <div key={dispo.id_disponibilite} className={styles.dispoItem}>
                <div className={styles.dispoInfo}>
                  <span className={styles.dispoJour}>{dispo.jour}</span>
                  <span className={styles.dispoHeure}>
                    {dispo.heure_debut} - {dispo.heure_fin}
                  </span>
                  {dispo.commentaire && (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>
                      {dispo.commentaire}
                    </span>
                  )}
                </div>
                <div className={styles.dispoActions}>
                  <button
                    onClick={() => supprimerDisponibilite(dispo.id_disponibilite)}
                    className={styles.deleteButton}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}