from rest_framework import serializers
from .models import Enseignant, Salle, Administrateur, Cours, EmploiDuTemps, Notification, Matiere

class EnseignantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = ["id_enseignant", "nom", "prenom", "email", "departement", "grade", "statut", "mot_de_passe"]
        extra_kwargs = {
            'mot_de_passe': {'write_only': True, 'required': False, 'default': 'temp1234'}
        }

class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = ["id_salle", "nom_salle", "capacite", "type_salle", "localisation"]
        
class MatiereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matiere
        fields = ["id_matiere", "nom_matiere"]

class CoursSerializer(serializers.ModelSerializer):
    nom_matiere = serializers.CharField(source="id_matiere.nom_matiere", read_only=True)
    enseignant_nom = serializers.CharField(source="id_enseignant.nom", read_only=True)
    enseignant_prenom = serializers.CharField(source="id_enseignant.prenom", read_only=True)

    class Meta:
        model = Cours
        fields = [
            "num_cours", "intitule", "type_cours",
            "heure_debut", "heure_fin",
            "id_matiere", "nom_matiere",
            "id_enseignant", "enseignant_nom", "enseignant_prenom"
        ]

class EDTSerializer(serializers.ModelSerializer):
    cours_intitule = serializers.CharField(source="num_cours.intitule", read_only=True)
    salle_nom = serializers.CharField(source="id_salle.nom_salle", read_only=True)

    class Meta:
        model = EmploiDuTemps
        fields = ["id_edt", "num_cours", "cours_intitule", "id_salle", "salle_nom", "jour", "date", "statut"]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id_notification", "destinataire_type", "id_enseignant", "id_admin", "titre", "message", "date_envoi", "est_lue"]


class AdminMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrateur
        fields = ["id_admin", "nom", "prenom", "email", "poste", "permissions"]
