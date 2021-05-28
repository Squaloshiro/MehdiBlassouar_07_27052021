//imports

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const models = require('../models')
const asyncLib = require('async');


const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const password_regex = /^(?=.*\d).{4,8}$/;

//Controller
module.exports = {
    register: function (req, res) {


        //Params
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let bio = req.body.bio;

        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error': 'paramètres manquant' });
        }

        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'le pseudo doit être compris entre  5 et 12 carractère' });
        }

        if (!email_regex.test(email)) {
            return res.status(400).json({ 'error': 'Vérifier votre email' });
        }

        if (!password_regex.test(password)) {
            return res.status(400).json({ 'error': 'le mot de passe doit être compris entre  4 et 8 carractère' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email }
                })
                    .then(function (userFound) {
                        done(null, userFound)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "problem d'ajout utilisateur" })
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptePassword) {
                        done(null, userFound, bcryptePassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'utilisateur déjà existant' });
                }
            },
            function (userFound, bcryptePassword, done) {
                let newUser = models.User.create({
                    email: email,
                    username: username,
                    password: bcryptePassword,
                    bio: bio,
                    isAdmin: 0
                })
                    .then(function (newUser) {
                        done(newUser);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "ajout de l'utilisateur impossible" })
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': "problem d'ajout utilisateur" })
            }
        })
    },
    login: function (req, res) {

        //params
        let email = req.body.email;
        let password = req.body.password;


        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'paramètre manquant' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': "utilisateur n'éxiste pas dans la base de donnée" });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ "error": "mot de passe invalide" });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(200).json({
                    'userId': userFound.id,
                    'token': jwt.sign(
                        {
                            userId: userFound.id,
                            isAdmin: userFound.isAdmin
                        },
                        process.env.TOKEN,
                        { expiresIn: '24h' }
                    )
                });
            } else {
                return res.status(500).json({ 'error': "vérifier vos information de connexion" });
            }
        });
    },
    getUserProfile: function (req, res) {
        //let userId = req.body.userId
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        models.User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where: { id: userId }
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ "error": "utilisateur non trouvée" })
            }
        }).catch(function (err) {
            res.status(500).json({ 'error': "impossible de récuperer l'utilisateur" })
        });
    },
    updateUserProfile: function (req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;

        let bio = req.body.bio

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'bio'],
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'impossible de vérif utilisateur' })
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'impossible de modifier' });
                    });
                } else {
                    res.status(404).json({ 'error': 'utilisateur non trouvé' });
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'impossibe de modifier ce profile' });
            }
        })
    }
}