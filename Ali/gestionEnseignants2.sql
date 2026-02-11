-- Database: Nada

-- DROP DATABASE IF EXISTS "Nada";

CREATE DATABASE "Nada"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
-- =========================================================
-- 🔹 TABLE 1 : ENSEIGNANT
-- =========================================================
CREATE TABLE enseignant (
    id_enseignant SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    departement VARCHAR(100),
	grade VARCHAR(50),
    statut VARCHAR(20) DEFAULT 'Actif'
);

-- =========================================================
-- 🔹 TABLE 2 : ADMINISTRATEUR
-- =========================================================
CREATE TABLE administrateur (
    id_admin SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    poste VARCHAR(100),
    permissions TEXT
);

-- =========================================================
-- 🔹 TABLE 3 : MATIERE
-- =========================================================
CREATE TABLE matiere (
    id_matiere VARCHAR(20) UNIQUE NOT NULL,
    nom_matiere VARCHAR(100) NOT NULL
 
);

-- =========================================================
-- 🔹 TABLE 4 : SALLE
-- =========================================================
CREATE TABLE salle (
    id_salle SERIAL PRIMARY KEY,
    nom_salle VARCHAR(50) UNIQUE NOT NULL,
    capacite INT CHECK (capacite > 0),
    type_salle VARCHAR(50),
    localisation VARCHAR(100)
);

-- =========================================================
-- 🔹 TABLE 5 : COURS
-- =========================================================
CREATE TABLE cours (
    num_cours SERIAL PRIMARY KEY,
    intitule VARCHAR(100) NOT NULL,
	type_cours VARCHAR(30) NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    id_matiere VARCHAR(20) REFERENCES matiere(id_matiere) ON DELETE SET NULL,
    id_enseignant INT REFERENCES enseignant(id_enseignant) ON DELETE SET NULL,
    CHECK (heure_fin > heure_debut)
);

-- =========================================================
-- 🔹 TABLE 6 : EMPLOI DU TEMPS
-- =========================================================
CREATE TABLE emploi_du_temps (
    id_edt SERIAL PRIMARY KEY,
    num_cours INT REFERENCES cours(num_cours) ON DELETE CASCADE,
    id_salle INT REFERENCES salle(id_salle) ON DELETE SET NULL,
    jour VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'Planifié'
);

-- =========================================================
-- 🔹 TABLE 7 : DISPONIBILITE
-- =========================================================
CREATE TABLE disponibilite (
    id_disponibilite SERIAL PRIMARY KEY,
    id_enseignant INT REFERENCES enseignant(id_enseignant) ON DELETE CASCADE,
    jour VARCHAR(20) NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    type_disponibilite VARCHAR(50),
    commentaire TEXT,
    CHECK (heure_fin > heure_debut)
);

-- =========================================================
-- 🔹 TABLE 8 : NOTIFICATION
-- =========================================================
CREATE TABLE notification (
    id_notification SERIAL PRIMARY KEY,
    destinataire_type VARCHAR(20) CHECK (destinataire_type IN ('Enseignant', 'Administrateur')) NOT NULL,
    id_enseignant INT REFERENCES enseignant(id_enseignant) ON DELETE CASCADE,
    id_admin INT REFERENCES administrateur(id_admin) ON DELETE CASCADE,
    titre VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_lue BOOLEAN DEFAULT FALSE
);

-- =========================================================
-- 🔹 TABLE 9 : ENSEIGNANT_MATIERE (relation N:M)
-- =========================================================
CREATE TABLE enseignant_matiere (
    id_enseignant INT REFERENCES enseignant(id_enseignant) ON DELETE CASCADE,
    id_matiere VARCHAR(20) REFERENCES matiere(id_matiere) ON DELETE CASCADE,
    PRIMARY KEY (id_enseignant, id_matiere)
);

-- =========================================================
-- 🔹 TABLE 10 : EQUIPEMENT_SALLE
-- =========================================================
CREATE TABLE equipement_salle (
    id_equipement SERIAL PRIMARY KEY,
    id_salle INT REFERENCES salle(id_salle) ON DELETE CASCADE,
    nom_equipement VARCHAR(100) NOT NULL,
    quantite INT DEFAULT 1 CHECK (quantite > 0)
);


-- =========================================================
-- 👩‍🏫 TABLE ENSEIGNANT
-- =========================================================
INSERT INTO enseignant (nom, prenom, email, mot_de_passe, grade, departement, statut)
VALUES
('Sane', 'Moussa', 'moussa.sane@univ.com', 'azerty123', 'Maître de conférences', 'Informatique', 'Actif'),
('Izere', 'Divin', 'divan.izere@univ.com', 'pass1234', 'Professeur', 'Mathématiques', 'Actif'),
('Ali', 'Hassane', 'hassane.ali@univ.com', 'admin123', 'Assistant', 'Physique', 'Actif');

