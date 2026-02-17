from django.db import models


class Administrateur(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=150)
    mot_de_passe = models.CharField(max_length=255)
    poste = models.CharField(max_length=100, blank=True, null=True)
    permissions = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'administrateur'


class Cours(models.Model):
    num_cours = models.AutoField(primary_key=True)
    intitule = models.CharField(max_length=100)
    type_cours = models.CharField(max_length=30)  # OBLIGATOIRE (DB: NOT NULL)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()

    id_matiere = models.ForeignKey(
        'Matiere',
        models.DO_NOTHING,
        db_column='id_matiere',
        to_field='id_matiere',
        blank=True,
        null=True
    )

    id_enseignant = models.ForeignKey(
        'Enseignant',
        models.DO_NOTHING,
        db_column='id_enseignant',
        to_field='id_enseignant',
        blank=True,
        null=True
    )

    class Meta:
        managed = False
        db_table = 'cours'


class Disponibilite(models.Model):
    id_disponibilite = models.AutoField(primary_key=True)
    id_enseignant = models.ForeignKey('Enseignant', models.DO_NOTHING, db_column='id_enseignant', blank=True, null=True)
    jour = models.CharField(max_length=20)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    type_disponibilite = models.CharField(max_length=50, blank=True, null=True)
    commentaire = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'disponibilite' 


class EmploiDuTemps(models.Model):
    id_edt = models.AutoField(primary_key=True)
    num_cours = models.ForeignKey(Cours, models.DO_NOTHING, db_column='num_cours', blank=True, null=True)
    id_salle = models.ForeignKey('Salle', models.DO_NOTHING, db_column='id_salle', blank=True, null=True)
    jour = models.CharField(max_length=20)
    date = models.DateField()
    statut = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'emploi_du_temps'


class Enseignant(models.Model):
    id_enseignant = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=150)
    mot_de_passe = models.CharField(max_length=255)
    departement = models.CharField(max_length=100, blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True, null=True)
    statut = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'enseignant'


class EnseignantMatiere(models.Model):
    pk = models.CompositePrimaryKey('id_enseignant', 'id_matiere')
    id_enseignant = models.ForeignKey(Enseignant, models.DO_NOTHING, db_column='id_enseignant')
    id_matiere = models.ForeignKey('Matiere', models.DO_NOTHING, db_column='id_matiere')

    class Meta:
        managed = False
        db_table = 'enseignant_matiere'


class EquipementSalle(models.Model):
    id_equipement = models.AutoField(primary_key=True)
    id_salle = models.ForeignKey('Salle', models.DO_NOTHING, db_column='id_salle', blank=True, null=True)
    nom_equipement = models.CharField(max_length=100)
    quantite = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'equipement_salle'


class Matiere(models.Model):
    id_matiere = models.CharField(primary_key=True, max_length=20)
    nom_matiere = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'matiere'



class Notification(models.Model):
    id_notification = models.AutoField(primary_key=True)
    destinataire_type = models.CharField(max_length=20)
    id_enseignant = models.ForeignKey(Enseignant, models.DO_NOTHING, db_column='id_enseignant', blank=True, null=True)
    id_admin = models.ForeignKey(Administrateur, models.DO_NOTHING, db_column='id_admin', blank=True, null=True)
    titre = models.CharField(max_length=150)
    message = models.TextField()
    date_envoi = models.DateTimeField(blank=True, null=True)
    est_lue = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notification'


class Salle(models.Model):
    id_salle = models.AutoField(primary_key=True)
    nom_salle = models.CharField(unique=True, max_length=50)
    capacite = models.IntegerField(blank=True, null=True)
    type_salle = models.CharField(max_length=50, blank=True, null=True)
    localisation = models.CharField(max_length=100, blank=True, null=True)
    est_disponible = models.BooleanField(default=True)
 
    class Meta:
        managed = False
        db_table = 'salle'
