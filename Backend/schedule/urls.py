from django.urls import path
from . import views

urlpatterns = [
    path('admin/enseignants/', views.retourner_all_enseignants, name='retourner-enseignants'),
    path('admin/enseignants/<int:id>/', views.retourner_un_enseignant, name='retourner_un_enseignant'),
    path('admin/enseignants/add/', views.ajouter_enseignant, name='ajouter_enseignant'),
    path('admin/salles/', views.retourner_salles, name='retourner_salles'),
    path('admin/enseignants/<int:id>/delete/', views.supprimerEnseignant, name='supprimer_enseignant'),
    path('admin/enseignants/<int:id_enseignant>/modify/', views.modifier_enseignant, name='modifier_info_enseignants'),
    path('admin/salles/disponibles/', views.retourner_salles_disponibles, name='retourner_salles_disponibles'),
    path('admin/notification/', views.gerer_notification, name='gerer_notification'),
    path('enseignant/<int:id>/notifications/', views.afficher_notifications_enseignant, name='afficher_notification_enseignant'),
    path('admin/cours/', views.admin_cours, name='admin_cours'),
    path('admin/cours/<int:num_cours>/', views.admin_cours_detail, name='admin_cours_detail'),
    path('admin/edt/', views.admin_edt, name='admin_edt'),
    path('admin/me/<int:id_admin>/', views.admin_me, name='admin_me'),
    path('login/', views.login, name='login'),
    path('enseignant/<int:id>/disponibilites/', views.disponibilites_enseignant, name='disponibilites_enseignant'),
    path('disponibilite/<int:id_dispo>/delete/', views.supprimer_disponibilite, name='supprimer_disponibilite'),
    path('admin/salles/add/', views.ajouter_salle, name='ajouter_salle'),
    path('admin/salles/<int:id_salle>/delete/', views.supprimer_salle, name='supprimer_salle'),
    path('notification/<int:id_notif>/lue/', views.marquer_notification_lue, name='marquer_notification_lue'),
    path('enseignant/<int:id>/demandes/', views.demandes_enseignant, name='demandes_enseignant'),
    path('admin/demandes/', views.admin_demandes, name='admin_demandes'),
    path('admin/demandes/<int:id_demande>/repondre/', views.repondre_demande, name='repondre_demande'),
    # Formations et matières
    path('formations/', views.liste_formations, name='liste_formations'),
    path('formations/<int:id_formation>/matieres/', views.matieres_par_formation, name='matieres_par_formation'),
    
    # Premier parcours enseignant
    path('enseignant/<int:id>/choisir-matieres/', views.choisir_matieres, name='choisir_matieres'),
    path('enseignant/<int:id>/matieres/', views.matieres_enseignant, name='matieres_enseignant'),
    path('enseignant/<int:id>/edt/', views.edt_enseignant, name='edt_enseignant'),
    # Départements & statuts
    path('admin/departements/', views.liste_departements, name='liste_departements'),
    path('admin/departements/<str:departement>/formations/', views.formations_par_departement, name='formations_par_departement'),
    path('admin/formations/<int:id_formation>/enseignants/', views.enseignants_par_formation, name='enseignants_par_formation'),
    path('admin/recherche-enseignant/', views.rechercher_enseignant, name='rechercher_enseignant'),
    path('admin/formations/<int:id_formation>/generer-edt/', views.generer_edt, name='generer_edt'),
    path('admin/formations/<int:id_formation>/edt/', views.edt_formation, name='edt_formation'),
]