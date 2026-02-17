import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getEDT, getCours, getEnseignants, getSalles, apiAjouterCours, apiSupprimerCours } from '@/services/api'

export default function GestionEDT() {
  
  // Données de l'emploi du temps — chargées depuis l'API
  const [edt, setEdt] = useState([])
  const [coursListe, setCoursListe] = useState([])
  const [chargement, setChargement] = useState(true)

  // Modal pour ajouter un cours
  const [modalOuvert, setModalOuvert] = useState(false)

  // Formulaire nouveau cours
  const [nouveauCours, setNouveauCours] = useState({
    intitule: '',
    type_cours: '',
    heure_debut: '',
    heure_fin: '',
    id_enseignant: '',
    id_matiere: ''
  })

  // Message
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Données pour les selects — chargées depuis l'API
  const [enseignants, setEnseignants] = useState([])
  const [salles, setSalles] = useState([])

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const typesCours = ['CM', 'TD', 'TP']

  // Charger les données au démarrage
  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      setChargement(true)
      const [edtData, coursData, enseignantsData, sallesData] = await Promise.all([
        getEDT(),
        getCours(),
        getEnseignants(),
        getSalles()
      ])
      setEdt(edtData)
      setCoursListe(coursData)
      setEnseignants(enseignantsData)
      setSalles(sallesData)
    } catch (err) {
      console.error('Erreur chargement données:', err)
      setMessage({ type: 'erreur', texte: 'Impossible de charger les données' })
    } finally {
      setChargement(false)
    }
  }

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouveauCours(prev => ({ ...prev, [name]: value }))
  }

  // Ajouter un cours
  const ajouterCours = async (e) => {
    e.preventDefault()

    if (!nouveauCours.intitule || !nouveauCours.heure_debut || !nouveauCours.heure_fin || !nouveauCours.type_cours) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir tous les champs obligatoires' })
      return
    }

    if (nouveauCours.heure_debut >= nouveauCours.heure_fin) {
      setMessage({ type: 'erreur', texte: "L'heure de fin doit être après l'heure de début" })
      return
    }

    try {
      await apiAjouterCours({
        intitule: nouveauCours.intitule,
        type_cours: nouveauCours.type_cours,
        heure_debut: nouveauCours.heure_debut,
        heure_fin: nouveauCours.heure_fin,
        id_enseignant: nouveauCours.id_enseignant || null,
        id_matiere: nouveauCours.id_matiere || null
      })
      await chargerDonnees()
      setNouveauCours({ intitule: '', type_cours: '', heure_debut: '', heure_fin: '', id_enseignant: '', id_matiere: '' })
      setModalOuvert(false)
      setMessage({ type: 'succes', texte: 'Cours ajouté avec succès !' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    } catch (err) {
      console.error('Erreur ajout cours:', err)
      setMessage({ type: 'erreur', texte: "Erreur lors de l'ajout du cours" })
    }
  }

  // Supprimer un cours
  const supprimerCours = async (num_cours) => {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      try {
        await apiSupprimerCours(num_cours)
        await chargerDonnees()
        setMessage({ type: 'succes', texte: 'Cours supprimé' })
        setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
      } catch (err) {
        console.error('Erreur suppression cours:', err)
        setMessage({ type: 'erreur', texte: 'Erreur lors de la suppression' })
      }
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

  // Affichage pendant le chargement
  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement de l'emploi du temps...</div>
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
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>📅</div>
          <div className={styles.statInfo}>
            <h3>{coursListe.length}</h3>
            <p>Cours créés</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>📗</div>
          <div className={styles.statInfo}>
            <h3>{coursListe.filter(c => c.type_cours === 'CM').length}</h3>
            <p>Cours magistraux</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>📙</div>
          <div className={styles.statInfo}>
            <h3>{coursListe.filter(c => c.type_cours === 'TD').length}</h3>
            <p>TD</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>📘</div>
          <div className={styles.statInfo}>
            <h3>{coursListe.filter(c => c.type_cours === 'TP').length}</h3>
            <p>TP</p>
          </div>
        </div>
      </div>

      {/* Section EDT (depuis la table emploi_du_temps) */}
      {edt.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Emploi du temps planifié</h3>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Date</th>
                <th>Cours</th>
                <th>Salle</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {edt.map((e) => (
                <tr key={e.id_edt}>
                  <td><strong>{e.jour}</strong></td>
                  <td>{e.date}</td>
                  <td>{e.cours_intitule || `Cours #${e.num_cours}`}</td>
                  <td>{e.salle_nom || `Salle #${e.id_salle}`}</td>
                  <td>
                    <span className={`${styles.badge} ${e.statut === 'Actif' ? styles.badgeActif : styles.badgeInactif}`}>
                      {e.statut || 'Non défini'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section Cours */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Liste des cours</h3>
          <button 
            onClick={() => setModalOuvert(true)}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            + Ajouter un cours
          </button>
        </div>

        {coursListe.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h4 className={styles.emptyTitle}>Aucun cours créé</h4>
            <p className={styles.emptyText}>Commencez par ajouter des cours.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Intitulé</th>
                <th>Type</th>
                <th>Horaires</th>
                <th>Enseignant</th>
                <th>Matière</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coursListe.map((c) => (
                <tr key={c.num_cours}>
                  <td>{c.intitule}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...getTypeStyle(c.type_cours) }}>
                      {c.type_cours}
                    </span>
                  </td>
                  <td>{c.heure_debut} - {c.heure_fin}</td>
                  <td>{c.enseignant_prenom} {c.enseignant_nom}</td>
                  <td>{c.nom_matiere || '-'}</td>
                  <td>
                    <button 
                      onClick={() => supprimerCours(c.num_cours)}
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Intitulé du cours *</label>
                <input
                  type="text"
                  name="intitule"
                  value={nouveauCours.intitule}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ex: Programmation Web"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type de cours *</label>
                  <select
                    name="type_cours"
                    value={nouveauCours.type_cours}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {typesCours.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Enseignant</label>
                  <select
                    name="id_enseignant"
                    value={nouveauCours.id_enseignant}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {enseignants.map(e => (
                      <option key={e.id_enseignant} value={e.id_enseignant}>
                        {e.prenom} {e.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Heure début *</label>
                  <input
                    type="time"
                    name="heure_debut"
                    value={nouveauCours.heure_debut}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Heure fin *</label>
                  <input
                    type="time"
                    name="heure_fin"
                    value={nouveauCours.heure_fin}
                    onChange={handleChange}
                    className={styles.input}
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