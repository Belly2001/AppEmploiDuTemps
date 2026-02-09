import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/Connexion.module.css'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Connexion:', { email, password })
    // Logique de connexion ici
    // router.push('/enseignant') // Redirection après connexion
  }

  return (
    <div className={styles.connexionPage}>
      {/* Navigation retour */}
      <nav className={styles.nav}>
        <Link href="/">
          <button className={styles.backButton}>← Retour</button>
        </Link>
      </nav>

      {/* Container principal avec 2 colonnes */}
      <div className={styles.mainContainer}>
        
{/* SECTION GAUCHE - Slogans et présentation */}
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
    "La meilleure façon de gérer son temps, c'est de le planifier intelligemment"
  </p>
</div>

        {/* SECTION DROITE - Formulaire */}
        <div className={styles.rightSection}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Connexion</h1>
            <p className={styles.subtitle}>Accédez à votre espace</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Email */}
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

              {/* Mot de passe */}
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

              {/* Mot de passe oublié */}
              <div className={styles.forgotPassword}>
                <a href="#">Mot de passe oublié ?</a>
              </div>

              {/* Bouton Se connecter */}
              <button type="submit" className={styles.submitButton}>
                Se connecter
              </button>

              {/* Lien inscription */}
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