import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/Connexion.module.css'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setChargement(true)

    try {
      // TODO: Le backend n'a pas encore de route /login
      // Quand elle sera prête, décommente ce bloc :
      //
      // const res = await fetch('http://localhost:8000/schedule/login/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, mot_de_passe: password })
      // })
      //
      // if (!res.ok) {
      //   setErreur('Email ou mot de passe incorrect')
      //   return
      // }
      //
      // const data = await res.json()
      // localStorage.setItem('user', JSON.stringify(data))
      //
      // if (data.role === 'admin') {
      //   router.push('/admin')
      // } else {
      //   router.push('/enseignant')
      // }

      // SIMULATION en attendant la route login
      console.log('Connexion:', { email, password })
      
      if (email.includes('admin')) {
        router.push('/admin')
      } else {
        router.push('/enseignant')
      }

    } catch (err) {
      console.error('Erreur connexion:', err)
      setErreur('Erreur de connexion au serveur')
    } finally {
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

              <button type="submit" className={styles.submitButton} disabled={chargement}>
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