import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getNotificationsEnseignant } from '@/services/api'

export default function Notifications({ enseignant }) {
  
  const [notifications, setNotifications] = useState([])
  const [chargement, setChargement] = useState(true)

  // Charger les notifications depuis la base
  useEffect(() => {
    if (enseignant && enseignant.id) {
      chargerNotifications()
    }
  }, [enseignant])

  const chargerNotifications = async () => {
    try {
      setChargement(true)
      const data = await getNotificationsEnseignant(enseignant.id)
      setNotifications(data)
    } catch (err) {
      console.error('Erreur chargement notifications:', err)
    } finally {
      setChargement(false)
    }
  }

  // Marquer comme lue via API
  const marquerCommeLue = async (id_notification) => {
    try {
      await fetch(`http://localhost:8000/schedule/notification/${id_notification}/lue/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      await chargerNotifications()
    } catch (err) {
      console.error('Erreur marquage notification:', err)
    }
  }

  // Marquer toutes comme lues
  const toutMarquerCommeLu = async () => {
    try {
      const nonLues = notifications.filter(n => !n.est_lue)
      for (const notif of nonLues) {
        await fetch(`http://localhost:8000/schedule/notification/${notif.id_notification}/lue/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        })
      }
      await chargerNotifications()
    } catch (err) {
      console.error('Erreur marquage notifications:', err)
    }
  }

  const nbNonLues = notifications.filter(n => !n.est_lue).length

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement des notifications...</div>
  }

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
                key={notif.id_notification}
                className={`${styles.notifItem} ${!notif.est_lue ? styles.notifNonLue : ''}`}
                onClick={() => !notif.est_lue && marquerCommeLue(notif.id_notification)}
                style={{ cursor: !notif.est_lue ? 'pointer' : 'default' }}
              >
                <span className={styles.notifIcon}>
                  {!notif.est_lue ? '🔵' : '⚪'}
                </span>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitre}>{notif.titre}</div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                  <div className={styles.notifDate}>
                    {new Date(notif.date_envoi).toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}