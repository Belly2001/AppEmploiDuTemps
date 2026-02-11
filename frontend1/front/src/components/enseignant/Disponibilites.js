import { useState } from 'react'
import styles from '@/styles/Enseignant.module.css'

export default function Disponibilites({ enseignant }) {
  
  // Liste des disponibilités (simulation, viendra de l'API plus tard)
  const [disponibilites, setDisponibilites] = useState([
    { id: 1, jour: 'Lundi', heureDebut: '08:00', heureFin: '12:00', commentaire: 'Matinée libre' },
    { id: 2, jour: 'Mercredi', heureDebut: '14:00', heureFin: '18:00', commentaire: 'Après-midi disponible' }
  ])

  // État du formulaire pour ajouter une nouvelle dispo
  const [nouvelleDispo, setNouvelleDispo] = useState({
    jour: '',
    heureDebut: '',
    heureFin: '',
    commentaire: ''
  })

  // Messages de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Liste des jours de la semaine
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouvelleDispo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Ajouter une nouvelle disponibilité
  const ajouterDisponibilite = (e) => {
    e.preventDefault()

    // Vérifications
    if (!nouvelleDispo.jour || !nouvelleDispo.heureDebut || !nouvelleDispo.heureFin) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir le jour et les horaires' })
      return
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (nouvelleDispo.heureDebut >= nouvelleDispo.heureFin) {
      setMessage({ type: 'erreur', texte: "L'heure de fin doit être après l'heure de début" })
      return
    }

    // Créer la nouvelle dispo avec un ID temporaire
    const newDispo = {
      id: Date.now(), // ID temporaire, sera remplacé par l'ID de la BDD
      ...nouvelleDispo
    }

    // Ajouter à la liste
    setDisponibilites(prev => [...prev, newDispo])

    // Réinitialiser le formulaire
    setNouvelleDispo({ jour: '', heureDebut: '', heureFin: '', commentaire: '' })

    // Message de succès
    setMessage({ type: 'succes', texte: 'Disponibilité ajoutée avec succès !' })

    // Effacer le message après 3 secondes
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API pour sauvegarder en BDD
    console.log('Nouvelle dispo à envoyer à l\'API:', newDispo)
  }

  // Supprimer une disponibilité
  const supprimerDisponibilite = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette disponibilité ?')) {
      setDisponibilites(prev => prev.filter(d => d.id !== id))
      setMessage({ type: 'succes', texte: 'Disponibilité supprimée' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

      // TODO: Appel API pour supprimer en BDD
      console.log('Dispo à supprimer (id):', id)
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
          {/* Ligne 1 : Jour + Heures */}
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
                name="heureDebut"
                value={nouvelleDispo.heureDebut}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Heure de fin</label>
              <input
                type="time"
                name="heureFin"
                value={nouvelleDispo.heureFin}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Ligne 2 : Commentaire */}
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

          {/* Bouton */}
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
              <div key={dispo.id} className={styles.dispoItem}>
                <div className={styles.dispoInfo}>
                  <span className={styles.dispoJour}>{dispo.jour}</span>
                  <span className={styles.dispoHeure}>
                    {dispo.heureDebut} - {dispo.heureFin}
                  </span>
                  {dispo.commentaire && (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>
                      {dispo.commentaire}
                    </span>
                  )}
                </div>
                <div className={styles.dispoActions}>
                  <button
                    onClick={() => supprimerDisponibilite(dispo.id)}
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