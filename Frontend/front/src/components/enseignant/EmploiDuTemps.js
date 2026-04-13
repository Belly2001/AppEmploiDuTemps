import { useState, useEffect } from 'react'
import styles from '@/styles/Enseignant.module.css'
import { getEDTPersonnel } from '@/services/api'
import { FaCalendarAlt, FaChalkboardTeacher, FaDoorOpen, FaClock, FaDownload } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function EmploiDuTemps({ enseignant }) {

  const [cours, setCours] = useState([])
  const [chargement, setChargement] = useState(true)

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  const creneaux = [
    { label: '08h20 - 10h20', debut: '08:20', fin: '10:20' },
    { label: '10h50 - 12h50', debut: '10:50', fin: '12:50' },
    { label: '14h10 - 16h10', debut: '14:10', fin: '16:10' },
    { label: '16h25 - 18h25', debut: '16:25', fin: '18:25' },
    { label: '18h30 - 20h30', debut: '18:30', fin: '20:30' },
  ]

  useEffect(() => {
    if (enseignant && enseignant.id) {
      chargerEDT()
    }
  }, [enseignant])

  const chargerEDT = async () => {
    try {
      setChargement(true)
      const data = await getEDTPersonnel(enseignant.id)
      setCours(data)
    } catch (err) {
      console.error('Erreur chargement EDT:', err)
    } finally {
      setChargement(false)
    }
  }

  const getTypeStyle = (type) => {
    switch (type) {
      case 'CM': return { backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb' }
      case 'TD': return { backgroundColor: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2' }
      case 'TP': return { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }
      case 'Labo': return { backgroundColor: '#f3e5f5', color: '#7b1fa2', border: '1px solid #ce93d8' }
      default: return { backgroundColor: '#f5f5f5', color: '#666' }
    }
  }

  const getCoursForSlot = (jour, creneau) => {
    return cours.find(c => c.jour === jour && c.heure_debut === creneau.debut)
  }

  // ============ TÉLÉCHARGEMENT PDF ============
  const telechargerPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // Couleurs
    const bleuFonce = [26, 26, 46]
    const bleuClair = [214, 228, 240]
    const blanc = [255, 255, 255]

    // Titre
    doc.setFillColor(...bleuFonce)
    doc.rect(0, 0, 297, 32, 'F')
    doc.setTextColor(...blanc)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Emploi du Temps', 15, 15)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`${enseignant.prenom} ${enseignant.nom} — ${enseignant.departement || ''}`, 15, 24)

    // Date de génération
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    doc.setFontSize(9)
    doc.text(`Généré le ${dateStr}`, 250, 24)

    // Stats
    const nbCM = cours.filter(c => c.type_cours === 'CM').length
    const nbTD = cours.filter(c => c.type_cours === 'TD').length
    const nbTP = cours.filter(c => c.type_cours === 'TP').length
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Total : ${cours.length} cours  |  CM : ${nbCM}  |  TD : ${nbTD}  |  TP : ${nbTP}`, 15, 40)

    // Tableau
    const tableData = creneaux.map((creneau) => {
      const row = [creneau.label]
      jours.forEach((jour) => {
        const c = getCoursForSlot(jour, creneau)
        if (c) {
          row.push(`${c.matiere_nom || c.matiere || 'Cours'}\n${c.type_cours}\n${c.salle_nom || c.salle || '—'}`)
        } else {
          row.push('')
        }
      })
      return row
    })

    autoTable(doc, {
      startY: 45,
      head: [['Créneaux', ...jours]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: bleuFonce,
        textColor: blanc,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 4,
        valign: 'middle',
        minCellHeight: 18,
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [245, 245, 245], cellWidth: 35, halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index > 0 && data.cell.raw) {
          const text = data.cell.raw
          if (text.includes('CM')) {
            data.cell.styles.fillColor = [227, 242, 253]
            data.cell.styles.textColor = [21, 101, 192]
          } else if (text.includes('TD')) {
            data.cell.styles.fillColor = [255, 243, 224]
            data.cell.styles.textColor = [230, 81, 0]
          } else if (text.includes('TP')) {
            data.cell.styles.fillColor = [232, 245, 233]
            data.cell.styles.textColor = [46, 125, 50]
          }
        }
      },
      margin: { left: 15, right: 15 },
    })

    // Pied de page
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Schedule APP — Système de gestion des emplois du temps', 15, pageHeight - 8)
    doc.text('app-emploi-du-temps.vercel.app', 250, pageHeight - 8)

    // Télécharger
    doc.save(`EDT_${enseignant.prenom}_${enseignant.nom}.pdf`)
  }

  // Compter les cours par type
  const nbCM = cours.filter(c => c.type_cours === 'CM').length
  const nbTD = cours.filter(c => c.type_cours === 'TD').length
  const nbTP = cours.filter(c => c.type_cours === 'TP').length

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement de l'emploi du temps...</div>
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>{cours.length}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Total cours</div>
        </div>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1565c0' }}>{nbCM}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>CM</div>
        </div>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#e65100' }}>{nbTD}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>TD</div>
        </div>
        <div className={styles.card} style={{ padding: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2e7d32' }}>{nbTP}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>TP</div>
        </div>
      </div>

      {cours.length === 0 ? (
        <div className={styles.card} style={{ textAlign: 'center', padding: '50px' }}>
          <FaCalendarAlt size={50} color="#ccc" />
          <h4 style={{ color: '#666', marginTop: '15px' }}>Aucun cours assigné</h4>
          <p style={{ color: '#999' }}>
            Votre emploi du temps sera disponible une fois que l'administration l'aura généré.
          </p>
        </div>
      ) : (
        <>
          {/* Bouton télécharger */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
            <button
              onClick={telechargerPDF}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', backgroundColor: '#1a1a2e', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2d2d5e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a2e'}
            >
              <FaDownload size={14} />
              Télécharger mon EDT
            </button>
          </div>

          <div className={styles.card} style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 10px', backgroundColor: '#1a1a2e', color: 'white', borderRadius: '8px 0 0 0', textAlign: 'left', fontSize: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaClock size={14} /> Créneaux</span>
                  </th>
                  {jours.map((jour, i) => (
                    <th key={jour} style={{
                      padding: '12px 10px', backgroundColor: '#1a1a2e', color: 'white',
                      textAlign: 'center', fontSize: '14px', fontWeight: '600',
                      borderRadius: i === jours.length - 1 ? '0 8px 0 0' : '0'
                    }}>
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {creneaux.map((creneau, rowIndex) => (
                  <tr key={creneau.label}>
                    <td style={{
                      padding: '15px 10px', fontWeight: '600', fontSize: '13px', color: '#1a1a2e',
                      backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #e0e0e0', whiteSpace: 'nowrap'
                    }}>
                      {creneau.label}
                    </td>
                    {jours.map((jour) => {
                      const c = getCoursForSlot(jour, creneau)
                      return (
                        <td key={`${jour}-${creneau.debut}`} style={{
                          padding: '8px', borderBottom: '1px solid #e0e0e0',
                          backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                          verticalAlign: 'top'
                        }}>
                          {c ? (
                            <div style={{
                              ...getTypeStyle(c.type_cours),
                              borderRadius: '8px', padding: '10px',
                              fontSize: '12px', minHeight: '60px'
                            }}>
                              <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>
                                {c.matiere_nom || 'Cours'}
                              </div>
                              <span style={{
                                display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
                                fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.6)',
                                marginBottom: '5px'
                              }}>
                                {c.type_cours}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
                                <FaDoorOpen size={10} /> {c.salle_nom || '—'}
                              </div>
                            </div>
                          ) : null}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}