-- =========================================================
-- 🧍‍♂️ TABLE ADMINISTRATEUR
-- =========================================================
INSERT INTO administrateur (nom, prenom, email, mot_de_passe, poste, permissions)
VALUES
('Sadia', 'Emmanuel', 'emmanuel.sadia@gmail.com', 'adminpass', 'Responsable Pédagogique', 'Gestion complète des emplois du temps'),
('Don', 'Bellystar', 'belleystar.don@gmail.com', 'secure123', 'Directeur Département', 'Validation des plannings');
SELECT * FROM matiere WHERE id_matiere = 'MAT201';

-- =========================================================
-- 📚 TABLE MATIERE
-- =========================================================
INSERT INTO matiere (id_matiere,nom_matiere)
VALUES
('INF101', 'Programmation Web'),
('MAT201', 'Analyse Mathematique'),
('PHY301', 'Mécanique Generale');

-- =========================================================
-- 🏫 TABLE SALLE
-- =========================================================
INSERT INTO salle (nom_salle, capacite, type_salle, localisation)
VALUES
('Salle A1', 40, 'Informatique', 'Bâtiment A'),
('Salle B2', 30, 'Mathématiques', 'Bâtiment B'),
('Salle C3', 50, 'Physique', 'Bâtiment C');

-- =========================================================
-- 🧰 TABLE EQUIPEMENT_SALLE
-- =========================================================
INSERT INTO equipement_salle (id_salle, nom_equipement, quantite)
VALUES
(1, 'Vidéoprojecteur', 1),
(1, 'Ordinateurs', 20),
(2, 'Tableau blanc', 1),
(3, 'Système audio', 1);

-- =========================================================
-- 🧮 TABLE ENSEIGNANT_MATIERE
-- =========================================================
INSERT INTO enseignant_matiere (id_enseignant, id_matiere)
VALUES
(1, 'INF101'),  -- Sane enseigne Programmation Web
(2, 'MAT201'),  -- Izere enseigne Analyse Mathématique
(3, 'PHY301');  -- Ali enseigne Mécanique Générale

-- =========================================================
-- ⏰ TABLE DISPONIBILITE
-- =========================================================
INSERT INTO disponibilite (id_enseignant, jour, heure_debut, heure_fin, type_disponibilite, commentaire)
VALUES
(1, 'Lundi', '08:00', '12:00', 'Disponible', 'Matinée libre'),
(1, 'Mercredi', '14:00', '18:00', 'Disponible', 'Après-midi disponible'),
(2, 'Mardi', '08:00', '12:00', 'Disponible', 'Cours du matin'),
(3, 'Jeudi', '10:00', '16:00', 'Disponible', 'Préféré pour TP');

-- =========================================================
-- 📘 TABLE COURS
-- =========================================================
INSERT INTO cours (intitule,type_cours ,heure_debut, heure_fin, id_matiere, id_enseignant)
VALUES
('Programmation Web ','TD', '08:00', '10:00', 'INF101', 1),
('Analyse Mathématique ','TP', '10:00', '12:00', 'MAT201', 2),
('Mécanique Générale ','CM', '14:00', '16:00', 'PHY301', 3);

-- =========================================================
-- 🗓️ TABLE EMPLOI_DU_TEMPS
-- =========================================================
INSERT INTO emploi_du_temps (num_cours, id_salle, jour, date, statut)
VALUES
(1, 1, 'Lundi', '2025-11-03', 'Planifié'),
(2, 2, 'Mardi', '2025-11-04', 'Planifié'),
(3, 3, 'Jeudi', '2025-11-06', 'Planifié');

-- =========================================================
-- 🔔 TABLE NOTIFICATION
-- =========================================================
INSERT INTO notification (destinataire_type, id_enseignant, titre, message)
VALUES
('Enseignant', 1, 'Nouveau cours ajouté', 'Votre séance de Programmation Web a été planifiée pour lundi.'),
('Enseignant', 2, 'Changement de salle', 'Votre cours d’Analyse Mathématique est déplacé en Salle B2.'),
('Administrateur', NULL, 'Mise à jour du système', 'Les données de l’emploi du temps ont été sauvegardées.');

DROP TABLE
notification,
emploi_du_temps,
disponibilite,
enseignant_matiere,
equipement_salle,
cours,
salle,
matiere,
enseignant,
administrateur
CASCADE;








SELECT e.nom AS enseignant, c.intitule, s.nom_salle, ed.jour, ed.date
FROM emploi_du_temps ed
JOIN cours c ON ed.num_cours = c.num_cours
JOIN enseignant e ON c.id_enseignant = e.id_enseignant
JOIN salle s ON ed.id_salle = s.id_salle;
SELECT * FROM enseignant;
SELECT * FROM administrateur;
SELECT * FROM matiere;
SELECT * FROM salle;
SELECT * FROM equipement_salle;
SELECT * FROM disponibilite;
SELECT * FROM cours;
SELECT * FROM emploi_du_temps;
SELECT * FROM notification;
SELECT * FROM enseignant_matiere;

drop table emploi_du_temps;

