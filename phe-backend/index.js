'use strict;'

const express = require('express');
const faker = require('faker');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Sequelize, Model, DataTypes } = require('sequelize');

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
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database-phe.db'
});

// Initialisation de la table paris
class Paris extends Model {}
Paris.init({
  author: DataTypes.STRING,
  horse: DataTypes.INTEGER,
}, { sequelize, modelName: 'paris', createdAt: 'date' });
Paris.sync();

// Récupération de tous les paris avec Sqlite
const getAllParis = (req, res) => {


  Paris.findAll({ attributes: {exclude: ['updatedAt']}, order: [['date', 'DESC']] })
       .then(rows => res.status(200).send(rows))
       .catch(err => {
          console.error(err);
          return res.status(503).send('Nous avons eu un problème de connexion à la base de données');
       });
};

// Ajout d'un pari avec Sqlite
const insertNewParis = (req, res) => {

  if(_isNewParisBodyValid(req.body)) {
      return res.status(400).send('Le body doit contenir "author" et "horse". Le premier doit être une chaîne de caractères et le second un entier.');
  }

  return Paris.create({ author: req.body.author, horse: req.body.horse})
              .then(_ => res.status(201).send('Pari créé'))
              .catch(err => {
                console.error(err);
                return res.status(503).send('Echoué pour créé Pari cause d\'un problème de connexion à la base de données');
              });
};

const _isNewParisBodyValid = body => {
  return !body.author || 
         !body.horse || 
         typeof body.author !== 'string' || 
         typeof body.horse !== 'number' || 
         !Number.isInteger(body.horse);
};


// Génération de 10 paris aléatoires avec Sqlite
const generateParis = (req, res, amount) => {
  
  const paris = [];
  for(let i = 0; i < amount; i++) {
    paris.push({author: faker.name.firstName(), horse: faker.random.number({min: 1, max: 10}) });
  }

  return Paris.bulkCreate(paris)
              .then(_ => res.status(201).send('10 Paris générés aleatoirement'))
              .catch(err => {
                console.error(err);
                res.status(503).send('Echoué pour créé Pari cause d\'un problème de connexion à la base de données');
              });
};

// Suppression d'un pari avec Sqlite
const deleteParis = (req, res) => {
  return Paris.destroy({where: { id : req.params.id }})
              .then(deleted => deleted ? res.status(200).send('Pari supprimé') : res.status(400).send('N\'a trouvé paris avec cette id'))
              .catch(err => {
                console.error(err);
                res.status(503).send('Echoué pour créé Pari cause d\'un problème de connexion à la base de données');
              });
};

/* Démarrage serveur */

app.listen(3000, function () {
  console.log('Serveur phe-backend démarré !');
});
