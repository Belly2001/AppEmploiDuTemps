from rest_framework import serializers
from . models import Enseignant, Salle,Notification,Administrateur

class EnseignantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = [
            'id_enseignant',
            'nom',
            'prenom',
            'email',
            'mot_de_passe',
            'departement',
            'grade',
            'statut'
        ]
        extra_kwargs = {
            'mot_de_passe' : {'write_only': True}, #masquer le mdp lors de la lecture
            'email' : {'required' : True},
        }


class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = '__all__'


#NB: ce serializer permettra de modifier uniquement le grade et le statut de l'enseignant 
class EnseignantGradeStatutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = ['grade', 'statut'] 

    
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        field = '__all__'

class AdministrateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrateur
        field= '__all__'

