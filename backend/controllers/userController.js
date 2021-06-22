//imports

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const models = require('../models')
const asyncLib = require('async');
const fs = require('fs');




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
            return res.status(400).json({ 'error': 'missing params' });
        }

        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'the nickname must be between 5 and 12 characters' });
        }

        if (!email_regex.test(email)) {
            return res.status(400).json({ 'error': 'check your email' });
        }

        if (!password_regex.test(password)) {
            return res.status(400).json({ 'error': 'the password must be between 4 and 8 characters' });
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
                        return res.status(500).json({ 'error': "user add problem" })
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptePassword) {
                        done(null, userFound, bcryptePassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user allready existing' });
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
                        return res.status(500).json({ 'error': "user cannot be added" })
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(200).json({
                    'token': jwt.sign(
                        {
                            userId: newUser.id,
                            isAdmin: newUser.isAdmin
                        },
                        process.env.TOKEN,
                        { expiresIn: '24h' }
                    )
                });
            } else {
                return res.status(500).json({ 'error': "user add problem" })
            }
        })
    },
    login: function (req, res) {

        //params
        let email = req.body.email;
        let password = req.body.password;


        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameter' });
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
                    return res.status(404).json({ 'error': "user not found in data base" });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ "error": "invalid password" });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(200).json({
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
                return res.status(500).json({ 'error': "check your login information" });
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
                res.status(404).json({ "error": "user not found" })
            }
        }).catch(function (err) {
            res.status(500).json({ 'error': "unable to retrieve user" })
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

            function (userFound, done) {
                models.Message.findAll({
                    attributes: ['id', 'attachment', 'likes', 'dislikes', 'comments']
                })
                    .then((allMessageFound) => {
                        let messageIdTab = [];
                        allMessageFound.forEach((element) => {
                            messageIdTab.push(element.id)
                        })
                        done(null, userFound, messageIdTab);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify all messages' });
                    });
            },

            function (userFound, messageIdTab, done) {
                models.Like.findAll({
                    where: { userId, userDislike: true },
                    attributes: ['messageId']
                })
                    .then(function (allLikeFoundDislike) {
                        done(null, userFound, messageIdTab, allLikeFoundDislike);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify all userDislike' });
                    });
            },

            function (userFound, messageIdTab, allLikeFoundDislike, done) {
                models.Like.findAll({
                    where: { userId, userLike: true },
                    attributes: ['messageId']
                })
                    .then(function (allLikeFoundLike) {
                        done(null, userFound, messageIdTab, allLikeFoundDislike, allLikeFoundLike);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify all userLike' });
                    });
            },

            function (userFound, messageIdTab, allLikeFoundDislike, allLikeFoundLike, done) {
                models.Comment.findAll({
                    where: { userId, messageId: messageIdTab },
                    attributes: ['id', 'messageId']
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
                        const abc = JSON.parse(JSON.stringify(allCommentFound)).sort((a, b) =>
                            (a.messageId < b.messageId) ? 1 : ((b.messageId < a.messageId) ? -1 : 0))
                        const userMessageComment = abc.length > 0 ? abc.map(item => item.messageId).filter((elt, i, a) => a.indexOf(elt) === i).sort((a, b) => a - b) : []
                        done(null, userFound, allLikeFoundDislike, allLikeFoundLike, messageToDelete, userMessageComment);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify all comment' });
                    });
            },

            function (userFound, allLikeFoundDislike, allLikeFoundLike, messageToDelete, userMessageComment, done) {
                models.Commentlike.findAll({
                    where: { userId: userId, userLike: true },
                    attributes: ['commentId']
                })
                    .then(function (allCommentLikeFoundLike) {
                        done(null, userFound, allLikeFoundDislike, allLikeFoundLike, allCommentLikeFoundLike, messageToDelete, userMessageComment);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify all comment userLike' });
                    });
            },

            function (userFound, allLikeFoundDislike, allLikeFoundLike, allCommentLikeFoundLike, messageToDelete, userMessageComment, done) {
                models.Commentlike.findAll({
                    where: { userId: userId, userDislike: true },
                    attributes: ['commentId']
                })
                    .then(function (allCommentLikeFoundDislike) {
                        done(null, userFound, allLikeFoundDislike, allLikeFoundLike, allCommentLikeFoundLike, allCommentLikeFoundDislike, messageToDelete, userMessageComment);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify all comment userDisike' });
                    });
            },
            function (userFound, allLikeFoundDislike, allLikeFoundLike, allCommentLikeFoundLike, allCommentLikeFoundDislike, messageToDelete, userMessageComment, done) {
                models.Message.findAll({
                    where: { userId },
                    attributes: ['id']
                }).then((result) => {
                    let tabMessageId = [];
                    result.forEach(({ id }) => {
                        tabMessageId.push(id);
                    })
                    models.Like.destroy({
                        where: { messageId: tabMessageId }
                    })
                }).then(() => {
                    models.Like.destroy({
                        where: { userId }
                    }).then((result) => {
                        let likeMessageIdTabDislike = [];
                        allLikeFoundDislike.forEach((element) => {
                            likeMessageIdTabDislike.push(element.messageId);
                        });
                        models.Message.decrement({ dislikes: 1 }, {
                            where: { id: likeMessageIdTabDislike },
                        })
                    }).then((result) => {
                        let likeMessageIdTabLike = [];
                        allLikeFoundLike.forEach((element) => {
                            likeMessageIdTabLike.push(element.messageId);
                        });
                        models.Message.decrement({ likes: 1 }, {
                            where: { id: likeMessageIdTabLike },
                        })
                    }).then(function () {
                        done(null, userFound, allCommentLikeFoundLike, allCommentLikeFoundDislike, userMessageComment, messageToDelete);
                    }).catch(err => {
                        return res.status(500).json({ 'error': 'unable to delet  likes' });
                    });
                })
            },

            function (userFound, allCommentLikeFoundLike, allCommentLikeFoundDislike, userMessageComment, messageToDelete, done) {
                models.Message.findAll({
                    where: { userId },
                    attributes: ['id']
                }).then((result) => {
                    let tabMessageId = [];
                    result.forEach(({ id }) => {
                        tabMessageId.push(id);
                    })
                    return tabMessageId
                }).then((tabMessageId) => {
                    models.Comment.findAll({
                        where: { messageId: tabMessageId },
                        attributes: ['id']
                    }).then((result) => {
                        let tabCommentId = [];
                        result.forEach(({ id }) => {
                            tabCommentId.push(id);
                        })
                        models.Commentlike.destroy({
                            where: { commentId: tabCommentId }
                        })
                    }).then(() => {
                        models.Commentlike.destroy({
                            where: { userId }
                        }).then(() => {
                            let commentLikeMessageIdTablike = [];
                            allCommentLikeFoundLike.forEach((element) => {
                                commentLikeMessageIdTablike.push(element.commentId);
                            });
                            models.Comment.decrement({ likes: 1 }, {
                                where: { id: commentLikeMessageIdTablike },
                            })
                        }).then(() => {
                            let commentLikeMessageIdTabDislike = [];
                            allCommentLikeFoundDislike.forEach((element) => {
                                commentLikeMessageIdTabDislike.push(element.commentId);
                            });
                            models.Comment.decrement({ dislikes: 1 }, {
                                where: { id: commentLikeMessageIdTabDislike },
                            })
                        }).then(() => {
                            done(null, userFound, userMessageComment, messageToDelete);
                        }).catch(err => {

                            return res.status(500).json({ 'error': 'unable to delet comments' });
                        });
                    })
                })
            },

            function (userFound, userMessageComment, messageToDelete, done) {
                models.Message.findAll({
                    where: { userId },
                    attributes: ['id']
                }).then((result) => {
                    let tabMessageId = [];
                    result.forEach(({ id }) => {
                        tabMessageId.push(id);
                    })
                    models.Comment.destroy({
                        where: { messageId: tabMessageId }
                    })
                }).then(() => {
                    if (userMessageComment) {
                        models.Message.findAll({
                            where: { id: userMessageComment }
                        })
                            .then(result => {
                                const finalTab = [];
                                const objectsEqual = (o1, o2) => {
                                    Object.keys(o1).map((elt, p) => {
                                        if (o1[p].messageId === o2[p]?.id) {
                                            o2[p].comments = o2[p].comments - o1[p].count;
                                            finalTab.push(o2[p]);
                                        }
                                    });
                                };
                                objectsEqual(messageToDelete, result);
                                userMessageComment.map((id, i) => {
                                    models.Message.update({ comments: finalTab[i].comments }, {
                                        where: { id },
                                    })
                                })
                            }).then(() => {
                                models.Comment.destroy({
                                    where: { userId }
                                })
                            }).then(() => {
                                done(null, userFound);
                            }).catch(err => {
                                return res.status(500).json({ 'error': 'unable to delet commentlikes' });
                            });
                    } else {
                        done(null, userFound);
                    }
                })
            },

            function (userFound, done) {
                models.Message.findAll({
                    where: { userId },
                }).then(result => {
                    const resultAttachment = result.filter(({ attachment }) => {
                        return attachment !== null
                    });
                    if (resultAttachment.length) {
                        const dynamiquePath = __dirname.split('controllers').shift();
                        const files = resultAttachment.map(message => message.attachment)
                        const deleteFiles = (files, callback) => {
                            let i = files.length;
                            files.forEach((filepath) => {

                                let fileName = filepath.split('http://localhost:4000/').pop()
                                fileName = dynamiquePath + fileName

                                fs.unlink(fileName, (err) => {
                                    i--;
                                    if (err) {
                                        callback(err); return;
                                    } else if (i <= 0) {
                                        callback(null);
                                    }
                                });
                            });
                        }
                        deleteFiles(files, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('all files removed');
                                models.Message.destroy({
                                    where: { userId }
                                }).then(() => {
                                    done(null, userFound)
                                }).catch(err => {
                                    return res.status(500).json({ 'error': 'unable to delet messages' });
                                });
                            }
                        });
                    } else {
                        models.Message.destroy({
                            where: { userId }
                        }).then(() => {
                            done(null, userFound)
                        }).catch(err => {
                            return res.status(500).json({ 'error': 'unable to delet messages' });
                        });
                    }
                })
            },

            function (userFound, done) {
                userFound.destroy({
                    where: { userId }
                }).then(() => {
                    return res.status(201).json('delete your account successfully');
                })
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
                        return res.status(500).json({ 'error': 'unable to verify user' })
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'unable to modify' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'unable to modify users account' });
            }
        })
    }
}