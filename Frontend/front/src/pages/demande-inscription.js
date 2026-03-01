import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/DemandeInscription.module.css'
import { apiSoumettreDemandeInscription, apiVerifierStatutDemande } from '@/services/api'

// icones
import { 
  FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowRight, FaHome,
  FaUser, FaEnvelope, FaBuilding, FaGraduationCap, FaIdBadge,
  FaShieldAlt, FaUserCheck
} from 'react-icons/fa'

export default function DemandeInscription() {
  const router = useRouter()

  // 3 étapes : 'formulaire' → 'attente' → 'resultat'
  const [etape, setEtape] = useState('formulaire')

  // données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    departement: '',
    grade: '',
    code_enseignant: ''
  })

  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const [statutDemande, setStatutDemande] = useState(null)

  const departements = [
    'Informatique', 'Mathématiques', 'Physique', 'Chimie',
    'Biologie', 'Lettres', 'Histoire', 'Géographie'
  ]
  const grades = [
    'Assistant', 'Maître de conférences', 'Professeur', 'Vacataire'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErreur('')
  }

  // -- soumission --
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    if (!formData.nom || !formData.prenom || !formData.email || 
        !formData.departement || !formData.grade || !formData.code_enseignant) {
      setErreur('Veuillez remplir tous les champs')
      return
    }

    if (!formData.code_enseignant.startsWith('31')) {
      setErreur('Le code enseignant doit commencer par 31')
      return
    }

    setChargement(true)
    try {
      await apiSoumettreDemandeInscription({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        departement: formData.departement,
        grade: formData.grade,
        code_enseignant: formData.code_enseignant
      })
      setEtape('attente')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }

  // -- polling toutes les 5s --
  useEffect(() => {
    if (etape !== 'attente') return

    const interval = setInterval(async () => {
      try {
        const data = await apiVerifierStatutDemande(formData.email)
        if (data.statut === 'acceptee' || data.statut === 'rejetee') {
          setStatutDemande(data)
          setEtape('resultat')
          clearInterval(interval)
        }
      } catch (err) {
        console.log('Vérification en cours...')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [etape, formData.email])


  // ============ FORMULAIRE ============
  if (etape === 'formulaire') {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/">
            <button className={styles.backButton}>← Retour</button>
          </Link>
        </nav>

        <div className={styles.container}>
          {/* partie gauche */}
          <div className={styles.leftSection}>
            <div className={styles.brandSection}>
              <h1 className={styles.brandTitle}>Schedule<span className={styles.accent}>APP</span></h1>
              <div className={styles.divider}></div>
              <p className={styles.brandSlogan}>
                Envoyez votre demande pour accéder à la plateforme de gestion des emplois du temps
              </p>
            </div>

            <div className={styles.infosSection}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaIdBadge /></div>
                <div>
                  <h3 className={styles.infoTitle}>Code enseignant requis</h3>
                  <p className={styles.infoText}>Utilisez le code attribué par l&apos;université (commence par 31)</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaShieldAlt /></div>
                <div>
                  <h3 className={styles.infoTitle}>Vérification par l&apos;admin</h3>
                  <p className={styles.infoText}>L&apos;administration vérifiera votre code avant de valider</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaUserCheck /></div>
                <div>
                  <h3 className={styles.infoTitle}>Accès personnalisé</h3>
                  <p className={styles.infoText}>Un espace dédié vous sera attribué après validation</p>
                </div>
              </div>
            </div>
          </div>

          {/* partie droite - formulaire */}
          <div className={styles.rightSection}>
            <div className={styles.formBox}>
              <h2 className={styles.formTitle}>Demande d&apos;accès</h2>
              <p className={styles.formSubtitle}>Remplissez vos informations pour accéder à la plateforme</p>

              {erreur && (
                <div className={styles.erreur}>
                  <FaTimesCircle /> {erreur}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}><FaUser className={styles.labelIcon} /> Nom</label>
                    <input type="text" name="nom" value={formData.nom}
                      onChange={handleChange} className={styles.input} placeholder="Votre nom" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}><FaUser className={styles.labelIcon} /> Prénom</label>
                    <input type="text" name="prenom" value={formData.prenom}
                      onChange={handleChange} className={styles.input} placeholder="Votre prénom" />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}><FaEnvelope className={styles.labelIcon} /> Email</label>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} className={styles.input} placeholder="votre.email@universite.fr" />
                </div>

                {/* champ code enseignant - mis en valeur */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}><FaIdBadge className={styles.labelIcon} /> Code enseignant</label>
                  <input type="text" name="code_enseignant" value={formData.code_enseignant}
                    onChange={handleChange} className={styles.inputCode}
                    placeholder="31XXX" maxLength={10} />
                  <span className={styles.inputHint}>Code attribué par l&apos;université, commence par 31</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}><FaBuilding className={styles.labelIcon} /> Département</label>
                    <select name="departement" value={formData.departement}
                      onChange={handleChange} className={styles.input}>
                      <option value="">-- Choisir --</option>
                      {departements.map((dep, i) => (
                        <option key={i} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}><FaGraduationCap className={styles.labelIcon} /> Grade</label>
                    <select name="grade" value={formData.grade}
                      onChange={handleChange} className={styles.input}>
                      <option value="">-- Choisir --</option>
                      {grades.map((gr, i) => (
                        <option key={i} value={gr}>{gr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className={styles.submitButton} disabled={chargement}>
                  {chargement ? (
                    <><FaSpinner className={styles.spinner} /> Envoi en cours...</>
                  ) : (
                    <>Envoyer ma demande <FaArrowRight /></>
                  )}
                </button>

                <p className={styles.loginText}>
                  Déjà un compte ?{' '}
                  <Link href="/connexion" className={styles.loginLink}>Se connecter</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============ ECRAN D'ATTENTE ============
  if (etape === 'attente') {
    return (
      <div className={styles.page}>
        <div className={styles.waitingScreen}>
          <div className={styles.waitingCard}>
            <div className={styles.waitingSpinner}>
              <FaSpinner className={styles.spinnerBig} />
            </div>
            <h2 className={styles.waitingTitle}>Demande envoyée !</h2>
            <p className={styles.waitingName}>{formData.prenom} {formData.nom}</p>
            <p className={styles.waitingCode}>Code : {formData.code_enseignant}</p>
            <p className={styles.waitingText}>
              Votre demande est en cours d&apos;examen par l&apos;administration.
              <br />Restez sur cette page, vous serez notifié dès qu&apos;une décision sera prise.
            </p>
            <div className={styles.waitingDots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
            <p className={styles.waitingHint}>Vérification automatique en cours...</p>
          </div>
        </div>
      </div>
    )
  }

  // ============ ECRAN RESULTAT ============
  if (etape === 'resultat') {
    const acceptee = statutDemande?.statut === 'acceptee'

    return (
      <div className={styles.page}>
        <div className={styles.resultScreen}>
          <div className={`${styles.resultCard} ${acceptee ? styles.resultAccepted : styles.resultRejected}`}>
            <div className={styles.resultIconBox}>
              {acceptee ? (
                <FaCheckCircle className={styles.resultIconSuccess} />
              ) : (
                <FaTimesCircle className={styles.resultIconFail} />
              )}
            </div>

            <h2 className={styles.resultTitle}>
              {acceptee ? 'Bienvenue à notre Université !' : 'Merci d\'être passé'}
            </h2>

            <p className={styles.resultMessage}>
              {acceptee 
                ? 'Votre demande a été acceptée. Vous pouvez maintenant finaliser votre inscription.'
                : 'Malheureusement, votre demande n\'a pas été retenue cette fois-ci. N\'hésitez pas à réessayer.'}
            </p>

            {statutDemande?.message_reponse && (
              <div className={styles.adminMessage}>
                <strong>Message de l&apos;administration :</strong>
                <p>{statutDemande.message_reponse}</p>
              </div>
            )}

            {acceptee ? (
              <button className={styles.resultBtnSuccess}
                onClick={() => {
                  router.push({
                    pathname: '/inscription',
                    query: {
                      nom: formData.nom,
                      prenom: formData.prenom,
                      email: formData.email,
                      departement: formData.departement,
                      grade: formData.grade
                    }
                  })
                }}>
                Continuer <FaArrowRight />
              </button>
            ) : (
              <Link href="/">
                <button className={styles.resultBtnFail}>
                  <FaHome /> Retour à l&apos;accueil
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }
}