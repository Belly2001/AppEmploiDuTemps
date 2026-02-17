import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getEnseignants, apiAjouterEnseignant, apiSupprimerEnseignant, apiModifierEnseignant } from '@/services/api'

export default function GestionEnseignants() {
  
  // Liste des enseignants — chargée depuis l'API
  const [enseignants, setEnseignants] = useState([])
  const [chargement, setChargement] = useState(true)

  // État pour le filtre de recherche
  const [recherche, setRecherche] = useState('')

  // État pour le modal d'ajout
  const [modalOuvert, setModalOuvert] = useState(false)

  // État pour le modal de détails
  const [enseignantSelectionne, setEnseignantSelectionne] = useState(null)

  // État pour le formulaire d'ajout
  const [nouveauEnseignant, setNouveauEnseignant] = useState({
    nom: '',
    prenom: '',
    email: '',
    grade: '',
    departement: ''
  })

  // Message de feedback
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Listes pour les selects
  const grades = ['Assistant', 'Maître de conférences', 'Professeur', 'Vacataire']
  const departements = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Lettres']

  // Charger les enseignants au démarrage
  useEffect(() => {
    chargerEnseignants()
  }, [])

  const chargerEnseignants = async () => {
    try {
      setChargement(true)
      const data = await getEnseignants()
      setEnseignants(data)
    } catch (err) {
      console.error('Erreur chargement enseignants:', err)
      setMessage({ type: 'erreur', texte: 'Impossible de charger les enseignants' })
    } finally {
      setChargement(false)
    }
  }

  // Filtrer les enseignants selon la recherche
  const enseignantsFiltres = enseignants.filter(e =>
    (e.nom || '').toLowerCase().includes(recherche.toLowerCase()) ||
    (e.prenom || '').toLowerCase().includes(recherche.toLowerCase()) ||
    (e.email || '').toLowerCase().includes(recherche.toLowerCase()) ||
    (e.departement || '').toLowerCase().includes(recherche.toLowerCase())
  )

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setNouveauEnseignant(prev => ({ ...prev, [name]: value }))
  }

  // Ajouter un enseignant
  const ajouterEnseignant = async (e) => {
    e.preventDefault()

    if (!nouveauEnseignant.nom || !nouveauEnseignant.prenom || !nouveauEnseignant.email) {
      setMessage({ type: 'erreur', texte: 'Veuillez remplir les champs obligatoires' })
      return
    }

    try {
      await apiAjouterEnseignant({
        nom: nouveauEnseignant.nom,
        prenom: nouveauEnseignant.prenom,
        email: nouveauEnseignant.email,
        grade: nouveauEnseignant.grade,
        departement: nouveauEnseignant.departement,
        statut: 'Actif'
      })
      await chargerEnseignants()
      setNouveauEnseignant({ nom: '', prenom: '', email: '', grade: '', departement: '' })
      setModalOuvert(false)
      setMessage({ type: 'succes', texte: 'Enseignant ajouté avec succès !' })
      setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
    } catch (err) {
      console.error('Erreur ajout:', err)
      setMessage({ type: 'erreur', texte: "Erreur lors de l'ajout de l'enseignant" })
    }
  }

  // Supprimer un enseignant — utilise id_enseignant (nom du champ backend)
  const supprimerEnseignant = async (id_enseignant) => {
    if (confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      try {
        await apiSupprimerEnseignant(id_enseignant)
        await chargerEnseignants()
        setMessage({ type: 'succes', texte: 'Enseignant supprimé' })
        setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
      } catch (err) {
        console.error('Erreur suppression:', err)
        setMessage({ type: 'erreur', texte: 'Erreur lors de la suppression' })
      }
    }
  }

  // Changer le statut — utilise PATCH
  const changerStatut = async (id_enseignant, statutActuel) => {
    const nouveauStatut = statutActuel === 'Actif' ? 'Inactif' : 'Actif'
    try {
      await apiModifierEnseignant(id_enseignant, { statut: nouveauStatut })
      await chargerEnseignants()
    } catch (err) {
      console.error('Erreur modification statut:', err)
      setMessage({ type: 'erreur', texte: 'Erreur lors du changement de statut' })
    }
  }

  // Initiales pour l'avatar
  const getInitiales = (prenom, nom) => `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`

  // Affichage pendant le chargement
  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement des enseignants...</div>
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
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>👥</div>
          <div className={styles.statInfo}>
            <h3>{enseignants.length}</h3>
            <p>Enseignants total</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>✅</div>
          <div className={styles.statInfo}>
            <h3>{enseignants.filter(e => e.statut === 'Actif').length}</h3>
            <p>Actifs</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>📚</div>
          <div className={styles.statInfo}>
            <h3>{[...new Set(enseignants.map(e => e.departement))].length}</h3>
            <p>Départements</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>🎓</div>
          <div className={styles.statInfo}>
            <h3>{enseignants.filter(e => e.grade === 'Professeur').length}</h3>
            <p>Professeurs</p>
          </div>
        </div>
      </div>

      {/* Liste des enseignants */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Liste des enseignants</h3>
          <button 
            onClick={() => setModalOuvert(true)}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            + Ajouter un enseignant
          </button>
        </div>

        {/* Barre de recherche */}
        <div className={styles.filterBar}>
          <input
            type="text"
            placeholder="Rechercher par nom, email, département..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Tableau */}
        {enseignantsFiltres.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h4 className={styles.emptyTitle}>Aucun enseignant trouvé</h4>
            <p className={styles.emptyText}>
              {recherche ? 'Aucun résultat pour cette recherche.' : 'Ajoutez votre premier enseignant.'}
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Département</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enseignantsFiltres.map((ens) => (
                <tr key={ens.id_enseignant}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className={styles.enseignantAvatar}>
                        {getInitiales(ens.prenom, ens.nom)}
                      </div>
                      <span>{ens.prenom} {ens.nom}</span>
                    </div>
                  </td>
                  <td>{ens.email}</td>
                  <td>{ens.grade}</td>
                  <td>{ens.departement}</td>
                  <td>
                    <span className={`${styles.badge} ${ens.statut === 'Actif' ? styles.badgeActif : styles.badgeInactif}`}>
                      {ens.statut || 'Non défini'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        onClick={() => setEnseignantSelectionne(ens)}
                        className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}
                      >
                        Voir
                      </button>
                      <button 
                        onClick={() => changerStatut(ens.id_enseignant, ens.statut)}
                        className={`${styles.button} ${styles.buttonSmall} ${styles.buttonSecondary}`}
                      >
                        {ens.statut === 'Actif' ? 'Désactiver' : 'Activer'}
                      </button>
                      <button 
                        onClick={() => supprimerEnseignant(ens.id_enseignant)}
                        className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal : Ajouter un enseignant */}
      {modalOuvert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ajouter un enseignant</h3>
              <button onClick={() => setModalOuvert(false)} className={styles.modalClose}>✕</button>
            </div>

            <form onSubmit={ajouterEnseignant}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={nouveauEnseignant.nom}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Nom"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Prénom *</label>
                  <input
                    type="text"
                    name="prenom"
                    value={nouveauEnseignant.prenom}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Prénom"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={nouveauEnseignant.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="email@universite.fr"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Grade</label>
                  <select
                    name="grade"
                    value={nouveauEnseignant.grade}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Département</label>
                  <select
                    name="departement"
                    value={nouveauEnseignant.departement}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Choisir --</option>
                    {departements.map(d => <option key={d} value={d}>{d}</option>)}
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

      {/* Modal : Détails enseignant */}
      {enseignantSelectionne && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Détails de l'enseignant</h3>
              <button onClick={() => setEnseignantSelectionne(null)} className={styles.modalClose}>✕</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className={styles.enseignantAvatar} style={{ width: '80px', height: '80px', fontSize: '28px', margin: '0 auto' }}>
                {getInitiales(enseignantSelectionne.prenom, enseignantSelectionne.nom)}
              </div>
              <h3 style={{ marginTop: '15px', color: '#1a1a2e' }}>
                {enseignantSelectionne.prenom} {enseignantSelectionne.nom}
              </h3>
              <p style={{ color: '#666' }}>{enseignantSelectionne.email}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#999' }}>Grade</p>
                <p style={{ fontWeight: '600' }}>{enseignantSelectionne.grade || 'Non défini'}</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#999' }}>Département</p>
                <p style={{ fontWeight: '600' }}>{enseignantSelectionne.departement || 'Non défini'}</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#999' }}>Statut</p>
                <p style={{ fontWeight: '600' }}>{enseignantSelectionne.statut || 'Non défini'}</p>
              </div>
            </div>

            <button 
              onClick={() => setEnseignantSelectionne(null)}
              className={`${styles.button} ${styles.buttonSecondary}`}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}