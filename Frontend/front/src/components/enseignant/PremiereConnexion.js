import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getFormations, getMatieresByFormation, apiChoisirMatieres } from '@/services/api'

export default function PremiereConnexion({ enseignant, onTerminer }) {
  
  const [etape, setEtape] = useState(1) // 1: formation, 2: matières, 3: confirmation
  const [formations, setFormations] = useState([])
  const [formationChoisie, setFormationChoisie] = useState(null)
  const [matieres, setMatieres] = useState([])
  const [matieresChoisies, setMatieresChoisies] = useState([])
  const [chargement, setChargement] = useState(true)
  const [message, setMessage] = useState({ type: '', texte: '' })

  // Charger les formations du département de l'enseignant
  useEffect(() => {
    chargerFormations()
  }, [])

  const chargerFormations = async () => {
    try {
      setChargement(true)
      const data = await getFormations(enseignant.departement)
      setFormations(data)
    } catch (err) {
      console.error('Erreur chargement formations:', err)
      // Si pas de formation pour ce département, charger toutes
      const all = await getFormations()
      setFormations(all)
    } finally {
      setChargement(false)
    }
  }

  // Charger les matières quand une formation est choisie
  const choisirFormation = async (formation) => {
    setFormationChoisie(formation)
    try {
      const data = await getMatieresByFormation(formation.id_formation)
      setMatieres(data)
      setMatieresChoisies([])
      setEtape(2)
    } catch (err) {
      console.error('Erreur chargement matières:', err)
    }
  }

  // Toggler une matière
  const toggleMatiere = (id_matiere) => {
    setMatieresChoisies(prev => {
      if (prev.includes(id_matiere)) {
        return prev.filter(m => m !== id_matiere)
      }
      return [...prev, id_matiere]
    })
  }

  // Tout sélectionner / désélectionner
  const toutSelectionner = () => {
    if (matieresChoisies.length === matieres.length) {
      setMatieresChoisies([])
    } else {
      setMatieresChoisies(matieres.map(m => m.id_matiere))
    }
  }

  // Valider les choix
  const validerChoix = async () => {
    if (matieresChoisies.length === 0) {
      setMessage({ type: 'erreur', texte: 'Veuillez choisir au moins une matière' })
      return
    }

    try {
      await apiChoisirMatieres(enseignant.id, matieresChoisies)
      setEtape(3)
    } catch (err) {
      console.error('Erreur enregistrement:', err)
      setMessage({ type: 'erreur', texte: "Erreur lors de l'enregistrement" })
    }
  }

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement...</div>
  }

  return (
    <div>
      {message.texte && (
        <div className={message.type === 'succes' ? styles.successMessage : styles.errorMessage}>
          {message.texte}
        </div>
      )}

      {/* Barre de progression */}
      <div className={styles.card} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '10px' }}>
          <div style={{ textAlign: 'center', opacity: etape >= 1 ? 1 : 0.4 }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: etape >= 1 ? '#1a1a2e' : '#ddd',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px', fontWeight: 'bold'
            }}>1</div>
            <span style={{ fontSize: '13px', color: '#666' }}>Formation</span>
          </div>
          <div style={{ textAlign: 'center', opacity: etape >= 2 ? 1 : 0.4 }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: etape >= 2 ? '#1a1a2e' : '#ddd',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px', fontWeight: 'bold'
            }}>2</div>
            <span style={{ fontSize: '13px', color: '#666' }}>Matières</span>
          </div>
          <div style={{ textAlign: 'center', opacity: etape >= 3 ? 1 : 0.4 }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: etape >= 3 ? '#4ecca3' : '#ddd',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px', fontWeight: 'bold'
            }}>✓</div>
            <span style={{ fontSize: '13px', color: '#666' }}>Terminé</span>
          </div>
        </div>
      </div>

      {/* ÉTAPE 1 : Choisir la formation */}
      {etape === 1 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              Bienvenue {enseignant.prenom} ! Dans quelle formation enseignez-vous ?
            </h3>
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Département : <strong>{enseignant.departement}</strong> — Semestre 1
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {formations.map((f) => (
              <div
                key={f.id_formation}
                onClick={() => choisirFormation(f)}
                style={{
                  padding: '20px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = '#1a1a2e'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              >
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '5px' }}>
                  📚 {f.nom_formation}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Niveau : {f.niveau} — {f.departement}
                </div>
              </div>
            ))}
          </div>

          {formations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
              Aucune formation trouvée pour votre département.
            </div>
          )}
        </div>
      )}

      {/* ÉTAPE 2 : Choisir les matières */}
      {etape === 2 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              Quelles matières enseignez-vous en {formationChoisie?.nom_formation} ?
            </h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#666', margin: 0 }}>
              Sélectionnez vos matières ({matieresChoisies.length}/{matieres.length})
            </p>
            <button
              onClick={toutSelectionner}
              className={`${styles.button} ${styles.buttonSecondary}`}
              style={{ fontSize: '13px', padding: '8px 15px' }}
            >
              {matieresChoisies.length === matieres.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', marginBottom: '25px' }}>
            {matieres.map((mat) => {
              const selected = matieresChoisies.includes(mat.id_matiere)
              return (
                <div
                  key={mat.id_matiere}
                  onClick={() => toggleMatiere(mat.id_matiere)}
                  style={{
                    padding: '15px',
                    border: selected ? '2px solid #1a1a2e' : '2px solid #e0e0e0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: selected ? '#eef' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{selected ? '✅' : '⬜'}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{mat.nom_matiere}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {mat.id_matiere} — {mat.nb_cm} CM, {mat.nb_td} TD, {mat.nb_tp} TP
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setEtape(1)} className={`${styles.button} ${styles.buttonSecondary}`}>
              ← Retour
            </button>
            <button onClick={validerChoix} className={`${styles.button} ${styles.buttonPrimary}`}>
              Valider mes matières ({matieresChoisies.length})
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Confirmation */}
      {etape === 3 && (
        <div className={styles.card} style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
          <h3 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Configuration terminée !</h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Vous avez sélectionné {matieresChoisies.length} matière(s) en {formationChoisie?.nom_formation}.
            <br />Vous pouvez maintenant accéder à votre espace.
          </p>
          <button onClick={onTerminer} className={`${styles.button} ${styles.buttonPrimary}`}>
            Accéder à mon espace →
          </button>
        </div>
      )}
    </div>
  )
}