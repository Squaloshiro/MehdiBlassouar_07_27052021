Projet Création d'un réseau social d'entreprise 

Effectuer toutes les étapes pour lancer le site 

1er étape : 

Vérifier que vous avez installé mysql et le lancer via LAMP , MAMP , XAMP

lancer le server appach en utilisant le port par default de mysql (3306)


2 eme étape : 

Copier le lien du projet afin de le cloner 


3 eme étape : 

Installer les dépendences en quelques étapes : 

1 : Ouvrir le projet dans un terminal 
2 : Placez-vous dans le backend
3 : Lancer la commande : npm install
4 : Placez-vous dans le frontend
5 : Lancer la commande : npm install


4eme étapes : 

Modifier le fichier config.json

1 : changer le user 
2 : Changer le mot de passe 
3 : Changer le nom de la database

5 eme étape : 

Créer la base de donnée du projet via ces commandes : 

1 : dans un terminal placez-vous dans le dossier backend

entrer les commandes suivantes : 
2 : npx sequelize db:create databaseGroupomaniaSql
3 : npx sequelize db:migrate
4 : npx sequelize-cli db:seed:all


6 eme étape : 

Démarrer le projet (api et app)

Ouvrir le projet dans deux terminaux 

Dans le premier terminal placez-vous dans le back end: cd backend 
lancer la commande : npm start 
Dans le second terminal terminal placez-vous dans le frontend : cd frontend
lancer la commande : npm start 

7 eme étape : 

Une fois le projet lancer voici les informations de connexion 

email : admin@groupomania.com , goku@groupomania.com, vegeta@groupomania.com , mutten@groupomania.com

password : Password1.



Enjoy 