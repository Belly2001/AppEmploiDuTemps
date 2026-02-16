import { useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/Accueil.module.css'

export default function Home() {
  return (
    <div className={styles.landingPage}>
      {/* Navigation en haut */}
      <nav className={styles.nav}>
        <Link href="/"><button className={styles.navButton}>Accueil</button></Link>
        <button className={styles.navButton}>A propos</button>
        <button className={styles.navButton}>Infos</button>
        <Link href="/connexion"><button className={styles.navButton}>Connexion</button></Link>
      </nav>

      {/* Section Hero centrée */}
      <div className={styles.heroSection}>
        {/* Titre principal */}
        <h1 className={styles.mainTitle}>
          Schedule APP
        </h1>

        {/* Sous-titre */}
        <p className={styles.subtitle}>
     Automatisez la création de vos emplois du temps et gagnez un temps précieux
        </p>

        {/* Gros bouton Call-to-Action */}
        <Link href="/connexion">
          <button className={styles.ctaButton}>
            Commencer maintenant
          </button>
        </Link>
      </div>
    </div>
  )
}