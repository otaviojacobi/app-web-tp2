"use strict;";

const express = require("express");
const faker = require("faker");
const cors = require("cors");
const bodyParser = require("body-parser");

const Sequelize = require("sequelize");

// Initialisation serveur
const app = express();

// Configuration Faker
faker.locale = "fr";

// Sécurité
app.use(cors());

// Configuration parser body
app.use(bodyParser.json());

// Route /
app.get("/", function(req, res) {
  res.send("Server is OK :)");
});

/* Partie Sequelizer */

// Connexion à la base de donnée avec Sequelize
const sequelize = new Sequelize("sqlite:database-chat.db");

// Modèle Pari avec Sequelize
const Bet = sequelize.define("bet", {
  author: {
    type: Sequelize.STRING
  },
  horse: {
    type: Sequelize.INTEGER
  }
});

// Modèle User avec Sequelize
const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});

// Création des tables
Bet.sync({ force: true }).then(() => console.log("Table paris créée"));
User.sync({ force: true }).then(() => {
  console.log("Table user créée");
  User.create({
    username: "alice",
    password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
  });
  User.create({
    username: "bob",
    password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
  });
  User.create({
    username: "cyril",
    password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
  });
});

// Création d'utilisateurs

// Récupération de tous les paris avec Sequelizer
app.get("/paris", function(req, res) {
  Bet.findAll({ order: sequelize.literal("createdAt DESC") }).then(
    paris => {
      res.send(paris);
    }
  );
});

// Ajout d'un pari avec Sequelizer
app.post("/paris", function(req, res) {
  const author = req.body.author;
  const horse = req.body.horse;
  Bet.create({
    author: author,
    horse: horse
  })
  .then((pari) => io.emit("PARI_ADDED", pari))
  .then(() => res.status(201).send("Pari created"));
});

// Génération de 10 paris aléatoires avec Sequelizer
app.post("/paris/generate", function(req, res) {
  for (let i = 0; i < 10; i++) {
    const author = faker.name.firstName();
    const horse = faker.random.number({min: 1, max: 10});
    Bet.create({
      author: author,
      horse: horse
    });
  }
  res.status("201").send("10 Paris created");
});

// Suppression d'un pari avec Sequelizer
app.delete("/paris/:id", function(req, res) {
  const id = req.params.id;
  Bet.destroy({
    where: {
      rowid: id
    }
  })
  .then(() => io.emit("PARI_DELETED", id))
  .then(res.status("200").send("Pari deleted"));
});

// Login
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.hashedPassword;
  User.findAll({
    where: {
      username: username,
      password: password
    }
  }).then(users => {
    if (users.length > 0) {
      res.status("200").send("Access granted");
    } else {
      res.status("403").send("Access denied");
    }
  });
});

/* Démarrage serveur */
const server = app.listen(3000, function() {
  console.log("Serveur phe-backend démarré !");
});

// Socket.io
const io = require("socket.io")(server);
io.on("connection", function(socket) {
  console.log("Connection " + socket.id);
});