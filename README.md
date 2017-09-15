# cashReg

Version : 0.2.2

## Technologies utilisées

Node.js + Express
MySQL

## Mise en route de l'application

### Base de données

Exécuter le fichier `cashReg_db.sql` dans votre base de données
Attention, il est possible que certains paramètres soient à modifier. Pour cela, rendez-vous dans le fichier `/lib/connection.js`

### Lancement de l'application

Le lancement de l'application se fait : `npm start` ou `nodemon` depuis le dossier racine
Il faudra au préalable installer les dépendances via `npm install` ou les mettre à jour via `npm update` depuis le dossier racine

## Accès à l'API

L'url d'accès à l'api est la suivante: `http://localhost:3000/`

Pour la gestion des items: `http://localhost:3000/items/`

Pour la gestion des additions: `http://localhost:3000/sums/`