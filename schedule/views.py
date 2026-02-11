from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.response import Response #permet de renvoyer les réponses de la requete sous forme de fichier json
from rest_framework import generics #permet de visualiser les fichiers api en json (avec des get ou post)
from rest_framework.decorators import api_view
from rest_framework import status


from .models import Enseignant, Salle,Notification
from .serializers import *


# Create your views here.
#fonction qui retourne bonjour
def home(request):
    return HttpResponse("bonjour! ça marche bien tkt")

#définition des vues associés à l'administrateur


#fonction qui permet de retourner tout les enseignants
@api_view(['GET'])
def retourner_all_enseignants(request):
    enseignants = Enseignant.objects.all()
    serializerEns = EnseignantSerializer(enseignants,many=True)
    return Response(serializerEns.data)


#fonction qui permet de retourner un enseignants en particulier
@api_view(['GET'])
def retourner_un_enseignant(request,id):
    #récupération de l'id de l'enseignant 
    id_ens = Enseignant.objects.filter(id_enseignant=id)
    serializerEns = EnseignantSerializer(id_ens,many=True)
    return Response(serializerEns.data)



#def fonction_permettant de retouner toutes les salles

@api_view(['GET'])
def retourner_salles(request):
    salle = Salle.objects.all()
    serializerSalle = SalleSerializer(salle,many=True)
    return Response(serializerSalle.data)

#fonction permettant de retourner uniquement les salles disponibles
@api_view(['GET'])
def retourner_salles_disponibles(request):
    salles_dispo = Salle.objects.filter(est_disponible=True)
    serializerSalle= SalleSerializer(salles_dispo,many=True)
    return Response(serializerSalle.data)


    





#fonction permettant à l'administrateur d'envoyer une notificaiton
def envoyer_notification():
    pass



#fonction permettant de stocker et envoyer une notification

"""
Explication : l'administrateur envoie une notification qui est 
ensuite stockée dans la bd et celle ci est automatiquement envoyée 
à celui qu'il a défini : tous les enseignants , a un enseignant en particulier
"""
@api_view(['POST'])
def gerer_notification(request):
    serializerNotif = NotificationSerializer(data=request.data)
    if serializerNotif.is_valid():
        serializerNotif.save()
        return Response(serializerNotif.data,status=status.HTTP_201_CREATED)
  
    return Response(serializerNotif.errors,status=status.HTTP_400_BAD_REQUEST)
    




#fonction permettant de supprimer un Enseignant
@api_view(['DELETE'])
def supprimerEnseignant(request,id):
    try:
        enseignant= Enseignant.objects.get(id_enseignant = id)
        enseignant.delete()
        return Response({'message' : 'Enseignant supprimé avec succès'},status=status.HTTP_200_OK)
    
    except Enseignant.DoesNotExist:
        return Response({'error' : 'enseignant non trouvé'},status=status.HTTP_404_NOT_FOUND)



class EnseignantGradeStatusUpdateView(generics.UpdateAPIView):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantGradeStatutSerializer
    lookup_field = 'id_enseignant'




@api_view(['PUT'])  
#fonction devant permettre de changer le grade et le statut de l'enseignant
def modifier_infos_enseignant(request,id):
    try:
        enseignant = Enseignant.objects.get(id_enseignant=id)
    except Enseignant.DoesNotExist:
        return Response({'error': 'Enseignant introuvable'},status=status.HTTP_404_NOT_FOUND)
    
    nouveau_grade = request.data.get('grade')
    nouveau_statut = request.data.get('statut')

    if nouveau_grade is not None:
        enseignant.grade = nouveau_grade

    if nouveau_statut is not None:
        enseignant.statut = nouveau_statut

    enseignant.save()

    serializerEns = EnseignantSerializer(enseignant)
    return Response(serializerEns.data,status=status.HTTP_200_OK)




#Cote enseignant

#fonction permettant d'afficher les notifications que a reçu un enseignant 

@api_view(['GET'])
def afficher_notifications_enseignant(request,id):
    #chercher parmi toutes les notifs de la base celles de l'enseignant spécifique (avec son id)

    notifications = Notification.objects.filter(id_enseignant=id)

    #si il n'ya pas de notifications
    if not notifications.exists():
        #on retourne un message disant qu'il n'y en a pas
        return Response({'message': 'Aucune notification'}, status=status.HTTP_404_NOT_FOUND)
    #sinon on rentre jamais dans le if et on recupère le titre et le message de la table notifcaiton
    data = [ #création d'une liste contenant seulement le titre et le message de la notif
        {
            'titre': notif.titre,
            'message': notif.message,
        }
        for notif in notifications
    ]
    #on retourne la reponse sous forme de fichier json visible sur l'api view du restframework

    return Response(data,status=status.HTTP_200_OK) #le statut ici permet de dire que la demande a bien fonctionée
    


#fonction permettant d'enregistrer un enseignant dans la base

"""
On enregistre un enseignant avec :
-son nom 
-son prenom 
-sa date de naissance 
-email 
-mot de passe 
-departement (avec une liste de département qu'il doit choisir)
-grade par défaut : enseignant titulaire
-statut par défaut : actif 

a la fin de l'enregistrement , un id lui est attribué automatiquement
"""

@api_view(['POST'])
def ajouter_enseignant(request):
    #faire une copies des donnees entrées par l'enseignants
    donneesEns = request.data.copy()

#attribuer les valeurs par défaut pour le grade et le status
    donneesEns['grade'] = 'enseignant titulaire'
    donneesEns['statut'] = 'actif'

#le serializer permet 
    serializer = EnseignantSerializer(data=donneesEns)

    #si les données nettoyés en serializer sont valides 
    if serializer.is_valid():
        #on sauvegarde les données 
        serializer.save()
        #on retourne  la réponse sous forme d'api 
        return Response(
            {
                'message': 'Enseignant enregistré avec succès',
                'enseignant': serializer.data

            },
            status = status.HTTP_201_CREATED
        )
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)





#fonction permettant d'ajouter une matière à la base
@api_view(['POST'])
def ajouterMatiere(request):
    data = request.data.copy()
    serializer = MatiereSerializer(data=data)

    #si les données nettoyés en serializer sont valides 
    if serializer.is_valid():
        #on sauvegarde les données 
        serializer.save()
        #on retourne  la réponse sous forme d'api 
        return Response(
            {
                'message': 'Matière enregistrée avec succès',
                'enseignant': serializer.data

            },
            status = status.HTTP_201_CREATED
        )
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#fonction permettant d'enregistrer une scéance de cours entrée par un professeur 

@api_view(['POST'])
def enregistrer_sceance_cours(request):
    pass

