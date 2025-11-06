from django.urls import path
from . import views

urlpatterns = [
    path('bonjour/',views.home,name='home'),
    path('admin/enseignants', views.retourner_all_enseignants,name='retourner-enseignants'),
    path('admin/enseignants/<int:id>/',views.retourner_un_enseignant,name='retourner_un_enseignant'),
    path('admin/salles/',views.retourner_salles,name='retourner_salles'),
    path('admin/enseignants/<int:id>/delete/',views.supprimerEnseignant,name='supprimer_enseignant'),
    path('admin/enseignants/<int:id_enseignant>/modify/',views.EnseignantGradeStatusUpdateView.as_view(),name='modifier_info_enseignants'),
    path('admin/salles/disponibles/',views.retourner_salles_disponibles,name='retourner_salles_disponibles'),
    path('admin/notification/',views.gerer_notification,name='gerer_notification'), #n'est pas encore fonctionnelle(ne pas essayer)
    path('enseignant/<int:id>/notifications/',views.afficher_notifications_enseignant,name='afficher_notification_enseignant'),
]







