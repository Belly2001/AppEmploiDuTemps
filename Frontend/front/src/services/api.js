const API_URL = 'http://localhost:8000/schedule'

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
  // Le backend renvoie 204 sans body, donc pas de res.json()
  return true
}

export async function apiModifierEnseignant(id, data) {
  const res = await fetch(`${API_URL}/admin/enseignants/${id}/modify/`, {
    method: 'PATCH',  // Le backend utilise PATCH, pas PUT
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