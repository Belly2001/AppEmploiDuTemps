import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/DemandeInscription.module.css'
import { apiSoumettreDemandeInscription, apiVerifierStatutDemande } from '@/services/api'

// icones
import { 
  FaCloudUploadAlt, FaFilePdf, FaTimes, FaCheckCircle, 
  FaTimesCircle, FaSpinner, FaArrowRight, FaHome,
  FaUser, FaEnvelope, FaBuilding, FaGraduationCap
} from 'react-icons/fa'

export default function DemandeInscription() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  // 3 états possibles : 'formulaire', 'attente', 'resultat'
  const [etape, setEtape] = useState('formulaire')

  // données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    departement: '',
    grade: ''
  })

  // le fichier CV
  const [cvFile, setCvFile] = useState(null)
  const [cvBase64, setCvBase64] = useState('')

  // pour l'affichage
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const [statutDemande, setStatutDemande] = useState(null)

  // les options de départements et grades (les mêmes que dans inscription.js)
  const departements = [
    'Informatique', 'Mathématiques', 'Physique', 'Chimie',
    'Biologie', 'Lettres', 'Histoire', 'Géographie'
  ]
  const grades = [
    'Assistant', 'Maître de conférences', 'Professeur', 'Vacataire'
  ]

  // -- gestion du formulaire --
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErreur('')
  }

  // -- gestion de l'upload du CV --
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // on vérifie que c'est bien un PDF
    if (file.type !== 'application/pdf') {
      setErreur('Veuillez sélectionner un fichier PDF uniquement')
      return
    }

    // max 3 Mo, suffisant pour un CV
    if (file.size > 3 * 1024 * 1024) {
      setErreur('Le fichier ne doit pas dépasser 3 Mo')
      return
    }

    setCvFile(file)
    setErreur('')

    // convertir en base64 pour l'envoyer au backend
    const reader = new FileReader()
    reader.onload = () => {
      // on garde juste la partie base64, pas le header "data:..."
      const base64 = reader.result.split(',')[1]
      setCvBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  // supprimer le CV sélectionné
  const supprimerCV = () => {
    setCvFile(null)
    setCvBase64('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // -- soumettre la demande --
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    // vérifications basiques
    if (!formData.nom || !formData.prenom || !formData.email || !formData.departement || !formData.grade) {
      setErreur('Veuillez remplir tous les champs')
      return
    }

    if (!cvFile) {
      setErreur('Veuillez joindre votre CV en PDF')
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
        cv_base64: cvBase64,
        cv_nom_fichier: cvFile.name
      })

      // c'est envoyé, on passe à l'écran d'attente
      setEtape('attente')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }

  // -- polling : on vérifie le statut toutes les 5 secondes --
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
        // pas grave, on réessaie dans 5s
        console.log('Vérification en cours...')
      }
    }, 5000)

    // nettoyage quand le composant se démonte
    return () => clearInterval(interval)
  }, [etape, formData.email])

  // ============ RENDU DU FORMULAIRE ============
  if (etape === 'formulaire') {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/">
            <button className={styles.backButton}>← Retour</button>
          </Link>
        </nav>

        <div className={styles.container}>
          {/* partie gauche - infos */}
          <div className={styles.leftSection}>
            <div className={styles.brandSection}>
              <h1 className={styles.brandTitle}>Schedule<span className={styles.accent}>APP</span></h1>
              <div className={styles.divider}></div>
              <p className={styles.brandSlogan}>
                Envoyez votre candidature pour rejoindre notre équipe pédagogique
              </p>
            </div>

            <div className={styles.infosSection}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaFilePdf /></div>
                <div>
                  <h3 className={styles.infoTitle}>CV requis</h3>
                  <p className={styles.infoText}>Joignez votre CV au format PDF (max 3 Mo)</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaCheckCircle /></div>
                <div>
                  <h3 className={styles.infoTitle}>Validation rapide</h3>
                  <p className={styles.infoText}>L&apos;administration examine votre demande rapidement</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaUser /></div>
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
              <h2 className={styles.formTitle}>Demande d&apos;inscription</h2>
              <p className={styles.formSubtitle}>Remplissez vos informations et joignez votre CV</p>

              {erreur && (
                <div className={styles.erreur}>
                  <FaTimesCircle /> {erreur}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* nom + prénom côte à côte */}
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}><FaUser className={styles.labelIcon} /> Nom</label>
                    <input
                      type="text" name="nom" value={formData.nom}
                      onChange={handleChange} className={styles.input}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}><FaUser className={styles.labelIcon} /> Prénom</label>
                    <input
                      type="text" name="prenom" value={formData.prenom}
                      onChange={handleChange} className={styles.input}
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}><FaEnvelope className={styles.labelIcon} /> Email</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} className={styles.input}
                    placeholder="votre.email@universite.fr"
                  />
                </div>

                {/* département + grade côte à côte */}
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

                {/* zone d'upload du CV */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}><FaFilePdf className={styles.labelIcon} /> CV (PDF)</label>
                  
                  {!cvFile ? (
                    <div 
                      className={styles.uploadZone}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCloudUploadAlt size={32} />
                      <p>Cliquez pour sélectionner votre CV</p>
                      <span>PDF uniquement, max 3 Mo</span>
                    </div>
                  ) : (
                    <div className={styles.fileSelected}>
                      <FaFilePdf size={20} className={styles.filePdfIcon} />
                      <span className={styles.fileName}>{cvFile.name}</span>
                      <span className={styles.fileSize}>
                        ({(cvFile.size / 1024 / 1024).toFixed(1)} Mo)
                      </span>
                      <button type="button" onClick={supprimerCV} className={styles.fileRemove}>
                        <FaTimes />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
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
            <p className={styles.waitingName}>
              {formData.prenom} {formData.nom}
            </p>
            <p className={styles.waitingText}>
              Votre demande est en cours d&apos;examen par l&apos;administration.
              <br />Restez sur cette page, vous serez notifié dès qu&apos;une décision sera prise.
            </p>
            <div className={styles.waitingDots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
            <p className={styles.waitingHint}>
              Vérification automatique en cours...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ============ ECRAN DE RESULTAT ============
  if (etape === 'resultat') {
    const acceptee = statutDemande?.statut === 'acceptee'

    return (
      <div className={styles.page}>
        <div className={styles.resultScreen}>
          <div className={`${styles.resultCard} ${acceptee ? styles.resultAccepted : styles.resultRejected}`}>
            
            {/* grosse icone */}
            <div className={styles.resultIconBox}>
              {acceptee ? (
                <FaCheckCircle className={styles.resultIconSuccess} />
              ) : (
                <FaTimesCircle className={styles.resultIconFail} />
              )}
            </div>

            {/* message */}
            <h2 className={styles.resultTitle}>
              {acceptee 
                ? 'Bienvenue à notre Université !' 
                : 'Merci d\'être passé'}
            </h2>

            <p className={styles.resultMessage}>
              {acceptee 
                ? 'Votre candidature a été acceptée. Vous pouvez maintenant finaliser votre inscription.'
                : 'Malheureusement, votre candidature n\'a pas été retenue cette fois-ci. N\'hésitez pas à réessayer.'}
            </p>

            {/* message de l'admin s'il y en a un */}
            {statutDemande?.message_reponse && (
              <div className={styles.adminMessage}>
                <strong>Message de l&apos;administration :</strong>
                <p>{statutDemande.message_reponse}</p>
              </div>
            )}

            {/* bouton d'action */}
            {acceptee ? (
              <button
                className={styles.resultBtnSuccess}
                onClick={() => {
                  // on redirige vers l'inscription avec les infos pré-remplies
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
                }}
              >
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