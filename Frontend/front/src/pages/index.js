import { useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/Accueil.module.css'
import { FaCalendarAlt, FaChalkboardTeacher, FaBuilding, FaFilePdf, FaPlay, FaArrowRight } from 'react-icons/fa'

export default function Home() {
  return (
    <div className={styles.landingPage}>
      {/* Grain overlay */}
      <div className={styles.grain}></div>

      {/* Navigation glassmorphism */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          Schedule<span className={styles.logoAccent}>APP</span>
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navLink}>À propos</button>
          <Link href="/inscription">
            <button className={styles.navLinkInscription}>S&apos;inscrire</button>
          </Link>
          <Link href="/connexion">
            <button className={styles.navLinkConnexion}>Se connecter</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Badge */}
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot}></span>
          Plateforme de gestion universitaire
        </div>

        {/* Titre */}
        <h1 className={styles.heroTitle}>
          Créez vos emplois du temps{' '}
          <span className={styles.gradientText}>automatiquement</span>
        </h1>

        {/* Sous-titre */}
        <p className={styles.heroSubtitle}>
          Automatisez la création de vos emplois du temps, gérez les disponibilités 
          des enseignants et optimisez l&apos;utilisation des salles en quelques clics.
        </p>

        {/* Boutons CTA */}
        <div className={styles.heroCta}>
          <Link href="/connexion">
            <button className={styles.btnPrimary}>
              Commencer maintenant
              <FaArrowRight className={styles.arrow} />
            </button>
          </Link>
          <button className={styles.btnSecondary}>
            <span className={styles.playIcon}>
              <FaPlay size={10} />
            </span>
            Voir la démo
          </button>
        </div>

        {/* Features strip */}
        <div className={styles.featuresStrip}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaCalendarAlt />
            </div>
            Génération automatique
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaChalkboardTeacher />
            </div>
            Gestion des enseignants
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaBuilding />
            </div>
            4 bâtiments, 122 salles
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaFilePdf />
            </div>
            Export PDF
          </div>
        </div>
      </section>
    </div>
  )
}