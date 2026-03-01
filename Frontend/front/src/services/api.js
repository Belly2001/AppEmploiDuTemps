const API_URL = "https://appemploidutemps.onrender.com/schedule"

// ========== ENSEIGNANTS ==========

export async function getEnseignants() {
  const res = await fetch(`${API_URL}/admin/enseignants/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des enseignants')
  return await res.json()
}

export async function getEnseignant(id) {
  const res = await fetch(`${API_URL}/admin/enseignants/${id}/`)
  if (!res.ok) throw new Error('Enseignant non trouvé')
  return await res.json()
}

export async function apiAjouterEnseignant(data) {
  const res = await fetch(`${API_URL}/admin/enseignants/add/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err ? JSON.stringify(err) : "Erreur lors de l'ajout")
  }
  return await res.json()
}

export async function apiSupprimerEnseignant(id) {
  const res = await fetch(`${API_URL}/admin/enseignants/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!res.ok && res.status !== 204) throw new Error('Erreur lors de la suppression')
  return true
}

export async function apiModifierEnseignant(id, data) {
  const res = await fetch(`${API_URL}/admin/enseignants/${id}/modify/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur lors de la modification')
  return await res.json()
}

// ========== SALLES ==========

export async function getSalles() {
  const res = await fetch(`${API_URL}/admin/salles/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des salles')
  return await res.json()
}

export async function getSallesDisponibles() {
  const res = await fetch(`${API_URL}/admin/salles/disponibles/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des salles disponibles')
  return await res.json()
}

// ========== COURS ==========

export async function getCours() {
  const res = await fetch(`${API_URL}/admin/cours/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des cours')
  return await res.json()
}

export async function apiAjouterCours(data) {
  const res = await fetch(`${API_URL}/admin/cours/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err ? JSON.stringify(err) : "Erreur lors de l'ajout du cours")
  }
  return await res.json()
}

export async function apiSupprimerCours(numCours) {
  const res = await fetch(`${API_URL}/admin/cours/${numCours}/`, {
    method: 'DELETE'
  })
  if (!res.ok && res.status !== 204) throw new Error('Erreur lors de la suppression du cours')
  return true
}

// ========== EDT ==========

export async function getEDT() {
  const res = await fetch(`${API_URL}/admin/edt/`)
  if (!res.ok) throw new Error("Erreur lors du chargement de l'emploi du temps")
  return await res.json()
}

// ========== NOTIFICATIONS ==========

export async function getNotificationsEnseignant(id) {
  const res = await fetch(`${API_URL}/enseignant/${id}/notifications/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des notifications')
  return await res.json()
}

// ========== ADMIN ==========

export async function getAdminInfo(idAdmin) {
  const res = await fetch(`${API_URL}/admin/me/${idAdmin}/`)
  if (!res.ok) throw new Error("Erreur lors du chargement du profil admin")
  return await res.json()
}

// ========== LOGIN ==========

export async function loginUser(email, motDePasse) {
  const res = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, mot_de_passe: motDePasse })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail || 'Erreur de connexion')
  }
  return await res.json()
}

// ========== DISPONIBILITES ==========

export async function getDisponibilites(idEnseignant) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/disponibilites/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des disponibilités')
  return await res.json()
}

export async function apiAjouterDisponibilite(idEnseignant, data) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/disponibilites/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err ? JSON.stringify(err) : "Erreur lors de l'ajout")
  }
  return await res.json()
}

export async function apiSupprimerDisponibilite(idDispo) {
  const res = await fetch(`${API_URL}/disponibilite/${idDispo}/delete/`, {
    method: 'DELETE'
  })
  if (!res.ok && res.status !== 204) throw new Error('Erreur lors de la suppression')
  return true
}

// ========== SALLES CRUD ==========

export async function apiAjouterSalle(data) {
  const res = await fetch(`${API_URL}/admin/salles/add/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err ? JSON.stringify(err) : "Erreur lors de l'ajout de la salle")
  }
  return await res.json()
}

export async function apiSupprimerSalle(idSalle) {
  const res = await fetch(`${API_URL}/admin/salles/${idSalle}/delete/`, {
    method: 'DELETE'
  })
  if (!res.ok && res.status !== 204) throw new Error('Erreur lors de la suppression de la salle')
  return true
}
// ========== NOTIFICATIONS ==========

