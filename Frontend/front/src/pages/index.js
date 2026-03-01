import { useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/Accueil.module.css'

// -- icones react-icons (on prend que ce qu'on a besoin)
import { 
  FaCalendarAlt, FaChalkboardTeacher, FaBuilding, FaFilePdf, 
  FaPlay, FaArrowRight, FaUserPlus, FaClock, FaMagic, 
  FaDownload, FaBell, FaShieldAlt
} from 'react-icons/fa'

export default function Home() {

  // les étapes pour la section "comment ça marche"
  const etapes = [
    {
      numero: '01',
      icon: <FaUserPlus size={24} />,
      titre: 'Inscrivez vous',
      desc: 'Renseignez vos informations personnelles; votre departement de choix , et reçevez un accès personnel.',
    },
    {
      numero: '02',
      icon: <FaClock size={24} />,
      titre: 'Renseignez les disponibilités',
      desc: 'Les enseignants indiquent leurs créneaux disponibles, et vos préférences horaires de chacun de votre(ou vos) ;matière(s) directement depuis leur espace.',
    },
    {
      numero: '03',
      icon: <FaMagic size={24} />,
      titre: 'Générez automatiquement',
      desc: "L'algorithme crée l'emploi du temps en respectant les contraintes : disponibilités, salles, capacités et équipements.",
    },
    {
      numero: '04',
      icon: <FaDownload size={24} />,
      titre: 'Exportez en pdf ',
      desc: "Visualisez le résultat, modifiez si besoin, puis exportez en PDF à tout moment.",
    },
  ]

  // les avantages clés de la plateforme
  const avantages = [
    {
      icon: <FaCalendarAlt size={22} />,
      titre: 'Gain de temps',
      desc: 'Quelques clics et notre algorithme fait le reste. Un emploi du temps complet en quelques minutes.',
    },
    {
      icon: <FaShieldAlt size={22} />,
      titre: 'Zéro conflit',
      desc: "L'algorithme vérifie automatiquement qu'il n'y a aucun chevauchement de salle ou d'enseignant.",
    },
    {
      icon: <FaBell size={22} />,
      titre: 'Notifications en temps réel',
      desc: 'Les enseignants sont prévenus instantanément en cas de modification de leur emploi du temps.',
    },
    {
      icon: <FaBuilding size={22} />,
      titre: 'Gestion des salles',
      desc: 'On vous trouve amphi, salles , Laboratoire , etc... le tout est gérer de ne vous en faites pas .',
    },
    {
      icon: <FaChalkboardTeacher size={22} />,
      titre: 'Espace enseignant dédié',
      desc: 'Vous pouver consulter votre EDT, gérer vos disponibilités et faire des demandes auprès de l\'administration .',
    },
    {
      icon: <FaFilePdf size={22} />,
      titre: 'Export PDF',
      desc: 'Exportez les emplois du temps des formations dans lesquels vous enseignez,au format PDF.',
    },
  ]

  return (
    <div className={styles.landingPage}>
      {/* petit effet de grain sur toute la page */}
      <div className={styles.grain}></div>

      {/* ============ NAVBAR ============ */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          Schedule<span className={styles.logoAccent}>APP</span>
        </div>
        <div className={styles.navLinks}>
          {/* scroll vers la section demo quand on clique */}
          <a href="#comment-ca-marche" className={styles.navLink}>À propos</a>
          <Link href="/inscription">
            <button className={styles.navLinkInscription}>S&apos;inscrire</button>
          </Link>
          <Link href="/connexion">
            <button className={styles.navLinkConnexion}>Se connecter</button>
          </Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot}></span>
          Plateforme de gestion universitaire
        </div>

        <h1 className={styles.heroTitle}>
          Créez vos emplois du temps{' '}
          <span className={styles.gradientText}>automatiquement</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Automatisez la création de vos emplois du temps et gérer vos disponibilités en quelques clics.
           
        </p>

        <div className={styles.heroCta}>
          <Link href="/connexion">
            <button className={styles.btnPrimary}>
              Commencer maintenant
              <FaArrowRight className={styles.arrow} />
            </button>
          </Link>
          {/* ce bouton scroll vers la section démo en bas */}
          <a href="#comment-ca-marche" style={{ textDecoration: 'none' }}>
            <button className={styles.btnSecondary}>
              <span className={styles.playIcon}>
                <FaPlay size={10} />
              </span>
              Voir la démo
            </button>
          </a>
        </div>

        {/* petite barre de features en bas du hero */}
        <div className={styles.featuresStrip}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaCalendarAlt /></div>
            Génération automatique
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaChalkboardTeacher /></div>
            Gestion des enseignants
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaBuilding /></div>
            Gestion des salles
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaFilePdf /></div>
            Export PDF
          </div>
        </div>
      </section>

      {/* ============ COMMENT CA MARCHE ============ */}
      <section className={styles.sectionDemo} id="comment-ca-marche">
        
        {/* petit label au dessus du titre, comme un tag */}
        <div className={styles.sectionLabel}>Comment ça marche</div>

        {/* les 4 cartes étapes */}
        <div className={styles.stepsGrid}>
          {etapes.map((etape, i) => (
            <div className={styles.stepCard} key={i}>
              <span className={styles.stepNumero}>{etape.numero}</span>
              <div className={styles.stepIconBox}>{etape.icon}</div>
              <h3 className={styles.stepTitre}>{etape.titre}</h3>
              <p className={styles.stepDesc}>{etape.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ POURQUOI NOUS CHOISIR ============ */}
      <section className={styles.sectionAvantages}>
        <div className={styles.sectionLabel}>Pourquoi nous choisir</div>

        <h2 className={styles.sectionTitle}>
          Tout ce qu&apos;il faut pour gérer<br />
          <span className={styles.gradientText}>vos emplois du temps</span>
        </h2>

        <p className={styles.sectionSubtitle}>
          Une solution complète pensée pour les universités 
          et établissements scolaires.
        </p>

        {/* grille 3x2 d'avantages */}
        <div className={styles.avantagesGrid}>
          {avantages.map((item, i) => (
            <div className={styles.avantageCard} key={i}>
              <div className={styles.avantageIcon}>{item.icon}</div>
              <h3 className={styles.avantageTitre}>{item.titre}</h3>
              <p className={styles.avantageDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            Schedule<span className={styles.logoAccent}>APP</span>
          </div>
          <p className={styles.footerText}>
            © 2026 Schedule APP — Projet universitaire L3 Informatique
          </p>
        </div>
      </footer>
    </div>
  )
}