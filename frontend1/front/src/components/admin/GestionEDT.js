import { useState } from 'react'
import styles from '@/styles/Admin.module.css'

export default function GestionEDT() {
  
  // Liste des cours assignés (simulation)
  const [cours, setCours] = useState([
    { id: 1, intitule: 'Programmation Web', type: 'TP', jour: 'Lundi', heureDebut: '08:00', heureFin: '10:00', enseignant: 'Moussa Sane', salle: 'Salle A1', matiere: 'INF101' },
    { id: 2, intitule: 'Analyse Mathématique', type: 'TD', jour: 'Mardi', heureDebut: '10:00', heureFin: '12:00', enseignant: 'Divan Izere', salle: 'Salle B2', matiere: 'MAT201' },
    { id: 3, intitule: 'Mécanique Générale', type: 'CM', jour: 'Jeudi', heureDebut: '14:00', heureFin: '16:00', enseignant: 'Hassane Ali', salle: 'Salle C3', matiere: 'PHY301' }
  ])

  // Modal pour ajouter un cours
  const [modalOuvert, setModalOuvert] = useState(false)

  // Formulaire nouveau cours
  const [nouveauCours, setNouveauCours] = useState({
    intitule: '',
    type: '',
    jour: '',
    heureDebut: '',
    heureFin: '',
    enseignant: '',
    salle: '',
    matiere: ''
  })

  // Message
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Données pour les selects (viendront de l'API)
  const enseignants = ['Moussa Sane', 'Divan Izere', 'Hassane Ali']
  const salles = ['Salle A1', 'Salle B2', 'Salle C3']
  const matieres = [
    { id: 'INF101', nom: 'Programmation Web' },
    { id: 'MAT201', nom: 'Analyse Mathématique' },
    { id: 'PHY301', nom: 'Mécanique Générale' }
  ]
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const typesCours = ['CM', 'TD', 'TP']

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouveauCours(prev => ({ ...prev, [name]: value }))

    // Auto-remplir l'intitulé si on sélectionne une matière
    if (name === 'matiere') {
      const mat = matieres.find(m => m.id === value)
      if (mat) {
        setNouveauCours(prev => ({ ...prev, intitule: mat.nom }))
      }
    }
  }

  // Ajouter un cours
  const ajouterCours = (e) => {
    e.preventDefault()

    if (!nouveauCours.intitule || !nouveauCours.jour || !nouveauCours.heureDebut || !nouveauCours.heureFin || !nouveauCours.enseignant || !nouveauCours.salle) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir tous les champs obligatoires' })
      return
    }

    if (nouveauCours.heureDebut >= nouveauCours.heureFin) {
      setMessage({ type: 'erreur', texte: "L'heure de fin doit être après l'heure de début" })
      return
    }

    const newCours = {
      id: Date.now(),
      ...nouveauCours
    }

    setCours(prev => [...prev, newCours])
    setNouveauCours({ intitule: '', type: '', jour: '', heureDebut: '', heureFin: '', enseignant: '', salle: '', matiere: '' })
    setModalOuvert(false)
    setMessage({ type: 'succes', texte: 'Cours ajouté avec succès !' })
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)

    // TODO: Appel API
    console.log('Nouveau cours:', newCours)
  }

  // Supprimer un cours
  const supprimerCours = (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      setCours(prev => prev.filter(c => c.id !== id))
      setMessage({ type: 'succes', texte: 'Cours supprimé' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    }
  }

  // Couleur selon le type de cours
  const getTypeStyle = (type) => {
    switch (type) {
      case 'CM': return { backgroundColor: '#e3f2fd', color: '#1976d2' }
      case 'TD': return { backgroundColor: '#fff3e0', color: '#f57c00' }
      case 'TP': return { backgroundColor: '#e8f5e9', color: '#388e3c' }
      default: return { backgroundColor: '#f5f5f5', color: '#666' }
    }
  }

  // Grouper les cours par jour
  const coursParJour = jours.reduce((acc, jour) => {
    acc[jour] = cours.filter(c => c.jour === jour)
    return acc
  }, {})

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
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>📅</div>
          <div className={styles.statInfo}>
            <h3>{cours.length}</h3>
            <p>Cours planifiés</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>📗</div>
          <div className={styles.statInfo}>
            <h3>{cours.filter(c => c.type === 'CM').length}</h3>
            <p>Cours magistraux</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>📙</div>
          <div className={styles.statInfo}>
            <h3>{cours.filter(c => c.type === 'TD').length}</h3>
            <p>TD</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>📘</div>
          <div className={styles.statInfo}>
            <h3>{cours.filter(c => c.type === 'TP').length}</h3>
            <p>TP</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Emplois du temps</h3>
          <button 
            onClick={() => setModalOuvert(true)}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            + Ajouter un cours
          </button>
        </div>

        {/* Vue par jour */}
        {cours.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h4 className={styles.emptyTitle}>Aucun cours planifié</h4>
            <p className={styles.emptyText}>Commencez par ajouter des cours à l'emploi du temps.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Horaires</th>
                <th>Cours</th>
                <th>Type</th>
                <th>Enseignant</th>
                <th>Salle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cours.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.jour}</strong></td>
                  <td>{c.heureDebut} - {c.heureFin}</td>
                  <td>{c.intitule}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...getTypeStyle(c.type) }}>
                      {c.type}
                    </span>
                  </td>
                  <td>{c.enseignant}</td>
                  <td>{c.salle}</td>
                  <td>
                    <button 
                      onClick={() => supprimerCours(c.id)}
                      className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal : Ajouter un cours */}
      {modalOuvert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ajouter un cours</h3>
              <button onClick={() => setModalOuvert(false)} className={styles.modalClose}>✕</button>
            </div>

            <form onSubmit={ajouterCours}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Matière</label>
                  <select
                    name="matiere"
                    value={nouveauCours.matiere}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type de cours *</label>
                  <select
                    name="type"
                    value={nouveauCours.type}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {typesCours.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Intitulé du cours *</label>
                <input
                  type="text"
                  name="intitule"
                  value={nouveauCours.intitule}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ex: Programmation Web - TP"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Jour *</label>
                  <select
                    name="jour"
                    value={nouveauCours.jour}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {jours.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Heure début *</label>
                  <input
                    type="time"
                    name="heureDebut"
                    value={nouveauCours.heureDebut}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Heure fin *</label>
                  <input
                    type="time"
                    name="heureFin"
                    value={nouveauCours.heureFin}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Enseignant *</label>
                  <select
                    name="enseignant"
                    value={nouveauCours.enseignant}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {enseignants.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Salle *</label>
                  <select
                    name="salle"
                    value={nouveauCours.salle}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {salles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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