export async function apiEnvoyerNotification(data) {
  const res = await fetch(`${API_URL}/admin/notification/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err ? JSON.stringify(err) : "Erreur lors de l'envoi")
  }
  return await res.json()
}

// ========== DEMANDES ==========

export async function getDemandesEnseignant(idEnseignant) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/demandes/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des demandes')
  return await res.json()
}

export async function apiEnvoyerDemande(idEnseignant, data) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/demandes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err ? JSON.stringify(err) : "Erreur lors de l'envoi")
  }
  return await res.json()
}

export async function getDemandesAdmin() {
  const res = await fetch(`${API_URL}/admin/demandes/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des demandes')
  return await res.json()
}

export async function apiRepondreDemande(idDemande, data) {
  const res = await fetch(`${API_URL}/admin/demandes/${idDemande}/repondre/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur lors de la réponse')
  return await res.json()
}

// ========== FORMATIONS & MATIERES ==========

export async function getFormations(departement) {
  const url = departement 
    ? `${API_URL}/formations/?departement=${encodeURIComponent(departement)}`
    : `${API_URL}/formations/`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Erreur lors du chargement des formations')
  return await res.json()
}

export async function getMatieresByFormation(idFormation) {
  const res = await fetch(`${API_URL}/formations/${idFormation}/matieres/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des matières')
  return await res.json()
}

export async function apiChoisirMatieres(idEnseignant, matieres) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/choisir-matieres/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matieres })
  })
  if (!res.ok) throw new Error('Erreur lors de l\'enregistrement des matières')
  return await res.json()
}

export async function getMatieresEnseignant(idEnseignant) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/matieres/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des matières')
  return await res.json()
}

export async function getEDTEnseignant(idEnseignant) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/edt/`)
  if (!res.ok) throw new Error('Erreur lors du chargement de l\'EDT')
  return await res.json()
}

// ========== DÉPARTEMENTS & STATUTS ==========

export async function getDepartements() {
  const res = await fetch(`${API_URL}/admin/departements/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des départements')
  return await res.json()
}

export async function getFormationsByDepartement(departement) {
  const res = await fetch(`${API_URL}/admin/departements/${encodeURIComponent(departement)}/formations/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des formations')
  return await res.json()
}

export async function getEnseignantsByFormation(idFormation) {
  const res = await fetch(`${API_URL}/admin/formations/${idFormation}/enseignants/`)
  if (!res.ok) throw new Error('Erreur lors du chargement des enseignants')
  return await res.json()
}

export async function rechercherEnseignant(query) {
  const res = await fetch(`${API_URL}/admin/recherche-enseignant/?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Erreur lors de la recherche')
  return await res.json()
}

export async function apiGenererEDT(idFormation) {
  const res = await fetch(`${API_URL}/admin/formations/${idFormation}/generer-edt/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail || "Erreur lors de la génération")
  }
  return await res.json()
}

export async function getEDTFormation(idFormation) {
  const res = await fetch(`${API_URL}/admin/formations/${idFormation}/edt/`)
  if (!res.ok) throw new Error("Erreur chargement EDT formation")
  return await res.json()
}

export async function getEDTPersonnel(idEnseignant) {
  const res = await fetch(`${API_URL}/enseignant/${idEnseignant}/edt/`)
  if (!res.ok) throw new Error("Erreur chargement EDT")
  return await res.json()
}


// DEMANDES D'INSCRIPTION 

// soumettre une demande (candidat)
export async function apiSoumettreDemandeInscription(data) {
  const res = await fetch(`${API_URL}/inscription/demande/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail || "Erreur lors de l'envoi de la demande")
  }
  return await res.json()
}

// verifier où en est la demande (candidat)
export async function apiVerifierStatutDemande(email) {
  const res = await fetch(`${API_URL}/inscription/statut/?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Aucune demande trouvée')
  return await res.json()
}

// lister toutes les demandes (admin)
export async function apiGetDemandesInscription() {
  const res = await fetch(`${API_URL}/admin/inscriptions/`)
  if (!res.ok) throw new Error('Erreur chargement des demandes')
  return await res.json()
}

// accepter ou rejeter une demande (admin)
export async function apiRepondreDemandeInscription(idDemande, data) {
  const res = await fetch(`${API_URL}/admin/inscriptions/${idDemande}/repondre/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Erreur lors de la réponse')
  return await res.json()
}