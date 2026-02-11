import { useState } from 'react'
import styles from '@/styles/Enseignant.module.css'

export default function EmploiDuTemps({ enseignant }) {
  
  // Liste des cours (vide au début, sera rempli par l'admin)
  const [cours, setCours] = useState([])

  // Pour l'exemple, on peut simuler des cours plus tard
  // const [cours, setCours] = useState([
  //   { id: 1, intitule: 'Programmation Web', jour: 'Lundi', heureDebut: '08:00', heureFin: '10:00', salle: 'Salle A1', type: 'TP' },
  //   { id: 2, intitule: 'Base de données', jour: 'Mardi', heureDebut: '14:00', heureFin: '16:00', salle: 'Salle B2', type: 'CM' }
  // ])

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Mon emploi du temps</h3>
          {cours.length > 0 && (
            <button className={`${styles.button} ${styles.buttonSecondary}`}>
              📥 Exporter PDF
            </button>
          )}
        </div>

        {cours.length === 0 ? (
          // État vide : aucun cours assigné
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h4 className={styles.emptyTitle}>Aucun cours assigné</h4>
            <p className={styles.emptyText}>
              Votre emploi du temps est vide pour le moment. 
              L'administration vous assignera des cours en fonction de vos disponibilités.
            </p>
            <p className={styles.emptyText} style={{ marginTop: '15px', fontSize: '14px' }}>
              💡 Pensez à bien renseigner vos disponibilités dans la section dédiée.
            </p>
          </div>
        ) : (
          // Affichage des cours quand il y en a
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Horaires</th>
                <th>Cours</th>
                <th>Type</th>
                <th>Salle</th>
              </tr>
            </thead>
            <tbody>
              {cours.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.jour}</strong></td>
                  <td>{c.heureDebut} - {c.heureFin}</td>
                  <td>{c.intitule}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: c.type === 'CM' ? '#e8f4fc' : c.type === 'TD' ? '#fff3e0' : '#e8f5e9',
                      color: c.type === 'CM' ? '#1976d2' : c.type === 'TD' ? '#f57c00' : '#388e3c'
                    }}>
                      {c.type}
                    </span>
                  </td>
                  <td>{c.salle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}