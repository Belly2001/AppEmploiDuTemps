/**
 * PAGE DE CONNEXION
 *
 * Rôle :
 * - Permet à un utilisateur de se connecter
 * - Appelle l'API pour vérifier les identifiants
 * - Stocke les informations utilisateur
 * - Redirige selon le rôle (admin / enseignant)
 */
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/Connexion.module.css'
import { loginUser } from '@/services/api'

export default function Connexion() {
    /**
   * ÉTATS LOCAUX DU FORMULAIRE
   * 
   * useState permet de stocker des valeurs
   * qui peuvent changer dans le composant.
   */
    
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
    /**
   * Hook Next.js permettant de rediriger
   * l'utilisateur vers une autre page.
   */
  const router = useRouter()

  /**
   * GESTION DE LA SOUMISSION DU FORMULAIRE
   * 
   * Cette fonction :
   * 1. Empêche le rechargement de la page
   * 2. Appelle l'API de connexion
   * 3. Stocke les données utilisateur
   * 4. Redirige selon le rôle
   */

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setChargement(true)

    try {
       /**
       * Appel API :
       * Vérifie si email + mot de passe sont corrects.
       */
      const data = await loginUser(email, password)


      /**
       * On sauvegarde les informations de l'utilisateur
       * dans le navigateur pour garder la session active.
       */
      localStorage.setItem('user', JSON.stringify(data))

      
      /**
       * Redirection selon le rôle.
       * Cela permet d'envoyer chaque type d'utilisateur
       * vers son espace dédié.
       */
      if (data.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/enseignant')
      }

    } catch (err) {

      /**
       * En cas d'erreur (mauvais mot de passe,
       * serveur indisponible, etc.)
       */
      console.error('Erreur connexion:', err)
      setErreur(err.message || 'Erreur de connexion au serveur')
    } finally {

      /**
       * Le bloc finally s'exécute toujours,
       * que la connexion réussisse ou échoue.
       */
      setChargement(false)
    }
  }

  return (
    <div className={styles.connexionPage}>
      <nav className={styles.nav}>
        <Link href="/">
          <button className={styles.backButton}>← Retour</button>
        </Link>
      </nav>

      <div className={styles.mainContainer}>
        
        <div className={styles.leftSection}>
          <div className={styles.brandSection}>
            <h1 className={styles.brandTitle}>Schedule APP</h1>
            <div className={styles.divider}></div>
            <p className={styles.brandSlogan}>
              Optimisez votre temps, simplifiez votre vie
            </p>
          </div>

          <div className={styles.featuresSection}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <div>
                <h3 className={styles.featureTitle}>Rapide et intuitif</h3>
                <p className={styles.featureText}>
                  Créez vos emplois du temps en quelques clics
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <div>
                <h3 className={styles.featureTitle}>Intelligent</h3>
                <p className={styles.featureText}>
                  Optimisation automatique des créneaux horaires
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔔</div>
              <div>
                <h3 className={styles.featureTitle}>Notifications</h3>
                <p className={styles.featureText}>
                  Restez informé des changements en temps réel
                </p>
              </div>
            </div>
          </div>

          <p className={styles.quote}>
            La meilleure façon de gérer son temps, cest de le planifier intelligemment
          </p>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Connexion</h1>
            <p className={styles.subtitle}>Accédez à votre espace</p>

             {/* 
              Affiche le message d'erreur uniquement
              si une erreur existe.
            */}

            {erreur && (
              <div style={{
                backgroundColor: '#ffe6e6',
                color: '#cc0000',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className={styles.forgotPassword}>
                <a href="#">Mot de passe oublié ?</a>
              </div>

              <button type="submit" className={styles.submitButton}
               disabled={chargement}        //Désactivé pendant le chargement
               >   
                {chargement ? 'Connexion en cours...' : 'Se connecter'}
              </button>

              <p className={styles.signupText}>
                Pas encore de compte ?{' '}
                <Link href="/inscription" className={styles.signupLink}>
                  Créer un compte
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}