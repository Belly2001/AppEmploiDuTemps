from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Enseignant, Salle, Cours, EmploiDuTemps, Notification, Administrateur
from .serializers import (
    EnseignantSerializer, SalleSerializer, CoursSerializer,
    EDTSerializer, NotificationSerializer, AdminMeSerializer
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
    """
    Payload attendu exemple:
    {
      "destinataire_type": "enseignant",
      "id_enseignant": 3,
      "id_admin": 1,
      "titre": "Info",
      "message": "..."
    }
    """
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
