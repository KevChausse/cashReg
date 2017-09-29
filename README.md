# cashReg

Version : 0.6.4

## Technologies utilisées

Node.js + Express
MySQL

## Documentation

La documentation de l'api est à venir (version 1.1+)

## Mise en route de l'application

### Base de données

Exécuter le fichier `cashReg_db.sql` dans votre base de données
Attention, il est possible que certains paramètres soient à modifier. Pour cela, rendez-vous dans le fichier `/lib/connection.js`

### Lancement de l'application

Le lancement de l'application se fait : `npm start` ou `nodemon` depuis le dossier racine
Il faudra au préalable installer les dépendances via `npm install` ou les mettre à jour via `npm update` depuis le dossier racine

## Accès à l'API

L'url d'accès à l'api (et documentation) est la suivante: `http://localhost:3000/`

Pour la gestion des items: `http://localhost:3000/items/`

Pour la gestion des additions: `http://localhost:3000/sums/`

Pour la gestion des categories: `http://localhost:3000/categories/`

Pour la gestion des utilisateurs: `http://localhost:3000/users/`

Pour la gestion des caisses: `http://localhost:3000/registers/`