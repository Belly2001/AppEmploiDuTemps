from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import time, date, timedelta



from .models import Enseignant, Salle, Cours, EmploiDuTemps, Notification, Administrateur, Disponibilite, Demande, Formation, Matiere, EnseignantMatiere
from .serializers import (
    EnseignantSerializer, SalleSerializer, CoursSerializer,
    EDTSerializer, NotificationSerializer, AdminMeSerializer, DisponibiliteSerializer, DemandeSerializer,
    FormationSerializer, MatiereSerializer
)

@api_view(["GET"])
@permission_classes([AllowAny])
def home(request):
    return Response({"message": "API OK"})

# ---------------------------
# ENSEIGNANTS
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def retourner_all_enseignants(request):
    qs = Enseignant.objects.all().order_by("nom")
    return Response(EnseignantSerializer(qs, many=True).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def retourner_un_enseignant(request, id):
    try:
        ens = Enseignant.objects.get(id_enseignant=id)
    except Enseignant.DoesNotExist:
        return Response({"detail": "Enseignant introuvable"}, status=404)
    return Response(EnseignantSerializer(ens).data)

@api_view(["POST"])
@permission_classes([AllowAny])
def ajouter_enseignant(request):
    ser = EnseignantSerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

@api_view(["DELETE"])
@permission_classes([AllowAny])
def supprimerEnseignant(request, id):
    try:
        ens = Enseignant.objects.get(id_enseignant=id)
    except Enseignant.DoesNotExist:
        return Response({"detail": "Enseignant introuvable"}, status=404)
    ens.delete()
    return Response(status=204)

@api_view(["PATCH"])
@permission_classes([AllowAny])
def modifier_enseignant(request, id_enseignant):
    try:
        ens = Enseignant.objects.get(id_enseignant=id_enseignant)
    except Enseignant.DoesNotExist:
        return Response({"detail": "Enseignant introuvable"}, status=404)

    ser = EnseignantSerializer(ens, data=request.data, partial=True)
    if ser.is_valid():
        ser.save()
        return Response(ser.data)
    return Response(ser.errors, status=400)

# ---------------------------
# SALLES
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def retourner_salles(request):
    qs = Salle.objects.all().order_by("nom_salle")
    return Response(SalleSerializer(qs, many=True).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def retourner_salles_disponibles(request):
    qs = Salle.objects.filter(est_disponible=True).order_by("nom_salle")
    return Response(SalleSerializer(qs, many=True).data)

# ---------------------------
# COURS
# ---------------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def admin_cours(request):
    if request.method == "GET":
        qs = Cours.objects.select_related("id_matiere", "id_enseignant").all().order_by("intitule")
        return Response(CoursSerializer(qs, many=True).data)

    ser = CoursSerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

@api_view(["DELETE", "PATCH"])
@permission_classes([AllowAny])
def admin_cours_detail(request, num_cours):
    try:
        c = Cours.objects.get(num_cours=num_cours)
    except Cours.DoesNotExist:
        return Response({"detail": "Cours introuvable"}, status=404)

    if request.method == "DELETE":
        c.delete()
        return Response(status=204)

    ser = CoursSerializer(c, data=request.data, partial=True)
    if ser.is_valid():
        ser.save()
        return Response(ser.data)
    return Response(ser.errors, status=400)

# ---------------------------
# EDT
# ---------------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def admin_edt(request):
    if request.method == "GET":
        qs = EmploiDuTemps.objects.select_related("num_cours", "id_salle").all().order_by("date", "jour")
        return Response(EDTSerializer(qs, many=True).data)

    ser = EDTSerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

# ---------------------------
# NOTIFICATIONS
# ---------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def gerer_notification(request):
    data = request.data.copy()
    data["date_envoi"] = timezone.now()
    data.setdefault("est_lue", False)

    ser = NotificationSerializer(data=data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

@api_view(["GET"])
@permission_classes([AllowAny])
def afficher_notifications_enseignant(request, id):
    qs = Notification.objects.filter(id_enseignant_id=id).order_by("-date_envoi")
    return Response(NotificationSerializer(qs, many=True).data)

# ---------------------------
# PROFIL ADMIN
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def admin_me(request, id_admin):
    try:
        a = Administrateur.objects.get(id_admin=id_admin)
    except Administrateur.DoesNotExist:
        return Response({"detail": "Admin introuvable"}, status=404)
    return Response(AdminMeSerializer(a).data)

# ---------------------------
# LOGIN
# ---------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    mot_de_passe = request.data.get("mot_de_passe")

    if not email or not mot_de_passe:
        return Response({"detail": "Email et mot de passe requis"}, status=400)

    try:
        admin = Administrateur.objects.get(email=email)
        if admin.mot_de_passe == mot_de_passe:
            return Response({
                "role": "admin",
                "id": admin.id_admin,
                "nom": admin.nom,
                "prenom": admin.prenom,
                "email": admin.email,
                "poste": admin.poste
            })
        else:
            return Response({"detail": "Mot de passe incorrect"}, status=401)
    except Administrateur.DoesNotExist:
        pass

    try:
        ens = Enseignant.objects.get(email=email)
        if ens.mot_de_passe == mot_de_passe:
            return Response({
                "role": "enseignant",
                "id": ens.id_enseignant,
                "nom": ens.nom,
                "prenom": ens.prenom,
                "email": ens.email,
                "departement": ens.departement,
                "grade": ens.grade,
                "premiere_connexion": ens.premiere_connexion
            })
        else:
            return Response({"detail": "Mot de passe incorrect"}, status=401)
    except Enseignant.DoesNotExist:
        return Response({"detail": "Aucun compte trouvé avec cet email"}, status=404)

# ---------------------------
# DISPONIBILITES
# ---------------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def disponibilites_enseignant(request, id):
    if request.method == "GET":
        qs = Disponibilite.objects.filter(id_enseignant_id=id).order_by("jour", "heure_debut")
        return Response(DisponibiliteSerializer(qs, many=True).data)

    data = request.data.copy()
    data["id_enseignant"] = id
    ser = DisponibiliteSerializer(data=data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

@api_view(["DELETE"])
@permission_classes([AllowAny])
def supprimer_disponibilite(request, id_dispo):
    try:
        d = Disponibilite.objects.get(id_disponibilite=id_dispo)
    except Disponibilite.DoesNotExist:
        return Response({"detail": "Disponibilité introuvable"}, status=404)
    d.delete()
    return Response(status=204)

# ---------------------------
# SALLES CRUD
# ---------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def ajouter_salle(request):
    ser = SalleSerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

@api_view(["DELETE"])
@permission_classes([AllowAny])
def supprimer_salle(request, id_salle):
    try:
        s = Salle.objects.get(id_salle=id_salle)
    except Salle.DoesNotExist:
        return Response({"detail": "Salle introuvable"}, status=404)
    s.delete()
    return Response(status=204)

@api_view(["PATCH"])
@permission_classes([AllowAny])
def marquer_notification_lue(request, id_notif):
    try:
        n = Notification.objects.get(id_notification=id_notif)
    except Notification.DoesNotExist:
        return Response({"detail": "Notification introuvable"}, status=404)
    n.est_lue = True
    n.save()
    return Response(NotificationSerializer(n).data)


# ---------------------------
# DEMANDES
# ---------------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def demandes_enseignant(request, id):
    if request.method == "GET":
        qs = Demande.objects.filter(id_enseignant_id=id).order_by("-date_envoi")
        return Response(DemandeSerializer(qs, many=True).data)

    data = request.data.copy()
    data["id_enseignant"] = id
    ser = DemandeSerializer(data=data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=201)
    return Response(ser.errors, status=400)

@api_view(["GET"])
@permission_classes([AllowAny])
def admin_demandes(request):
    qs = Demande.objects.select_related("id_enseignant").all().order_by("-date_envoi")
    return Response(DemandeSerializer(qs, many=True).data)

@api_view(["PATCH"])
@permission_classes([AllowAny])
def repondre_demande(request, id_demande):
    try:
        d = Demande.objects.get(id_demande=id_demande)
    except Demande.DoesNotExist:
        return Response({"detail": "Demande introuvable"}, status=404)
    ser = DemandeSerializer(d, data=request.data, partial=True)
    if ser.is_valid():
        ser.save()
        return Response(ser.data)
    return Response(ser.errors, status=400)

# ---------------------------
# FORMATIONS
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def liste_formations(request):
    departement = request.GET.get("departement")
    qs = Formation.objects.all().order_by("departement", "niveau")
    if departement:
        qs = qs.filter(departement=departement)
    return Response(FormationSerializer(qs, many=True).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def matieres_par_formation(request, id_formation):
    qs = Matiere.objects.filter(id_formation_id=id_formation).order_by("id_matiere")
    return Response(MatiereSerializer(qs, many=True).data)

# ---------------------------
# PREMIER PARCOURS ENSEIGNANT
# ---------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def choisir_matieres(request, id):
    """L'enseignant choisit ses matières lors de la première connexion"""
    matieres_ids = request.data.get("matieres", [])
    
    if not matieres_ids:
        return Response({"detail": "Veuillez choisir au moins une matière"}, status=400)
    
    try:
        ens = Enseignant.objects.get(id_enseignant=id)
    except Enseignant.DoesNotExist:
        return Response({"detail": "Enseignant introuvable"}, status=404)
    
    # Supprimer les anciens choix
    EnseignantMatiere.objects.filter(id_enseignant_id=id).delete()
    
    # Ajouter les nouveaux choix
    for id_matiere in matieres_ids:
        EnseignantMatiere.objects.create(
            id_enseignant_id=id,
            id_matiere_id=id_matiere
        )
    
    # Marquer première connexion comme terminée
    ens.premiere_connexion = False
    ens.save()
    
    return Response({"detail": "Matières enregistrées", "nb_matieres": len(matieres_ids)}, status=201)

@api_view(["GET"])
@permission_classes([AllowAny])
def matieres_enseignant(request, id):
    """Retourne les matières choisies par un enseignant"""
    qs = EnseignantMatiere.objects.filter(id_enseignant_id=id).select_related("id_matiere")
    matieres = []
    for em in qs:
        mat = em.id_matiere
        matieres.append({
            "id_matiere": mat.id_matiere,
            "nom_matiere": mat.nom_matiere,
            "nb_cm": mat.nb_cm,
            "nb_td": mat.nb_td,
            "nb_tp": mat.nb_tp
        })
    return Response(matieres)

@api_view(["GET"])
@permission_classes([AllowAny])
def edt_enseignant(request, id):
    """Retourne l'EDT personnel d'un enseignant"""
    cours_ens = Cours.objects.filter(id_enseignant_id=id).values_list("num_cours", flat=True)
    qs = EmploiDuTemps.objects.filter(num_cours__in=cours_ens).select_related("num_cours", "id_salle").order_by("jour", "num_cours__heure_debut")
    return Response(EDTSerializer(qs, many=True).data)

# ---------------------------
# DÉPARTEMENTS & STATUTS
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def liste_departements(request):
    """Liste des départements avec le nombre de formations et d'enseignants"""
    formations = Formation.objects.all()
    departements = {}
    for f in formations:
        dept = f.departement
        if dept not in departements:
            departements[dept] = {"departement": dept, "nb_formations": 0, "nb_enseignants": 0}
        departements[dept]["nb_formations"] += 1
    
    # Compter les enseignants par département
    enseignants = Enseignant.objects.all()
    for e in enseignants:
        dept = e.departement
        if dept in departements:
            departements[dept]["nb_enseignants"] += 1
    
    return Response(list(departements.values()))

@api_view(["GET"])
@permission_classes([AllowAny])
def formations_par_departement(request, departement):
    """Formations d'un département"""
    qs = Formation.objects.filter(departement=departement).order_by("niveau")
    return Response(FormationSerializer(qs, many=True).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def enseignants_par_formation(request, id_formation):
    """Enseignants d'une formation avec leur statut (prêt ou non)"""
    try:
        formation = Formation.objects.get(id_formation=id_formation)
    except Formation.DoesNotExist:
        return Response({"detail": "Formation introuvable"}, status=404)
    
    # Trouver les enseignants qui ont choisi des matières de cette formation
    matieres_formation = Matiere.objects.filter(id_formation_id=id_formation).values_list("id_matiere", flat=True)
    enseignant_ids = EnseignantMatiere.objects.filter(id_matiere__in=matieres_formation).values_list("id_enseignant_id", flat=True).distinct()
    
    enseignants = Enseignant.objects.filter(id_enseignant__in=enseignant_ids)
    
    result = []
    for ens in enseignants:
        # Vérifier matières choisies
        nb_matieres = EnseignantMatiere.objects.filter(id_enseignant_id=ens.id_enseignant, id_matiere__in=matieres_formation).count()
        
        # Vérifier disponibilités
        nb_dispos = Disponibilite.objects.filter(id_enseignant_id=ens.id_enseignant).count()
        
        # Statut
        if nb_matieres > 0 and nb_dispos > 0:
            statut_pret = "pret"
        elif nb_matieres > 0:
            statut_pret = "matieres_ok"
        else:
            statut_pret = "incomplet"
        
        result.append({
            "id_enseignant": ens.id_enseignant,
            "nom": ens.nom,
            "prenom": ens.prenom,
            "email": ens.email,
            "grade": ens.grade,
            "nb_matieres": nb_matieres,
            "nb_dispos": nb_dispos,
            "statut_pret": statut_pret
        })
    
    return Response({
        "formation": FormationSerializer(formation).data,
        "enseignants": result,
        "tous_prets": all(e["statut_pret"] == "pret" for e in result) and len(result) > 0
    })

@api_view(["GET"])
@permission_classes([AllowAny])
def rechercher_enseignant(request):
    """Recherche d'enseignant par nom, prénom ou email"""
    q = request.GET.get("q", "")
    if len(q) < 2:
        return Response([])
    
    qs = Enseignant.objects.filter(
        models.Q(nom__icontains=q) |
        models.Q(prenom__icontains=q) |
        models.Q(email__icontains=q)
    ).order_by("nom")[:10]
    
    result = []
    for ens in qs:
        # Trouver la formation
        matiere_ids = EnseignantMatiere.objects.filter(id_enseignant_id=ens.id_enseignant).values_list("id_matiere_id", flat=True)
        formations = Formation.objects.filter(
            id_formation__in=Matiere.objects.filter(id_matiere__in=matiere_ids).values_list("id_formation_id", flat=True)
        ).distinct()
        
        result.append({
            "id_enseignant": ens.id_enseignant,
            "nom": ens.nom,
            "prenom": ens.prenom,
            "email": ens.email,
            "departement": ens.departement,
            "grade": ens.grade,
            "formations": [f.nom_formation for f in formations]
        })
    
    return Response(result)

# ---------------------------
# GÉNÉRATION AUTOMATIQUE EDT
# ---------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def generer_edt(request, id_formation):
    """Génère automatiquement l'emploi du temps d'une formation"""
    try:
        formation = Formation.objects.get(id_formation=id_formation)
    except Formation.DoesNotExist:
        return Response({"detail": "Formation introuvable"}, status=404)

    # Récupérer les matières de la formation
    matieres = Matiere.objects.filter(id_formation_id=id_formation)
    if not matieres:
        return Response({"detail": "Aucune matière dans cette formation"}, status=400)

    # Créneaux disponibles (8h-18h, blocs de 2h)
    creneaux = [
        (time(8, 0), time(10, 0)),
        (time(10, 0), time(12, 0)),
        (time(14, 0), time(16, 0)),
        (time(16, 0), time(18, 0)),
    ]
    jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']

    # Récupérer toutes les salles
    salles_cm = list(Salle.objects.filter(type_salle='CM', est_disponible=True).order_by('-capacite'))
    salles_td = list(Salle.objects.filter(type_salle='TD', est_disponible=True).order_by('-capacite'))
    salles_tp = list(Salle.objects.filter(type_salle='TP', est_disponible=True).order_by('-capacite'))

    # Suivi des occupations : {(jour, heure_debut): [id_enseignant, ...]}
    occupation_enseignant = {}
    occupation_salle = {}

    def est_disponible_enseignant(id_ens, jour, h_debut, h_fin):
        """Vérifie si l'enseignant est disponible à ce créneau"""
        dispos = Disponibilite.objects.filter(
            id_enseignant_id=id_ens,
            jour=jour,
            type_disponibilite__in=['Disponible', 'Prefere']
        )
        for d in dispos:
            if d.heure_debut <= h_debut and d.heure_fin >= h_fin:
                return True
        return False

    def creneau_libre(id_ens, id_salle, jour, h_debut):
        cle_ens = (jour, h_debut, id_ens)
        cle_salle = (jour, h_debut, id_salle)
        return cle_ens not in occupation_enseignant and cle_salle not in occupation_salle

    def reserver(id_ens, id_salle, jour, h_debut):
        occupation_enseignant[(jour, h_debut, id_ens)] = True
        occupation_salle[(jour, h_debut, id_salle)] = True

    def choisir_salle(type_cours):
        if type_cours == 'CM':
            return salles_cm[0] if salles_cm else (salles_td[0] if salles_td else None)
        elif type_cours == 'TD':
            return salles_td[0] if salles_td else (salles_cm[0] if salles_cm else None)
        else:
            return salles_tp[0] if salles_tp else (salles_td[0] if salles_td else None)

    # Supprimer les anciens cours et EDT de cette formation
    anciens_cours = Cours.objects.filter(id_matiere__in=matieres)
    EmploiDuTemps.objects.filter(num_cours__in=anciens_cours).delete()
    anciens_cours.delete()

    # Date de début (prochain lundi)
    aujourd_hui = date.today()
    jours_avant_lundi = (7 - aujourd_hui.weekday()) % 7
    if jours_avant_lundi == 0:
        jours_avant_lundi = 7
    date_debut = aujourd_hui + timedelta(days=jours_avant_lundi)

    cours_crees = 0
    erreurs = []

    for mat in matieres:
        # Trouver l'enseignant assigné à cette matière
        em = EnseignantMatiere.objects.filter(id_matiere=mat.id_matiere).first()
        if not em:
            erreurs.append(f"Pas d'enseignant pour {mat.nom_matiere}")
            continue

        id_ens = em.id_enseignant_id

        # Générer les séances selon nb_cm, nb_td, nb_tp
        seances = []
        for i in range(mat.nb_cm):
            seances.append('CM')
        for i in range(mat.nb_td):
            seances.append('TD')
        for i in range(mat.nb_tp):
            seances.append('TP')

        for type_seance in seances:
            place = False
            for jour in jours:
                if place:
                    break
                for (h_deb, h_fin) in creneaux:
                    if place:
                        break

                    # Vérifier disponibilité enseignant
                    if not est_disponible_enseignant(id_ens, jour, h_deb, h_fin):
                        continue

                    # Choisir une salle
                    salle = choisir_salle(type_seance)
                    if not salle:
                        continue

                    # Vérifier que le créneau est libre
                    if not creneau_libre(id_ens, salle.id_salle, jour, h_deb):
                        # Essayer d'autres salles du même type
                        salles_alternatives = {
                            'CM': salles_cm, 'TD': salles_td, 'TP': salles_tp
                        }.get(type_seance, salles_td)

                        salle_trouvee = False
                        for s in salles_alternatives:
                            if creneau_libre(id_ens, s.id_salle, jour, h_deb):
                                salle = s
                                salle_trouvee = True
                                break
                        if not salle_trouvee:
                            continue

                    # Créer le cours
                    cours = Cours.objects.create(
                        intitule=f"{mat.nom_matiere} - {type_seance}",
                        type_cours=type_seance,
                        heure_debut=h_deb,
                        heure_fin=h_fin,
                        effectif=30,
                        id_matiere=mat,
                        id_enseignant_id=id_ens
                    )

                    # Créer l'entrée EDT
                    jour_index = jours.index(jour)
                    date_cours = date_debut + timedelta(days=jour_index)

                    EmploiDuTemps.objects.create(
                        num_cours=cours,
                        id_salle=salle,
                        jour=jour,
                        date=date_cours,
                        statut='Planifie'
                    )

                    reserver(id_ens, salle.id_salle, jour, h_deb)
                    cours_crees += 1
                    place = True

            if not place:
                erreurs.append(f"Impossible de placer {mat.nom_matiere} - {type_seance}")

    return Response({
        "detail": f"EDT généré : {cours_crees} cours créés",
        "cours_crees": cours_crees,
        "erreurs": erreurs,
        "formation": formation.nom_formation
    }, status=201)