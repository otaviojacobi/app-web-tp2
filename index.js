'use strict;'

const express = require('express');
const faker = require('faker');
const cors = require('cors');
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

// Initialisation serveur
const app = express();

// Configuration Faker
faker.locale = 'fr';

// Sécurité
app.use(cors());

// Configuration parser body
app.use(bodyParser.json());

// Route /

/* Partie SQLite */
 // Connexion à la base de donnée avec sqlite
const db = new sqlite3.Database('database-phe.db');
// Initialisation de la table paris

// Récupération de tous les paris avec Sqlite

// Ajout d'un pari avec Sqlite

// Génération de 10 paris aléatoires avec Sqlite

// Suppression d'un pari avec Sqlite

/* Démarrage serveur */
app.listen(3000, function () {
  console.log('Serveur phe-backend démarré !');
});
