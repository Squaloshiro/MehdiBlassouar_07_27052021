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
2 :À la racine du projet taper : cd backend && npm i && cd .. && cd frontend && npm i && cd ..

4 eme étape : 

Créer la base de donnée du projet via ces commandes : 

1 : cd backend 
2 : npx sequelize db:create databaseGroupomaniaSql
3 : npx sequelize db:migrate
4 : cd ..

5 eme étape : 

Démarrer le projet (api et app)

Ouvrir le projet dans deux terminaux 

Dans le premier terminal lancer la commande : cd backend && npm start 
Dans le second terminal lancer la commande : cd frontend && npm start 

Enjoy 