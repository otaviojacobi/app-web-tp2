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
app.get('/', (req, res) => {
  res.status(200).send('PONG');
});

app.get('/paris', (req, res) => {
  getAllParis(req, res);
});

app.post('/paris', (req, res) => {
  insertNewParis(req, res);
});

app.post('/paris/generate', (req, res) => {
  generateParis(req, res, 10);
});

app.delete('/paris/:id', (req, res) => {
  deleteParis(req, res);
});

/* Partie SQLite */
 // Connexion à la base de donnée avec sqlite
const db = new sqlite3.Database('database-phe.db');

// Initialisation de la table paris
db.run('CREATE TABLE IF NOT EXISTS paris(id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, cheval INTEGER, date TEXT)');

// Récupération de tous les paris avec Sqlite
const getAllParis = (req, res) => {
  db.all('SELECT rowid as id, * FROM paris ORDER BY date', [], (err, rows) => {
    if(err) {
      console.error(err);
      return res.status(503).send('Nous avons eu un problème de connexion à la base de données');
    }
    return res.status(200).send(rows);
  });
};

// Ajout d'un pari avec Sqlite
const insertNewParis = (req, res) => {

  if(_isNewParisBodyValid(req.body)) {
      return res.status(400).send('Le body doit contenir "author" et "cheval". Le premier doit être une chaîne de caractères et le second un entier.');
  }

  const date = new Date().toISOString();
  db.run('INSERT INTO paris(author, cheval, date) VALUES (?, ?, ?)', [req.body.author, req.body.cheval, date], err => {
    if(err) {
      console.error(err);
      return res.status(503).send('Echoué pour créé Pari cause d\'un problème de connexion à la base de données');
    } 
    return res.status(201).send('Pari créé');
  });
};

const _isNewParisBodyValid = body => {
  return !body.author || 
         !body.cheval || 
         typeof body.author !== 'string' || 
         typeof body.cheval !== 'number' || 
         !Number.isInteger(body.cheval);
};


// Génération de 10 paris aléatoires avec Sqlite
const generateParis = (req, res, amount) => {
  
  const parises = [];
  for(let i = 0; i < amount; i++) {
    parises.push([faker.name.firstName(), faker.random.number({min: 1, max: 10}), new Date().toISOString()]);
  }

  const placeholders = parises.map(_ => '(?, ?, ?)').join(',');
  const query = 'INSERT INTO paris (author, cheval, date) VALUES ' + placeholders;
  db.run(query, [].concat.apply([], parises),  err => {
    if(err) {
      console.error(err);
      return res.status(503).send('Echoué pour créé Paries cause d\'un problème de connexion à la base de données');
    } 
    return res.status(201).send('10 Paris générés aléatoirement');
  });
};

// Suppression d'un pari avec Sqlite
const deleteParis = (req, res) => {
  db.run('DELETE FROM paris WHERE id=?', req.params.id, function(err) {

    if(err) {
      console.error(err);
      return res.status(503).send('Echoué pour supprimer Paris cause d\'un problème de connexion à la base de données');
    }

    if(this.changes === 0) {
      return res.status(400).send('Ce paris doest n\'existe pas');
    }

    return res.status(200).send(`Paris avec ID ${req.params.id} supprimé`);
  });
};

/* Démarrage serveur */

app.listen(3000, function () {
  console.log('Serveur phe-backend démarré !');
});
