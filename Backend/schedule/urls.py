from django.urls import path
from . import views

urlpatterns = [
path('admin/enseignants/', views.retourner_all_enseignants,name='retourner-enseignants'),
path('admin/enseignants/<int:id>/',views.retourner_un_enseignant,name='retourner_un_enseignant'),
path('admin/enseignants/add/',views.ajouter_enseignant,name='ajouter_enseignant'),
path('admin/salles/',views.retourner_salles,name='retourner_salles'),
path('admin/enseignants/<int:id>/delete/',views.supprimerEnseignant,name='supprimer_enseignant'),
path('admin/enseignants/<int:id_enseignant>/modify/',views.modifier_enseignant,name='modifier_info_enseignants'),
path('admin/salles/disponibles/',views.retourner_salles_disponibles,name='retourner_salles_disponibles'),
path('admin/notification/',views.gerer_notification,name='gerer_notification'), #n'est pas encore fonctionnelle(ne pas essayer)
path('enseignant/<int:id>/notifications/',views.afficher_notifications_enseignant,name='afficher_notification_enseignant'),
path('admin/notification/',views.gerer_notification,name='gerer_notification'), #n'est pas encore fonctionnelle(ne pas essayer)
path('enseignant/<int:id>/notifications/',views.afficher_notifications_enseignant,name='afficher_notification_enseignant'),    
path('admin/cours/', views.admin_cours, name='admin_cours'),
path('admin/cours/<int:num_cours>/', views.admin_cours_detail, name='admin_cours_detail'),
path('admin/edt/', views.admin_edt, name='admin_edt'),
path('admin/me/<int:id_admin>/', views.admin_me, name='admin_me'),

   
]











