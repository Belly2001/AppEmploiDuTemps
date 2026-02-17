import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'

export default function Disponibilites({ enseignant }) {
  
  // Liste des disponibilités
  // NOTE : Le backend n'a pas encore de route pour les disponibilités
  // Les données sont gérées localement pour l'instant
  const [disponibilites, setDisponibilites] = useState([])
  const [chargement, setChargement] = useState(false)

  // État du formulaire pour ajouter une nouvelle dispo
  // Noms des champs = noms dans le modèle Django (disponibilite)
  const [nouvelleDispo, setNouvelleDispo] = useState({
    jour: '',
    heure_debut: '',
    heure_fin: '',
    commentaire: ''
  })

  // Messages de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Liste des jours de la semaine
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  // TODO: Charger les disponibilités depuis l'API quand la route sera prête
  // useEffect(() => {
  //   if (enseignant && enseignant.id_enseignant) {
  //     fetch(`http://localhost:8000/schedule/enseignant/${enseignant.id_enseignant}/disponibilites/`)
  //       .then(res => res.json())
  //       .then(data => setDisponibilites(data))
  //       .catch(err => console.error(err))
  //   }
  // }, [enseignant])

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouvelleDispo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Ajouter une nouvelle disponibilité
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

    const newDispo = {
      id_disponibilite: Date.now(), // ID temporaire
      ...nouvelleDispo
    }

    // TODO: Envoyer à l'API quand la route sera prête
    // try {
    //   const res = await fetch(`http://localhost:8000/schedule/enseignant/${enseignant.id_enseignant}/disponibilites/`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       id_enseignant: enseignant.id_enseignant,
    //       jour: nouvelleDispo.jour,
    //       heure_debut: nouvelleDispo.heure_debut,
    //       heure_fin: nouvelleDispo.heure_fin,
    //       commentaire: nouvelleDispo.commentaire,
    //       type_disponibilite: 'Disponible'
    //     })
    //   })
    //   if (res.ok) { ... }
    // } catch (err) { ... }

    setDisponibilites(prev => [...prev, newDispo])
    setNouvelleDispo({ jour: '', heure_debut: '', heure_fin: '', commentaire: '' })
    setMessage({ type: 'succes', texte: 'Disponibilité ajoutée (locale, pas encore sauvegardée en BDD)' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
  }

  // Supprimer une disponibilité
  const supprimerDisponibilite = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette disponibilité ?')) {
      setDisponibilites(prev => prev.filter(d => d.id_disponibilite !== id))
      setMessage({ type: 'succes', texte: 'Disponibilité supprimée' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    }
  }

  return (
    <div>
      {/* Message de feedback */}
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Section : Ajouter une disponibilité */}
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

      {/* Section : Liste des disponibilités */}
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