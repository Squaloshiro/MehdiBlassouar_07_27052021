const models = require('../models');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const fs = require('fs');


module.exports = {
    createcomment: function (req, res) {
        // Getting auth header
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;

        // Params

        var content = req.body.content;
       /* var messageId = parseInt(req.params.messageId);
        if (messageId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }*/
        var messageId = req.body.MessageId

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
                    models.Message.findOne({
                        where: { id: messageId }
                    })
                        .then(function (messageFound) {

                            done(null, messageFound, userFound);
                        })
                        .catch(function (err) {
                            return res.status(500).json({ 'error': 'unable to verify user' });
                        });
                } else {
                    return res.status(404).json({ 'error': 'user not exist' });
                }
            },
            function (messageFound, userFound, done) {


                if (messageFound) {

                    models.Comment.create({
                        content: content,
                        likes: 0,
                        dislikes: 0,
                        UserId: userFound.id,
                        MessageId: messageFound.id
                    })
                        .then(function (newComment) {
                            done(newComment);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (newComment) {
            if (newComment) {
                return res.status(201).json(newComment);
            } else {
                return res.status(500).json({ 'error': 'cannot post message' });
            }
        });
    },
    listComments: function(req,res){
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        const ITEMS_LIMIT = 50;
        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Comment.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
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
    getOneComment: function(req,res){
        models.Comment.findByPk(req.params.id )
            .then(function (messages){ res.status(200).json(messages)})
            .catch(err => {
                console.log(err);
                res.status(500).json({ "error": "ce commentaire existe pas" });
            });
    },
    modifyComment: function(req,res){
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        let content = req.body.content
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
                models.Comment.findOne({
                    attributes:['id', 'content'],
                    where:{UserId : userId}
                }).then(function(commentFound){

                    done(null,commentFound,userFound);
                })
                .catch(function (err){
                    return res.status(500).json({ 'error': 'impossible de vérif utilisateur' })
                });
                
            },
            function (commentFound,userFound, done) {
                if (commentFound) {
                    commentFound.update({
                        content: (content ? content : commentFound.content)
                    }).then(function (newComment) {
                        done(newComment);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'impossible de modifier' });
                    });
                } else {
                    res.status(404).json({ 'error': 'utilisateur non trouvé' });
                }
            },
        ],function (newComment) {
            if (newComment) {
                return res.status(201).json(newComment);
            } else {
                return res.status(500).json({ 'error': 'impossibe de modifier ce commentaire' });
            }
        })
    },
    modifyComment: function(req,res){
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        let content = req.body.content
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
                models.Comment.findOne({
                    attributes:['id', 'content'],
                    where:{UserId : userId}
                }).then(function(commentFound){

                    done(null,commentFound,userFound);
                })
                .catch(function (err){
                    return res.status(500).json({ 'error': 'impossible de vérif utilisateur' })
                });
                
            },
            function (commentFound,userFound, done) {
                if (commentFound) {
                    commentFound.update({
                        content: (content ? content : commentFound.content)
                    }).then(function (newComment) {
                        done(newComment);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'impossible de modifier' });
                    });
                } else {
                    res.status(404).json({ 'error': 'utilisateur non trouvé' });
                }
            },
        ],function (newComment) {
            if (newComment) {
                return res.status(201).json(newComment);
            } else {
                return res.status(500).json({ 'error': 'impossibe de modifier ce commentaire' });
            }
        })
    },
}