# Splink – Application de gestion de colocation

**Splink** est une application web pensée pour faciliter la vie en colocation. Elle permet de répartir les tâches ménagères, de suivre les dépenses communes, de consulter les événements à venir sur un calendrier partagé, et d’organiser efficacement la vie collective.

---

## Lancer l'application

### Deux méthodes sont possibles pour démarrer l'application :

### **Avec Docker**

Depuis la racine du projet (là où se trouve le fichier `docker-compose.yaml`), exécutez la commande suivante :

```bash
docker-compose up --build -d
```

Cela construira automatiquement le front-end et le back-end, puis lancera les conteneurs associés.

> ⚠️ Assurez-vous que Docker est bien installé sur votre machine.

---

### **Sans Docker, via CLI**

1. Rendez-vous dans le dossier `frontend` :

```bash
cd frontend
```

2. Démarrez le front-end avec :

```bash
npm run start
```

> ⚠️ Le back-end n’a pas besoin d’être lancé manuellement : le front-end communique directement avec l’API via l’adresse publique **217.65.146.195:3000**.

---

## Fonctionnalités et Pages

### Page de création d'un compte

Il est possible de vous créer un compte, pour cela, il vous faudra cliquez sur ***Vous n'avez pas encore de compte ?***.

Une fois sur la page de création, il vous faudra renseigner vos informations et cliquer sur **Créer**

Une fois votre compte créer, connectez-vous.

### Page de connexion

Vous pourrez vous connecter avec vos informations de connexion et cliquer sur **Se connecter**

A partir de ce moment-là, deux scénarios peuvent s'offrir à vous:

- Soit vous êtes déjà dans une colocation et alors vous arrivez directement sur le dashboard.

- Soit vous n'avez pas de colocation et à ce moment là, vous aurez le choix de créer une colocation ou d'en rejoindre une via un code d'invitation.

    - Pour la création, vous renseignez les informations de votre colocation et vous cliquez sur **Créer**. Vous accèderez à votre dashboard automatiquement et vous serez alors administrateur de votre colocation.<br>

    - Pour rejoindre une colocation existante, il vous faudra demander le code d'invitation à un administrateur de la colocation que vous souhaitez rejoindre. Et le saisir avant de cliquer sur **Rejoindre**.

### Page d’accueil (Dashboard)

* Vue d’ensemble des tâches du jour, à venir, et des dernières dépenses.
* Chaque section est une **card** réutilisable via `app-dashboard-card`.
* Ajout rapide d’événements ou de dépenses via les composants `app-modal`.

### Page des événements

* **Calendrier interactif** affiché via `app-calendar-item` (intégration de ***fullcalendar***).
* **Ajout, modification et suppression** d’un événement via des modales.
* Filtres disponibles :

  * Par personne assignée
  * Par date
  * Par mot-clé (titre)
* Affichage des événements à venir (liste)
* Historique des événements passés

### Page des dépenses

* Affichage de la répartition des dépenses via `app-chart-item` utilisant `apexcharts`.
* **Ajout, modification, suppression et validation de paiement** d’une dépense via modale.
* Historique des dépenses avec filtres similaires à la page événements.

### Page des paramètres

* Affichage des informations de la colocation (nom).
* Visualisation des membres de la colocation.
* Options disponibles :

  * Re-synchroniser les données
  * Se déconnecter
  * Quitter la colocation (uniquement si toutes les dettes sont réglées)

  #### Si administrateur :

  * Modifier les informations de la colocation
  * Supprimer des membres
  * Définir les rôles (administrateur ou membre)
  * Code d'invitation visible

---

## Composants réutilisables

* `app-dashboard-card` : card responsive avec actions configurables.
* `app-modal` : modale stylisée avec titre et contenu dynamique.
* `app-task-item` : affiche une tâche (icône + titre).
* `app-depense-item` : affiche une dépense (icône + titre).
* `app-incoming-task-item` : affiche une tâche à venir (icône, titre, date, personne assignée).
* `app-dettes-item` : affiche une dette à rembourser.
* `app-avoirs-item` : affiche un avoir à réclamer.
* `app-calendar-item` : encapsule FullCalendar avec gestion des événements.
* `app-table-item` : tableau filtrable et scrollable pour les tâches/dépenses.

---

## Technologies utilisées

* **Frontend** : Angular 19 + TailwindCSS
* **Backend** : Node.js, Express, MongoDB
