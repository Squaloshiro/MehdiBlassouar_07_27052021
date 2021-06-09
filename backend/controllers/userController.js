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
    deleteUserProfile: function (req, res) {
        // Getting auth header
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;
        // Params

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
            function (userFound,done) {
                models.Message.findAll({
                    attributes : ['id','attachment','likes','dislikes','comments']
                })
                    .then(function (allMessageFound) {

                        let messageIdTab = [];
                        let messageAttachmentTab = [];
                        let messageCommentsTab = [];
                        let messageLikesTab = [];
                        let messageDislikesTab = [];
                       
                        allMessageFound.forEach((element) =>{
                            console.log('---------------element---------------------');
                            console.log(element);
                            console.log('------------------------------------');
                            messageIdTab.push(element.id)
                            messageAttachmentTab.push(element.attachment)
                            messageCommentsTab.push(element.comments, {include: [{
                                model: models.Comment,
                                where: userId, id : messageIdTab
                            }]})
                            messageLikesTab.push(element.likes)
                            messageDislikesTab.push(element.dislikes);
                        })
                        
                        console.log('-------------messageCommentsTab-----------------------');
                        console.log(messageCommentsTab[1].include);
                        console.log('------------------------------------');
                        
                        done(null, userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab);
                    })
                    .catch(function (err) {
                        console.log('---------------1---------------------');
                        console.log(err);
                        console.log('------------------------------------');
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,done) {
                
                models.Like.findAll({
                    where: { userId, userDislike : true },
                    
                    attributes : ['messageId']
                })
                    .then(function (allLikeFoundDislike) {
                        console.log('-------------allLikeFoundDislike-----------------------');
                        console.log(allLikeFoundDislike);
                        console.log('------------------------------------');
                        done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab, allLikeFoundDislike);
                    })
                    .catch(function (err) {
                        console.log('---------------err5---------------------');
                        console.log(err);
                        console.log('------------------------------------');
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
                
            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,allLikeFoundDislike,done) {
                
                
                    models.Like.findAll({
                        where: { userId, userLike : true },
                        
                        attributes : ['messageId']
                    })
                        .then(function (allLikeFoundLike) {
                            console.log('-------------allLikeFoundLike-----------------------');
                            console.log(allLikeFoundLike);
                            console.log('------------------------------------');
                            done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab, allLikeFoundDislike,allLikeFoundLike);
                        })
                        .catch(function (err) {
                            console.log('----------err6--------------------------');
                            console.log(err);
                            console.log('------------------------------------');
                            return res.status(500).json({ 'error': 'unable to verify user' });
                        });
            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,allLikeFoundDislike,allLikeFoundLike,done) {
                models.Comment.findAll({
                    where: { userId: userId, messageId :messageIdTab  },
                    attributes : ['id','messageId']
                })
                    .then(function (allCommentFound) {


                        let messageToDelete = Object.values(
                            allCommentFound.reduce((a, { messageId }) => {
                            let key = `${messageId}`;
                            a[key] = a[key] || { messageId, count: 0 };
                            a[key].count++;
                            return a;
                            }, {})
                            );

                        const abc =  JSON.parse(JSON.stringify(allCommentFound)).sort((a,b) =>
                            (a.messageId < b.messageId)? 1:((b.messageId < a.messageId)?-1 : 0

                        ))
                        const userMessageComment = abc.map(item => item.messageId).filter((elt,i,a)=>a.indexOf(elt)=== i).sort((a,b)=>a-b)


                        let commentIds = [];
                        let commentMessageId = [];
                    
                        allCommentFound.forEach((element) =>{
                        commentIds.push(element.id);
                        commentMessageId.push(element.messageId);
                    })
                        done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab, allLikeFoundDislike,allLikeFoundLike,commentIds,messageToDelete,userMessageComment);
                    })
                    .catch(function (err) {
                        console.log('------------------3------------------');
                        console.log(err);
                        console.log('------------------------------------');
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,allLikeFoundDislike,allLikeFoundLike,commentIds,messageToDelete,userMessageComment,done) {
                models.Commentlike.findAll({
                    where: { userId: userId , userLike : true },
                    attributes : ['commentId']
                })
                    .then(function (allCommentLikeFoundLike) {

                        done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab, allLikeFoundDislike,allLikeFoundLike,commentIds,allCommentLikeFoundLike,messageToDelete,userMessageComment);
                    })
                    .catch(function (err) {
                        console.log('---------------------4---------------');
                        console.log(err);
                        console.log('------------------------------------');
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,allLikeFoundDislike,allLikeFoundLike,commentIds,allCommentLikeFoundLike,messageToDelete,userMessageComment,done) {
                models.Commentlike.findAll({
                    where: { userId: userId , userDislike : true },
                    attributes : ['commentId']
                })
                    .then(function (allCommentLikeFoundDislike) {

                        done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab, allLikeFoundDislike,allLikeFoundLike,commentIds,allCommentLikeFoundLike,allCommentLikeFoundDislike,messageToDelete,userMessageComment);
                    })
                    .catch(function (err) {
                        console.log('---------------------7---------------');
                        console.log(err);
                        console.log('------------------------------------');
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,allLikeFoundDislike,allLikeFoundLike,commentIds,allCommentLikeFoundLike,allCommentLikeFoundDislike,messageToDelete,userMessageComment,done) {

                        
                        models.Like.destroy({
                            where : {userId}
                        }).then((result) =>{
                            let likeMessageIdTabDislike = [];

                            allLikeFoundDislike.forEach((element) =>{
                                likeMessageIdTabDislike.push(element.messageId);
                            });
    
                            models.Message.decrement({dislikes :1},{
                                where : {id : likeMessageIdTabDislike},
                            })

                        }).then((result) => {
                            let likeMessageIdTabLike = [];

                        allLikeFoundLike.forEach((element) =>{
                            likeMessageIdTabLike.push(element.messageId);
                        });

                        models.Message.decrement({likes :1},{
                            where : {id : likeMessageIdTabLike},
                        })
                        }).then(function () {
                            done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,commentIds,allCommentLikeFoundLike,allCommentLikeFoundDislike,messageToDelete,userMessageComment);
                        }).catch(err => {
                            return res.status(500).json({ 'error': 'Pas possible de supprimer le message' });
                        });
            },
            
            
            /*function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,commentIds,allCommentLikeFoundLike,allCommentLikeFoundDislike,messageToDelete,userMessageComment,done) {

                models.Commentlike.destroy({
                    where : {userId}
                }).then((result) =>{
                    let commentLikeMessageIdTablike = [];

                    allCommentLikeFoundLike.forEach((element) =>{
                        commentLikeMessageIdTablike.push(element.commentId);
                    });

                    models.Comment.decrement({likes :1},{
                        where : {id : commentLikeMessageIdTablike},
                    })

                }).then((result) => {
                    let commentLikeMessageIdTabDislike = [];

                    allCommentLikeFoundDislike.forEach((element) =>{
                    commentLikeMessageIdTabDislike.push(element.commentId);
                });

                models.Comment.decrement({dislikes : 1},{
                    where : {id : commentLikeMessageIdTabDislike},
                })
                }).then(function () {
                    done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,commentIds,messageToDelete,userMessageComment);
                }).catch(err => {
                    return res.status(500).json({ 'error': 'Pas possible de supprimer le message' });
                });
            },*/
          function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageLikesTab,messageCommentsTab,messageDislikesTab,commentIds,allCommentLikeFoundLike,allCommentLikeFoundDislike,messageToDelete,userMessageComment,done) {


            /*models.Comment.destroy({
                where : {userId}
            }).then((result) =>{*/
                models.Message.findAll({
                    where : {id : userMessageComment}
                })
            .then(result=>{
                    const finalTab = [];
                    const objectsEqual = (o1, o2) => {
                                        Object.keys(o1).map((elt, p) => {
                    if (o1[p].messageId === o2[p]?.id) {
                    o2[p].comments = o2[p].comments - o1[p].count;
                    finalTab.push(o2[p]);
                    }
                    });
                    };
                    console.log('--------------gdsgd----------------------');
                    console.log(messageToDelete);
                    console.log('------------------------------------');
                    console.log('----------gdfgfsdfd--------------------------');
                    console.log(result);
                    console.log('------------------------------------');
                    objectsEqual(messageToDelete, result);

                    userMessageComment.map((elt,i)=>{
                        models.Message.update({comments : finalTab[i].comments},{
                            where : {id : elt},
                        })
                    })
                  
                }).then(result=>{
                    models.Comment.destroy({
                        where : {userId}
                    })
                })
                /*models.Comment.destroy({
                        where : {userId}
                    }).then((result) =>{
                            models.Message.decrement({comments : 1 },{
                                where : {id : commentIds},
                            })
                        
                    }).then(function () {
                        done(null,userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,commentIds,allCommentLikeFoundLike,allCommentLikeFoundDislike);
                       res.send('test')
                    })*/
                },
            
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,commentIds,allCommentLikeFoundLike,done) {

            },
            function (userFound,allMessageFound,messageIdTab,messageAttachmentTab,messageCommentsTab,messageLikesTab,messageDislikesTab,commentIds,allCommentLikeFoundLike,done) {

            },
            
                  
        ])

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