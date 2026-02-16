import { useState } from 'react'
import styles from '@/styles/Admin.module.css'

export default function GestionSalles() {
  
  // Liste des salles (simulation, viendra de l'API)
  const [salles, setSalles] = useState([
    { id: 1, nom: 'Salle A1', capacite: 40, type: 'Informatique', localisation: 'Bâtiment A', disponible: true, equipements: ['Vidéoprojecteur', 'Ordinateurs'] },
    { id: 2, nom: 'Salle B2', capacite: 30, type: 'Cours', localisation: 'Bâtiment B', disponible: true, equipements: ['Tableau blanc', 'Vidéoprojecteur'] },
    { id: 3, nom: 'Salle C3', capacite: 50, type: 'Amphithéâtre', localisation: 'Bâtiment C', disponible: false, equipements: ['Système audio', 'Vidéoprojecteur'] }
  ])

  // État pour le modal d'ajout
  const [modalOuvert, setModalOuvert] = useState(false)

  // État pour le formulaire
  const [nouvelleSalle, setNouvelleSalle] = useState({
    nom: '',
    capacite: '',
    type: '',
    localisation: '',
    equipements: ''
  })

  // Message de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Recherche
  const [recherche, setRecherche] = useState('')

  // Types de salles
  const typesSalles = ['Informatique', 'Cours', 'Amphithéâtre', 'TP', 'TD', 'Laboratoire']

  // Filtrer les salles
  const sallesFiltrees = salles.filter(s =>
    s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    s.type.toLowerCase().includes(recherche.toLowerCase()) ||
    s.localisation.toLowerCase().includes(recherche.toLowerCase())
  )

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouvelleSalle(prev => ({ ...prev, [name]: value }))
  }

  // Ajouter une salle
  const ajouterSalle = (e) => {
    e.preventDefault()

    if (!nouvelleSalle.nom || !nouvelleSalle.capacite) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir le nom et la capacité' })
      return
    }

    const newSalle = {
      id: Date.now(),
      nom: nouvelleSalle.nom,
      capacite: parseInt(nouvelleSalle.capacite),
      type: nouvelleSalle.type,
      localisation: nouvelleSalle.localisation,
      disponible: true,
      equipements: nouvelleSalle.equipements.split(',').map(e => e.trim()).filter(e => e)
    }

    setSalles(prev => [...prev, newSalle])
    setNouvelleSalle({ nom: '', capacite: '', type: '', localisation: '', equipements: '' })
    setModalOuvert(false)
    setMessage({ type: 'succes', texte: 'Salle ajoutée avec succès !' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API
    console.log('Nouvelle salle:', newSalle)
  }

  // Supprimer une salle
  const supprimerSalle = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette salle ?')) {
      setSalles(prev => prev.filter(s => s.id !== id))
      setMessage({ type: 'succes', texte: 'Salle supprimée' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    }
  }

  // Changer la disponibilité
  const changerDisponibilite = (id) => {
    setSalles(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, disponible: !s.disponible }
      }
      return s
    }))
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
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>✅</div>
          <div className={styles.statInfo}>
            <h3>{salles.filter(s => s.disponible).length}</h3>
            <p>Disponibles</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>🚫</div>
          <div className={styles.statInfo}>
            <h3>{salles.filter(s => !s.disponible).length}</h3>
            <p>Occupées</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>💺</div>
          <div className={styles.statInfo}>
            <h3>{salles.reduce((acc, s) => acc + s.capacite, 0)}</h3>
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
              <div key={salle.id} className={styles.salleCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 className={styles.salleNom}>{salle.nom}</h4>
                  <span className={`${styles.badge} ${salle.disponible ? styles.badgeActif : styles.badgeInactif}`}>
                    {salle.disponible ? 'Disponible' : 'Occupée'}
                  </span>
                </div>

                <p className={styles.salleInfo}>📍 {salle.localisation}</p>
                <p className={styles.salleInfo}>👥 Capacité : {salle.capacite} places</p>
                <p className={styles.salleInfo}>🏷️ Type : {salle.type}</p>

                {salle.equipements.length > 0 && (
                  <div className={styles.salleEquipements}>
                    {salle.equipements.map((eq, index) => (
                      <span key={index} className={styles.equipementTag}>{eq}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button 
                    onClick={() => changerDisponibilite(salle.id)}
                    className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}
                  >
                    {salle.disponible ? 'Marquer occupée' : 'Libérer'}
                  </button>
                  <button 
                    onClick={() => supprimerSalle(salle.id)}
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
                    name="nom"
                    value={nouvelleSalle.nom}
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
                    name="type"
                    value={nouvelleSalle.type}
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

              <div className={styles.formGroup}>
                <label className={styles.label}>Équipements (séparés par des virgules)</label>
                <input
                  type="text"
                  name="equipements"
                  value={nouvelleSalle.equipements}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ex: Vidéoprojecteur, Ordinateurs, Tableau blanc"
                />
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