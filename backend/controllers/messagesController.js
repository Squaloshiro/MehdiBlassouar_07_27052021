const models = require('../models');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
    createMessageImage: function (req, res) {
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
                        attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
                        comments: 0,
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
    listMessagesUser: function (req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        const ITEMS_LIMIT = 50;
        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Message.findAll({
            where: { UserId: userId },
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

    getOneMessage: function (req, res, next) {

        models.Message.findByPk(req.params.id)
            .then(function (messages) { res.status(200).json(messages) })
            .catch(err => {
                console.log(err);
                res.status(500).json({ "error": "ce message existe pas" });
            });
    },
    modifyMessage: function (req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;


        let content = req.body.content
        let title = req.body.title
        asyncLib.waterfall([
            function (done) {
                models.Message.findByPk(
                    req.params.id
                ).then(function (messageFound) {
                    done(null, messageFound);
                })
                    .catch(function (err) {

                        return res.status(500).json({ 'error': 'impossible de vérif utilisateur' })
                    });

            },
            function (messageFound, done) {
                if (messageFound) {
                    models.User.findOne({
                        where: { id: userId }
                    }).then(function (userFound) {

                        done(null, messageFound, userFound);
                    })
                        .catch(function (err) {

                            return res.status(500).json({ 'error': 'impossible de vérif utilisateur2' })
                        });
                } else {
                    return res.status(500).json({ 'error': 'impossible de vérif utilisateur2' })
                }


            },
            function (messageFound, userFound, done) {
                models.Message.findOne({
                    attributes: ['title', 'content'],
                    where: {
                        id: req.params.id,
                        UserId: userId
                    }
                }).then(function (message) {

                    done(null, messageFound, userFound);
                })
                    .catch(function (err) {
                        console.log('------------------------------------');
                        console.log(err);
                        console.log('------------------------------------');
                        return res.status(500).json({ 'error': 'impossible de vérif utilisateur3' })
                    });

            },
            function (messageFound, userFound, done) {
                if (messageFound) {
                    if (messageFound.UserId === userFound.id) {
                        messageFound.update({
                            content: (content ? content : messageFound.content),
                            title: (title ? title : messageFound.title)
                        }).then(function (newMessage) {
                            done(newMessage);
                        }).catch(function (err) {
                            res.status(500).json({ 'error': 'impossible de modifier' });
                        });
                    } else {
                        res.status(500).json({ 'error': 'cette pub' });
                    }

                } else {
                    res.status(404).json({ 'error': 'utilisateur non trouvé' });
                }
            },
        ], function (newMessage) {
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'impossibe de modifier ce commentaire' });
            }
        })
    },
    deleteOneMessage: function (req, res) {
        //Params
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;
        var messageId = req.params.id
        
        asyncLib.waterfall([

            function (done) {

                models.Comment.findAll({
                    where: { messageId  },
                    attributes : ['id']
                }).then(function (commentsFound) {
                    let commentIds = [];
                    
                    commentsFound.map(({id}) =>{
                        commentIds.push(id);
                    })
                    done(null, commentIds);
                }).catch(function (err) {
                    res.status(500).json({ 'error': 'impossible de modifier 1' });
                });
            },
            function (commentIds, done) {
                
                    models.Commentlike.destroy({
                        where: { commentId: commentIds  }
                    }).then(function (commentsLikeFound) {
                        done(null);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'impossible de modifier 2' });
                    });
            },
            function (done) {

                models.Comment.destroy({
                    where: { messageId: messageId }
                })
                    .then(() => {
                        models.Like.destroy({
                            where: { messageId: messageId }
                        })
                        done(null);
                    })
                    .catch(err => {

                        return res.status(500).json({ 'error': 'Pas possible de supprimer les commentaires ou les likes' });
                    })
                },
                function (done) {
                    models.Message.findOne({
                        where: { id :messageId }
                    }).then(function (messageFound) {
                        done(null, messageFound);
                    }).catch(function (err) {

                        res.status(500).json({ 'error': 'impossible de modifier111111' });
                    });
                },
               function ( messageFound,done) {
                   console.log('------------------------------------');
                   console.log(userId);
                   console.log('------------------------------------');
                if(messageFound.UserId === userId){
                    if(messageFound.attachment === null){
                        messageFound.destroy({
                            where: { id :messageId }
                        }).then(function (destroyMessageFound) {
                            return res.status(201).json(destroyMessageFound);
                        }).catch(function (err) {
                            res.status(500).json({ 'error': 'impossible de modifier 2' });
                        });
                    }else{
                        const filename = models.Message.attachment.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                            models.Message.destroy({
                                where: { id: messageId }
                            })
                        }).then(function (destroyMessageFoundImg) {
                            return res.status(201).json(destroyMessageFoundImg);
                        }).catch(function (err) {
                            res.status(500).json({ 'error': 'impossible de modifier 2' });
                        });
                           
                        
                    }
                }else
                return res.status(500).json({ 'error': 'cette publication ne vous apartien pas' });
                }
            ])
        },
    }
                    /*.then(commentsFound => {

                        models.Message.destroy({
                            where: { id: messageId }
                        })
                        return res.status(201).json(commentsFound)
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': 'Pas possible de supprimer le message' });
                    })
                    .then(commentsFoundImg => {
                        const filename = models.Message.attachment.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                            models.Message.destroy({
                                where: { id: messageId }
                            })
                        })
                        models.Message.destroy({
                            where: { id: messageId }
                        })
                        return res.status(201).json(commentsFoundImg)
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': 'Pas possible de supprimer le message' });
                    });
            }
        ]),
    },*/

