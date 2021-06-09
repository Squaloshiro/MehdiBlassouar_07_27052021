


const express = require('express');
const bodyParser = require('body-parser') // extrair l'objet JSON des req Post 
const path = require('path'); // donne accés au chemin de nos systeme de fichier
const helmet = require('helmet');
require('dotenv').config(); // module 'dotenv' pour masquer les informations de connexion à la base de données 
const app = express(); // utilisation de expresse pour le site
const userRoutes = require('./routes/userRoute')
const messageRoute = require('./routes/messageRoute')
const likesRoute = require('./routes/likesRoute')
const commentLikesRoute = require('./routes/commentLikeRoute')
const commentRoute = require('./routes/commentRoute')


app.use((req, res, next) => {// contourne les certaine erreurs CORS pour que tous le monde puisse faire des requetes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())//middleware qui permet de parse les requetes post en objet JSON
app.use(helmet());// mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs 
app.use('/', userRoutes)
app.use('/', messageRoute)
app.use('/', likesRoute)
app.use('/', commentLikesRoute)
app.use('/', commentRoute)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('*', (req, res) => { res.json({ error: 404 }) })
module.exports = app;// exporte express pour le server.js