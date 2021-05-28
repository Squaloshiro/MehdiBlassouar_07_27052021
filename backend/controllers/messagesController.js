const models = require('../models');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
    createMessageImage: function(req,res){
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        const TITLE_LIMIT = 2;
        const CONTENT_LIMIT = 4;
        const ITEMS_LIMIT = 50;

        // Params
        var title = req.body.title;
        var content = req.body.content;


        if (title == null || content == null && attachment == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { id: userId }
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
                    models.Message.create({
                        title: title,
                        content: content,
                        likes: 0,
                        dislikes: 0,
                        UserId: userFound.id,
                        attachment:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    })
                        .then(function (newMessage) {
                            done(newMessage);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (newMessage) {
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'cannot post message' });
            }
        });
    },
    createMessage: function (req, res) {
        // Getting auth header
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        const TITLE_LIMIT = 2;
        const CONTENT_LIMIT = 4;
        const ITEMS_LIMIT = 50;

        // Params
        var title = req.body.title;
        var content = req.body.content;


        if (title == null || content == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { id: userId }
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
                    models.Message.create({
                        title: title,
                        content: content,
                        likes: 0,
                        dislikes: 0,
                        UserId: userFound.id
                    })
                        .then(function (newMessage) {
                            done(newMessage);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (newMessage) {
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'cannot post message' });
            }
        });
    },
    listMessages: function (req, res) {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        const ITEMS_LIMIT = 50;
        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        }).then(function (messages) {
            if (messages) {
                res.status(200).json(messages);
            } else {
                res.status(404).json({ "error": "no messages found" });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
        });
    },

    getOneMessage: function  (req, res, next){

        models.Message.findByPk(req.params.id )
            .then(function (messages){ res.status(200).json(messages)})
            .catch(err => {
                console.log(err);
                res.status(500).json({ "error": "ce message existe pas" });
            });
    },
    modifyComment: function(req,res){
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        let content = req.body.content
        let title = req.body.title
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where:{id : userId}
                }).then(function(userFound){

                    done(null,userFound);
                })
                .catch(function (err){
                    return res.status(500).json({ 'error': 'impossible de vérif utilisateur' })
                });
                
            },
            function (userFound,done) {
                models.Message.findOne({
                    attributes:['id','title', 'content'],
                    where:{UserId : userId}
                }).then(function(messageFound){

                    done(null,messageFound,userFound);
                })
                .catch(function (err){
                    return res.status(500).json({ 'error': 'impossible de vérif utilisateur' })
                });
                
            },
            function (messageFound,userFound, done) {
                if (messageFound) {
                    messageFound.update({
                        content: (content ? content : commentFound.content)
                        title: (title ? title : commentFound.title)
                    }).then(function (newMessage) {
                        done(newMessage);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'impossible de modifier' });
                    });
                } else {
                    res.status(404).json({ 'error': 'utilisateur non trouvé' });
                }
            },
        ],function (newMessage) {
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'impossibe de modifier ce commentaire' });
            }
        })
    },
    
}