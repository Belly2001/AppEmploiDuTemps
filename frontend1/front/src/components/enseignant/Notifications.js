import { useState } from 'react'
import styles from '@/styles/Enseignant.module.css'

export default function Notifications({ enseignant }) {
  
  // Liste des notifications (simulation)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      titre: 'Nouveau cours ajouté',
      message: 'Un cours de Programmation Web vous a été assigné pour le lundi 8h-10h.',
      date: '2025-11-10 14:30',
      lue: false
    },
    {
      id: 2,
      titre: 'Changement de salle',
      message: 'Votre cours du mardi a été déplacé en salle B2.',
      date: '2025-11-09 09:15',
      lue: true
    },
    {
      id: 3,
      titre: 'Réponse à votre demande',
      message: 'L\'administration a accepté votre demande d\'absence du 15 novembre.',
      date: '2025-11-08 16:45',
      lue: true
    }
  ])

  // Marquer une notification comme lue
  const marquerCommeLue = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, lue: true } : notif
      )
    )
    // TODO: Appel API pour mettre à jour en BDD
    console.log('Notification marquée comme lue:', id)
  }

  // Marquer toutes comme lues
  const toutMarquerCommeLu = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, lue: true }))
    )
    // TODO: Appel API
  }

  // Supprimer une notification
  const supprimerNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    // TODO: Appel API
  }

  // Compter les non lues
  const nbNonLues = notifications.filter(n => !n.lue).length

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            Mes notifications
            {nbNonLues > 0 && (
              <span style={{
                marginLeft: '10px',
                padding: '4px 10px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '20px',
                fontSize: '13px'
              }}>
                {nbNonLues} nouvelle(s)
              </span>
            )}
          </h3>
          {nbNonLues > 0 && (
            <button
              onClick={toutMarquerCommeLu}
              className={`${styles.button} ${styles.buttonSecondary}`}
              style={{ fontSize: '13px', padding: '8px 15px' }}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <h4 className={styles.emptyTitle}>Aucune notification</h4>
            <p className={styles.emptyText}>
              Vous n'avez pas de notification pour le moment.
            </p>
          </div>
        ) : (
          <div className={styles.notifList}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notifItem} ${!notif.lue ? styles.notifNonLue : ''}`}
                onClick={() => !notif.lue && marquerCommeLue(notif.id)}
                style={{ cursor: !notif.lue ? 'pointer' : 'default' }}
              >
                <span className={styles.notifIcon}>
                  {!notif.lue ? '🔵' : '⚪'}
                </span>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitre}>{notif.titre}</div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                  <div className={styles.notifDate}>{notif.date}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    supprimerNotification(notif.id)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#999'
                  }}
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}