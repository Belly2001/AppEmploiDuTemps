import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getSalles } from '@/services/api'

export default function GestionSalles() {
  
  // Liste des salles — chargée depuis l'API
  const [salles, setSalles] = useState([])
  const [chargement, setChargement] = useState(true)

  // État pour le modal d'ajout
  const [modalOuvert, setModalOuvert] = useState(false)

  // État pour le formulaire
  const [nouvelleSalle, setNouvelleSalle] = useState({
    nom_salle: '',
    capacite: '',
    type_salle: '',
    localisation: ''
  })

  // Message de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Recherche
  const [recherche, setRecherche] = useState('')

  // Types de salles
  const typesSalles = ['Informatique', 'Cours', 'Amphithéâtre', 'TP', 'TD', 'Laboratoire']

  // Charger les salles au démarrage
  useEffect(() => {
    chargerSalles()
  }, [])

  const chargerSalles = async () => {
    try {
      setChargement(true)
      const data = await getSalles()
      setSalles(data)
    } catch (err) {
      console.error('Erreur chargement salles:', err)
      setMessage({ type: 'erreur', texte: 'Impossible de charger les salles' })
    } finally {
      setChargement(false)
    }
  }

  // Filtrer les salles
  // Backend envoie : nom_salle, type_salle, localisation
  const sallesFiltrees = salles.filter(s =>
    (s.nom_salle || '').toLowerCase().includes(recherche.toLowerCase()) ||
    (s.type_salle || '').toLowerCase().includes(recherche.toLowerCase()) ||
    (s.localisation || '').toLowerCase().includes(recherche.toLowerCase())
  )

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouvelleSalle(prev => ({ ...prev, [name]: value }))
  }

  // Ajouter une salle
  // NOTE : Le backend n'a pas encore de route POST pour les salles
  // Pour l'instant on ajoute localement
  const ajouterSalle = async (e) => {
    e.preventDefault()

    if (!nouvelleSalle.nom_salle || !nouvelleSalle.capacite) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir le nom et la capacité' })
      return
    }

    // TODO: Remplacer par un appel API quand la route POST sera prête
    const newSalle = {
      id_salle: Date.now(), // ID temporaire
      nom_salle: nouvelleSalle.nom_salle,
      capacite: parseInt(nouvelleSalle.capacite),
      type_salle: nouvelleSalle.type_salle,
      localisation: nouvelleSalle.localisation
    }

    setSalles(prev => [...prev, newSalle])
    setNouvelleSalle({ nom_salle: '', capacite: '', type_salle: '', localisation: '' })
    setModalOuvert(false)
    setMessage({ type: 'succes', texte: 'Salle ajoutée localement (pas encore sauvegardée en BDD)' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
  }

  // Supprimer une salle (local uniquement pour l'instant)
  const supprimerSalle = (id_salle) => {
    if (confirm('Voulez-vous vraiment supprimer cette salle ?')) {
      setSalles(prev => prev.filter(s => s.id_salle !== id_salle))
      setMessage({ type: 'succes', texte: 'Salle supprimée localement' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    }
  }

  // Affichage pendant le chargement
  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement des salles...</div>
  }

  return (
    <div>
      {/* Message de feedback */}
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Stats rapides */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>🏫</div>
          <div className={styles.statInfo}>
            <h3>{salles.length}</h3>
            <p>Salles total</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>💺</div>
          <div className={styles.statInfo}>
            <h3>{salles.reduce((acc, s) => acc + (s.capacite || 0), 0)}</h3>
            <p>Places total</p>
          </div>
        </div>
      </div>

      {/* Liste des salles */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Liste des salles</h3>
          <button 
            onClick={() => setModalOuvert(true)}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            + Ajouter une salle
          </button>
        </div>

        {/* Barre de recherche */}
        <div className={styles.filterBar}>
          <input
            type="text"
            placeholder="Rechercher par nom, type, localisation..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Grille de salles */}
        {sallesFiltrees.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏫</div>
            <h4 className={styles.emptyTitle}>Aucune salle trouvée</h4>
          </div>
        ) : (
          <div className={styles.salleGrid}>
            {sallesFiltrees.map((salle) => (
              <div key={salle.id_salle} className={styles.salleCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 className={styles.salleNom}>{salle.nom_salle}</h4>
                </div>

                <p className={styles.salleInfo}>📍 {salle.localisation || 'Non précisé'}</p>
                <p className={styles.salleInfo}>👥 Capacité : {salle.capacite || '?'} places</p>
                <p className={styles.salleInfo}>🏷️ Type : {salle.type_salle || 'Non précisé'}</p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button 
                    onClick={() => supprimerSalle(salle.id_salle)}
                    className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal : Ajouter une salle */}
      {modalOuvert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ajouter une salle</h3>
              <button onClick={() => setModalOuvert(false)} className={styles.modalClose}>✕</button>
            </div>

            <form onSubmit={ajouterSalle}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nom de la salle *</label>
                  <input
                    type="text"
                    name="nom_salle"
                    value={nouvelleSalle.nom_salle}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ex: Salle D4"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Capacité *</label>
                  <input
                    type="number"
                    name="capacite"
                    value={nouvelleSalle.capacite}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Nombre de places"
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type de salle</label>
                  <select
                    name="type_salle"
                    value={nouvelleSalle.type_salle}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {typesSalles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Localisation</label>
                  <input
                    type="text"
                    name="localisation"
                    value={nouvelleSalle.localisation}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ex: Bâtiment A, 2e étage"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                  Ajouter
                </button>
                <button 
                  type="button" 
                  onClick={() => setModalOuvert(false)}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}