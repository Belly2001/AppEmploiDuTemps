import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import { getDepartements, getFormationsByDepartement, getEDTFormation } from '@/services/api'
import { FaCalendarAlt, FaArrowLeft, FaChalkboardTeacher, FaDoorOpen, FaClock, FaDownload } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function GestionEDT() {

  const [vue, setVue] = useState('departements')
  const [departements, setDepartements] = useState([])
  const [formations, setFormations] = useState([])
  const [edtData, setEdtData] = useState(null)
  const [deptSelectionne, setDeptSelectionne] = useState(null)
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
    chargerDepartements()
  }, [])

  const chargerDepartements = async () => {
    try {
      setChargement(true)
      const data = await getDepartements()
      setDepartements(data)
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const voirFormations = async (dept) => {
    try {
      setChargement(true)
      setDeptSelectionne(dept)
      const data = await getFormationsByDepartement(dept)
      setFormations(data)
      setVue('formations')
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const voirEDT = async (idFormation) => {
    try {
      setChargement(true)
      const data = await getEDTFormation(idFormation)
      setEdtData(data)
      setVue('edt')
    } catch (err) {
      console.error(err)
    } finally {
      setChargement(false)
    }
  }

  const retour = () => {
    if (vue === 'edt') {
      setVue('formations')
      setEdtData(null)
    } else if (vue === 'formations') {
      setVue('departements')
      setDeptSelectionne(null)
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
    if (!edtData) return null
    return edtData.cours.find(c => c.jour === jour && c.heure_debut === creneau.debut)
  }

  // ============ TÉLÉCHARGEMENT PDF ADMIN ============
  const telechargerPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // Couleurs
    const bleuFonce = [26, 26, 46]
    const blanc = [255, 255, 255]

    const nomFormation = edtData.formation.nom_formation || 'Formation'
    const niveau = edtData.formation.niveau || ''

    // En-tête
    doc.setFillColor(...bleuFonce)
    doc.rect(0, 0, 297, 35, 'F')
    doc.setTextColor(...blanc)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(`Emploi du Temps — ${nomFormation}`, 15, 15)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`${deptSelectionne || ''} — ${niveau}`, 15, 24)

    // Date
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    doc.setFontSize(9)
    doc.text(`Généré le ${dateStr}`, 250, 24)

    // Stats
    const nbCours = edtData.cours.length
    const nbCM = edtData.cours.filter(c => c.type_cours === 'CM').length
    const nbTD = edtData.cours.filter(c => c.type_cours === 'TD').length
    const nbTP = edtData.cours.filter(c => c.type_cours === 'TP').length
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Total : ${nbCours} cours  |  CM : ${nbCM}  |  TD : ${nbTD}  |  TP : ${nbTP}`, 15, 43)

    // Tableau
    const tableData = creneaux.map((creneau) => {
      const row = [creneau.label]
      jours.forEach((jour) => {
        const c = getCoursForSlot(jour, creneau)
        if (c) {
          row.push(`${c.matiere || 'Cours'}\n${c.type_cours}\n${c.enseignant || '—'}\n${c.salle || '—'}`)
        } else {
          row.push('')
        }
      })
      return row
    })

    autoTable(doc, {
      startY: 48,
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
        fontSize: 7.5,
        cellPadding: 4,
        valign: 'middle',
        minCellHeight: 22,
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

    // Liste des enseignants
    const enseignants = [...new Set(edtData.cours.map(c => c.enseignant).filter(Boolean))]
    if (enseignants.length > 0) {
      const finalY = doc.lastAutoTable.finalY + 10
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(26, 26, 46)
      doc.text('Enseignants concernés :', 15, finalY)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(enseignants.join('  •  '), 15, finalY + 6)
    }

    // Pied de page
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Schedule APP — Système de gestion des emplois du temps', 15, pageHeight - 8)
    doc.text('app-emploi-du-temps.vercel.app', 250, pageHeight - 8)

    // Télécharger
    const nomFichier = `EDT_${nomFormation.replace(/\s+/g, '_')}_${deptSelectionne || ''}.pdf`
    doc.save(nomFichier)
  }

  if (chargement) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Chargement...</div>
  }

  return (
    <div>
      {/* Fil d'Ariane */}
      {vue !== 'departements' && (
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <span onClick={() => { setVue('departements'); setDeptSelectionne(null) }}
            style={{ color: '#1a1a2e', cursor: 'pointer', textDecoration: 'underline' }}>
            Départements
          </span>
          {deptSelectionne && (
            <>
              <span style={{ color: '#999' }}>›</span>
              <span onClick={() => setVue('formations')}
                style={{ color: vue === 'formations' ? '#666' : '#1a1a2e', cursor: vue === 'edt' ? 'pointer' : 'default', textDecoration: vue === 'edt' ? 'underline' : 'none' }}>
                {deptSelectionne}
              </span>
            </>
          )}
          {vue === 'edt' && edtData && (
            <>
              <span style={{ color: '#999' }}>›</span>
              <span style={{ color: '#666' }}>{edtData.formation.nom_formation}</span>
            </>
          )}
        </div>
      )}

      {/* VUE DÉPARTEMENTS */}
      {vue === 'departements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {departements.map((dept) => (
            <div key={dept.departement} onClick={() => voirFormations(dept.departement)}
              className={styles.card}
              style={{ cursor: 'pointer', padding: '25px', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <FaCalendarAlt size={30} color="#1a1a2e" />
              <h3 style={{ color: '#1a1a2e', margin: '10px 0 5px', fontSize: '17px' }}>{dept.departement}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{dept.nb_formations} formation(s)</p>
            </div>
          ))}
        </div>
      )}

      {/* VUE FORMATIONS */}
      {vue === 'formations' && (
        <div>
          <button onClick={retour} className={`${styles.button} ${styles.buttonSecondary}`} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft size={14} /> Retour
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {formations.map((f) => (
              <div key={f.id_formation} onClick={() => voirEDT(f.id_formation)}
                className={styles.card}
                style={{ cursor: 'pointer', padding: '25px', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ color: '#1a1a2e', margin: '0 0 8px', fontSize: '17px' }}>{f.nom_formation}</h3>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#e8eaf6', color: '#3949ab', fontWeight: '600' }}>
                  {f.niveau}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VUE EDT */}
      {vue === 'edt' && edtData && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={retour} className={`${styles.button} ${styles.buttonSecondary}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaArrowLeft size={14} /> Retour aux formations
            </button>

            {edtData.cours.length > 0 && (
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
                Télécharger l'EDT
              </button>
            )}
          </div>

          {edtData.cours.length === 0 ? (
            <div className={styles.card} style={{ textAlign: 'center', padding: '50px' }}>
              <FaCalendarAlt size={50} color="#ccc" />
              <h4 style={{ color: '#666', marginTop: '15px' }}>Aucun cours planifié</h4>
              <p style={{ color: '#999' }}>Générez l'emploi du temps depuis la section Départements.</p>
            </div>
          ) : (
            <div className={styles.card} style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
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
                        const cours = getCoursForSlot(jour, creneau)
                        return (
                          <td key={`${jour}-${creneau.debut}`} style={{
                            padding: '8px', borderBottom: '1px solid #e0e0e0',
                            backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white',
                            verticalAlign: 'top'
                          }}>
                            {cours ? (
                              <div style={{
                                ...getTypeStyle(cours.type_cours),
                                borderRadius: '8px', padding: '10px',
                                fontSize: '12px', minHeight: '70px'
                              }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>
                                  {cours.matiere}
                                </div>
                                <span style={{
                                  display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
                                  fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.6)',
                                  marginBottom: '5px'
                                }}>
                                  {cours.type_cours}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
                                  <FaChalkboardTeacher size={10} /> {cours.enseignant}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '11px', opacity: 0.8 }}>
                                  <FaDoorOpen size={10} /> {cours.salle}
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
          )}
        </div>
      )}
    </div>
  )
}