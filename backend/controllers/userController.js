//imports

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const asyncLib = require("async");
const fs = require("fs");

const email_regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
const regexCharacter = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*[ ]?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
const regexCharacter1 = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*-?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
//Controller
module.exports = {
  register: function (req, res) {
    //Params
    let { email, lastName, firstName, password, confirmePassword, bio } = req.body;

    let avatar = "/static/media/1.a2541ca9.jpg";

    if (!email || !lastName || !firstName || !password) {
      return res.status(400).json({ error: "paramaitre manquant" });
    }

    if (!regexCharacter.test(lastName) && !regexCharacter1.test(lastName)) {
      return res.status(400).json({ error: " 1doit pas contenir des caractères spéciaux est des nombres" });
    }

    if (!regexCharacter.test(firstName) && !regexCharacter1.test(firstName)) {
      return res.status(400).json({ error: "ne doit pas contenir des caractères spéciaux est des nombres" });
    }
    if (lastName.length >= 13 || lastName.length < 0) {
      return res.status(400).json({ error: "le nom doit être compris entre 1 et 12 lettres" });
    }
    if (firstName.length >= 13 || firstName.length < 0) {
      return res.status(400).json({ error: "le prénom doit être compris entre 1 et 12 lettres" });
    }

    if (!email_regex.test(email)) {
      return res.status(400).json({ error: "email invalide" });
    }
    const endOfEmail = email.split("@");

    if (endOfEmail[1] !== "groupomania.com") {
      return res.status(400).json({ error: "votre email doit terminer par @groupomania.com" });
    }

    if (!password_regex.test(password)) {
      return res.status(400).json({
        error:
          "mot de passe non valide, 8 caractères minimum, contenant au moins une lettre minuscule, une lettre majuscule, un chiffre numérique et un caractère spécial",
      });
    }
    if (confirmePassword !== password) {
      return res.status(400).json({ error: "vous n'avez pas saisie les mêmes mots de passe" });
    }
    email = email.trim();
    lastName = lastName.trim();
    firstName = firstName.trim();
    confirmePassword = confirmePassword.trim();
    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
            });
        },
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptePassword) {
              done(null, userFound, bcryptePassword);
            });
          } else {
            return res.status(409).json({ error: "email déjà éxistant" });
          }
        },

        function (userFound, bcryptePassword, done) {
          models.User.findOne({
            attributes: ["lastName"],
            where: { lastName },
          })
            .then(function (lastNameFound) {
              done(null, userFound, bcryptePassword, lastNameFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
            });
        },
        function (userFound, bcryptePassword, lastNameFound, done) {
          models.User.findOne({
            attributes: ["firstName"],
            where: { firstName },
          })
            .then(function (firstNameFound) {
              done(null, userFound, bcryptePassword, lastNameFound, firstNameFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
            });
        },
        /*function (userFound, bcryptePassword, lastNameFound, firstNameFound, done) {
          if (!lastNameFound) {
            done(null, userFound, bcryptePassword, lastNameFound, firstNameFound);
          } else {
            return res.status(409).json({ error: "user allready existing" });
          }
        },*/
        function (userFound, bcryptePassword, lastNameFound, firstNameFound, done) {
          let newUser = models.User.create({
            email: email,
            lastName: lastName,
            firstName: firstName,
            password: bcryptePassword,
            bio: bio,
            avatar: avatar,
            isAdmin: false,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenue lors de la création du compte" });
            });
        },
      ],
      function (newUser) {
        if (newUser) {
          return res.status(200).json({ succes: "compte créé" });
          /* return res.status(200).json({
            token: jwt.sign(
              {
                userId: newUser.id,
                isAdmin: newUser.isAdmin,
              },
              process.env.TOKEN,
              { expiresIn: "24h" }
            ),
          });*/
        } else {
          return res.status(500).json({ error: "Problème utilisateur" });
        }
      }
    );
  },

  login: function (req, res) {
    //params
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "paramaitre manquant" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "impossible de vérifier l'email" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
              done(null, userFound, resBycrypt);
            });
          } else {
            return res.status(404).json({ error: "Email ou mot de passe incorect" });
          }
        },
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "Email ou mot de passe incorect" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(200).json({
            token: jwt.sign(
              {
                userId: userFound.id,
                isAdmin: userFound.isAdmin,
              },
              process.env.TOKEN,
              { expiresIn: "24h" }
            ),
          });
        } else {
          return res.status(500).json({ error: "Vérifier vos information de connexion" });
        }
      }
    );
  },
  getUserProfile: function (req, res) {
    //let userId = req.body.userId
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    models.User.findOne({
      attributes: ["id", "email", "lastName", "firstName", "bio", "avatar", "isAdmin"],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "Problème utilisateur" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "impossible de récupérer l'utilisateur" });
      });
  },
  getAllUserProfile: function (req, res) {
    //let userId = req.body.userId
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const ITEMS_LIMIT = 50;
    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.User.findAll({
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: ["id", "email", "lastName", "firstName", "avatar", "isAdmin"],
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "Problème utilisateur" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "impossible de récupérer l'utilisateur" });
      });
  },
  getUserData: function (req, res) {
    models.User.findByPk(req.params.id, { attributes: ["lastName", "firstName", "email", "bio", "avatar", "isAdmin"] })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "Problème utilisateur" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "impossible de récupérer l'utilisateur" });
      });
  },
  deleteUserProfile: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    // Params
    models.User.findByPk(req.params.id).then(function (userFound) {
      models.User.findAndCountAll({
        where: { isAdmin: true },
      }).then((allUserAdmin) => {
        if (userFound.isAdmin && allUserAdmin.count < 2) {
          return res.status(400).json({ error: "Donner les droits d'accès" });
        } else {
          asyncLib.waterfall([
            function (done) {
              models.User.findByPk(req.params.id)
                .then(function (userFound) {
                  done(null, userFound);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de récupérer l'utilisateur" });
                });
            },
            function (userFound, done) {
              models.User.findOne({
                where: { isAdmin: true, id: userId },
              })
                .then(function (userAdminFound) {
                  done(null, userFound, userAdminFound);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de récupérer l'utilisateur" });
                });
            },
            function (userFound, userAdminFound, done) {
              models.Message.findAll({
                attributes: ["id", "attachment", "likes", "dislikes", "comments"],
              })
                .then((allMessageFound) => {
                  let messageIdTab = [];
                  allMessageFound.forEach((element) => {
                    messageIdTab.push(element.id);
                  });
                  done(null, userFound, userAdminFound, messageIdTab);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de vérifier tous les messages" });
                });
            },

            function (userFound, userAdminFound, messageIdTab, done) {
              models.Like.findAll({
                where: { userId: userFound.id, userDislike: true },
                attributes: ["messageId"],
              })
                .then(function (allLikeFoundDislike) {
                  done(null, userFound, userAdminFound, messageIdTab, allLikeFoundDislike);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de vérifier tous les dislikes" });
                });
            },

            function (userFound, userAdminFound, messageIdTab, allLikeFoundDislike, done) {
              models.Like.findAll({
                where: { userId: userFound.id, userLike: true },
                attributes: ["messageId"],
              })
                .then(function (allLikeFoundLike) {
                  done(null, userFound, userAdminFound, messageIdTab, allLikeFoundDislike, allLikeFoundLike);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de vérifier tous les likes" });
                });
            },

            function (userFound, userAdminFound, messageIdTab, allLikeFoundDislike, allLikeFoundLike, done) {
              models.Comment.findAll({
                where: { userId: userFound.id, messageId: messageIdTab },
                attributes: ["id", "messageId"],
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
                    a.messageId < b.messageId ? 1 : b.messageId < a.messageId ? -1 : 0
                  );
                  const userMessageComment =
                    abc.length > 0
                      ? abc
                          .map((item) => item.messageId)
                          .filter((elt, i, a) => a.indexOf(elt) === i)
                          .sort((a, b) => a - b)
                      : [];
                  done(
                    null,
                    userFound,
                    userAdminFound,
                    allLikeFoundDislike,
                    allLikeFoundLike,
                    messageToDelete,
                    userMessageComment
                  );
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de vérifier tous les commentaires" });
                });
            },

            function (
              userFound,
              userAdminFound,
              allLikeFoundDislike,
              allLikeFoundLike,
              messageToDelete,
              userMessageComment,
              done
            ) {
              models.Commentlike.findAll({
                where: { userId: userFound.id, userLike: true },
                attributes: ["commentId"],
              })
                .then(function (allCommentLikeFoundLike) {
                  done(
                    null,
                    userFound,
                    userAdminFound,
                    allLikeFoundDislike,
                    allLikeFoundLike,
                    allCommentLikeFoundLike,
                    messageToDelete,
                    userMessageComment
                  );
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de vérifier tous les likes" });
                });
            },

            function (
              userFound,
              userAdminFound,
              allLikeFoundDislike,
              allLikeFoundLike,
              allCommentLikeFoundLike,
              messageToDelete,
              userMessageComment,
              done
            ) {
              models.Commentlike.findAll({
                where: { userId: userFound.id, userDislike: true },
                attributes: ["commentId"],
              })
                .then(function (allCommentLikeFoundDislike) {
                  done(
                    null,
                    userFound,
                    userAdminFound,
                    allLikeFoundDislike,
                    allLikeFoundLike,
                    allCommentLikeFoundLike,
                    allCommentLikeFoundDislike,
                    messageToDelete,
                    userMessageComment
                  );
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "impossible de vérifier tous les dislikes" });
                });
            },
            function (
              userFound,
              userAdminFound,
              allLikeFoundDislike,
              allLikeFoundLike,
              allCommentLikeFoundLike,
              allCommentLikeFoundDislike,
              messageToDelete,
              userMessageComment,
              done
            ) {
              if (userFound.id === userId || (userAdminFound.isAdmin === true && userAdminFound.id === userId)) {
                models.Message.findAll({
                  where: { userId: userFound.id },
                  attributes: ["id"],
                })
                  .then((result) => {
                    let tabMessageId = [];
                    result.forEach(({ id }) => {
                      tabMessageId.push(id);
                    });
                    models.Like.destroy({
                      where: { messageId: tabMessageId },
                    });
                  })
                  .then(() => {
                    models.Like.destroy({
                      where: { userId: userFound.id },
                    })
                      .then((result) => {
                        let likeMessageIdTabDislike = [];
                        allLikeFoundDislike.forEach((element) => {
                          likeMessageIdTabDislike.push(element.messageId);
                        });
                        models.Message.decrement(
                          { dislikes: 1 },
                          {
                            where: { id: likeMessageIdTabDislike },
                          }
                        );
                      })
                      .then((result) => {
                        let likeMessageIdTabLike = [];
                        allLikeFoundLike.forEach((element) => {
                          likeMessageIdTabLike.push(element.messageId);
                        });
                        models.Message.decrement(
                          { likes: 1 },
                          {
                            where: { id: likeMessageIdTabLike },
                          }
                        );
                      })
                      .then(function () {
                        done(
                          null,
                          userFound,
                          userAdminFound,
                          allCommentLikeFoundLike,
                          allCommentLikeFoundDislike,
                          userMessageComment,
                          messageToDelete
                        );
                      })
                      .catch((err) => {
                        return res.status(500).json({ error: "impossible de supprimer les likes" });
                      });
                  });
              } else {
                return res.status(500).json({ error: "vous avez pas la permission" });
              }
            },

            function (
              userFound,
              userAdminFound,
              allCommentLikeFoundLike,
              allCommentLikeFoundDislike,
              userMessageComment,
              messageToDelete,
              done
            ) {
              if (userFound.id === userId || (userAdminFound.isAdmin === true && userAdminFound.id === userId)) {
                models.Message.findAll({
                  where: { userId: userFound.id },
                  attributes: ["id"],
                })
                  .then((result) => {
                    let tabMessageId = [];
                    result.forEach(({ id }) => {
                      tabMessageId.push(id);
                    });
                    return tabMessageId;
                  })
                  .then((tabMessageId) => {
                    models.Comment.findAll({
                      where: { messageId: tabMessageId },
                      attributes: ["id"],
                    })
                      .then((result) => {
                        let tabCommentId = [];
                        result.forEach(({ id }) => {
                          tabCommentId.push(id);
                        });
                        models.Commentlike.destroy({
                          where: { commentId: tabCommentId },
                        });
                      })
                      .then(() => {
                        models.Commentlike.destroy({
                          where: { userId: userFound.id },
                        })
                          .then(() => {
                            let commentLikeMessageIdTablike = [];
                            allCommentLikeFoundLike.forEach((element) => {
                              commentLikeMessageIdTablike.push(element.commentId);
                            });
                            models.Comment.decrement(
                              { likes: 1 },
                              {
                                where: { id: commentLikeMessageIdTablike },
                              }
                            );
                          })
                          .then(() => {
                            let commentLikeMessageIdTabDislike = [];
                            allCommentLikeFoundDislike.forEach((element) => {
                              commentLikeMessageIdTabDislike.push(element.commentId);
                            });
                            models.Comment.decrement(
                              { dislikes: 1 },
                              {
                                where: { id: commentLikeMessageIdTabDislike },
                              }
                            );
                          })
                          .then(() => {
                            done(null, userFound, userAdminFound, userMessageComment, messageToDelete);
                          })
                          .catch((err) => {
                            return res.status(500).json({ error: "impossible de supprimer les commantaire" });
                          });
                      });
                  });
              } else {
                return res.status(500).json({ error: "vous avez pas la permission" });
              }
            },

            function (userFound, userAdminFound, userMessageComment, messageToDelete, done) {
              if (userFound.id === userId || (userAdminFound.isAdmin === true && userAdminFound.id === userId)) {
                models.Message.findAll({
                  where: { userId: userFound.id },
                  attributes: ["id"],
                })
                  .then((result) => {
                    let tabMessageId = [];
                    result.forEach(({ id }) => {
                      tabMessageId.push(id);
                    });
                    models.Comment.destroy({
                      where: { messageId: tabMessageId },
                    });
                  })
                  .then(() => {
                    if (userMessageComment) {
                      models.Message.findAll({
                        where: { id: userMessageComment },
                      })
                        .then((result) => {
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
                            models.Message.update(
                              { comments: finalTab[i].comments },
                              {
                                where: { id },
                              }
                            );
                          });
                        })
                        .then(() => {
                          models.Comment.destroy({
                            where: { userId: userFound.id },
                          });
                        })
                        .then(() => {
                          done(null, userFound, userAdminFound);
                        })
                        .catch((err) => {
                          return res.status(500).json({ error: "impossible de supprimer les likes des commentaires" });
                        });
                    } else {
                      done(null, userFound);
                    }
                  });
              } else {
                return res.status(500).json({ error: "vous avez pas la permission" });
              }
            },

            function (userFound, userAdminFound, done) {
              if (userFound.id === userId || (userAdminFound.isAdmin === true && userAdminFound.id === userId)) {
                models.Message.findAll({
                  where: { userId: userFound.id },
                }).then((result) => {
                  const resultAttachment = result.filter(({ attachment }) => {
                    return attachment !== null;
                  });
                  if (resultAttachment.length) {
                    const dynamiquePath = __dirname.split("controllers").shift();
                    const files = resultAttachment.map((message) => message.attachment);
                    const deleteFiles = (files, callback) => {
                      let i = files.length;
                      files.forEach((filepath) => {
                        let fileName = filepath.split("http://localhost:4000/").pop();
                        fileName = dynamiquePath + fileName;

                        fs.unlink(fileName, (err) => {
                          i--;
                          if (err) {
                            callback(err);
                            return;
                          } else if (i <= 0) {
                            callback(null);
                          }
                        });
                      });
                    };
                    deleteFiles(files, (err) => {
                      if (err) {
                        console.log(err);
                      } else {
                        models.Message.destroy({
                          where: { userId: userFound.id },
                        })
                          .then(() => {
                            done(null, userFound, userAdminFound);
                          })
                          .catch((err) => {
                            return res.status(500).json({ error: "une erreur est survenue lors de la suppréssion" });
                          });
                      }
                    });
                  } else {
                    models.Message.destroy({
                      where: { userId: userFound.id },
                    })
                      .then(() => {
                        done(null, userFound, userAdminFound);
                      })
                      .catch((err) => {
                        return res.status(500).json({ error: "une erreur est survenue lors de la suppréssion" });
                      });
                  }
                });
              } else {
                return res.status(500).json({ error: "vous avez pas la permission" });
              }
            },

            function (userFound, userAdminFound, done) {
              if (userFound.id === userId || (userAdminFound.isAdmin === true && userAdminFound.id === userId)) {
                userFound
                  .destroy({
                    where: { userId: userFound.id },
                  })
                  .then(() => {
                    return res.status(201).json("compte supprimer");
                  });
              } else {
                return res.status(500).json({ error: "vous avez pas la permission" });
              }
            },
          ]);
        }
      });
    });
  },
  updateUserProfile: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let { bio, avatar } = req.body;
    if (bio) {
      bio = bio.trim();
    }
    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            //attributes: ["id", "bio"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },

        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                bio: bio ? bio : userFound.bio,
                avatar: avatar ? avatar : userFound.avatar,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "une erreur est survenue lors de la modification" });
              });
          } else {
            res.status(404).json({ error: "une erreur est survenu" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "une erreur est survenue lors de la modification de votre compte" });
        }
      }
    );
  },

  updateFirstNameProfile: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let { firstName } = req.body;
    const regexCharacter = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*[ ]?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
    const regexCharacter1 = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*-?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
    if (!regexCharacter.test(firstName) && !regexCharacter1.test(firstName)) {
      return res.status(400).json({ error: "ne doit pas contenir des caractères spéciaux est des nombres" });
    }
    firstName = firstName.trim();
    if (firstName.length >= 13 || firstName.length < 0) {
      return res.status(400).json({ error: "le prénom doit être compris entre 1 et 12 lettres" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            //attributes: ["id", "bio"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },
        function (userFound, done) {
          models.User.findOne({
            attributes: ["firstName", "id"],
            where: { firstName },
          })
            .then(function () {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },
        /* function (userFound, userFirstNameFound, done) {
          if (!userFirstNameFound || (userFirstNameFound && userFirstNameFound.id === userId)) {
            done(null, userFound);
          } else {
            return res.status(409).json({ error: "user allready existing" });
          }
        },*/
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                firstName: firstName ? firstName : userFound.firstName,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "une erreur est survenu lors de la modification" });
              });
          } else {
            res.status(404).json({ error: "une erreur est survenu" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "une erreur est survenu lors de la modification du compte" });
        }
      }
    );
  },
  updateLastNameProfile: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let { lastName } = req.body;
    const regexCharacter = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*[ ]?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
    const regexCharacter1 = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*-?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
    if (!regexCharacter.test(lastName) && !regexCharacter1.test(lastName)) {
      return res.status(400).json({ error: "ne doit pas contenir des caractères spéciaux est des nombres" });
    }
    lastName = lastName.trim();
    if (lastName.length >= 13 || lastName.length < 0) {
      return res.status(400).json({ error: "le nom doit être compris entre 30000 et 12 lettres" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            //attributes: ["id", "bio"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },
        function (userFound, done) {
          models.User.findOne({
            attributes: ["lastName", "id"],
            where: { lastName },
          })
            .then(function () {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },
        /*function (userFound, userLastNameFound, done) {
          if (!userLastNameFound || (userLastNameFound && userLastNameFound.id === userId)) {
            done(null, userFound);
          } else {
            return res.status(409).json({ error: "user allready existing" });
          }
        },*/
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                lastName: lastName ? lastName : userFound.lastName,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "une erreur est survenu lors de la modification" });
              });
          } else {
            res.status(404).json({ error: "une erreur est survenu" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "une erreur est survenu lors de la modification de votre compte" });
        }
      }
    );
  },

  updateEmail: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let { email } = req.body;
    email = email.trim();
    if (!email) {
      return res.status(400).json({ error: "paramètre manquant" });
    }

    if (!email_regex.test(email)) {
      return res.status(400).json({ error: "email invalid" });
    }
    const endOfEmail = email.split("@");

    if (endOfEmail[1] !== "groupomania.com") {
      return res.status(400).json({ error: "votre email doit terminer par @groupomania.com" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            //attributes: ["id", "bio"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "impossible de vérifier vos information" });
            });
        },
        function (userFound, done) {
          models.User.findOne({
            attributes: ["email", "id"],
            where: { email },
          })
            .then(function (emailFound) {
              done(null, userFound, emailFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "impossible de vérifier vos information" });
            });
        },
        function (userFound, emailFound, done) {
          if (!emailFound || (emailFound && emailFound.id === userId)) {
            done(null, userFound);
          } else {
            return res.status(409).json({ error: "email déjà éxistant" });
          }
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                email: email ? email : userFound.email,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "une erreur est survenu" });
              });
          } else {
            res.status(404).json({ error: "une erreur est survenu" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "une erreur est survenu lors de la modification du compte" });
        }
      }
    );
  },

  updateUserPassword: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if (!password_regex.test(newPassword)) {
      return res.status(400).json({
        error:
          "mot de passe non valide, 8 caractères minimum, contenant au moins une lettre minuscule, une lettre majuscule, un chiffre numérique et un caractère spécial",
      });
    }

    asyncLib.waterfall([
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "une erreur est survenu" });
          });
      },
      function (userFound, done) {
        if (userFound) {
          bcrypt.compare(oldPassword, userFound.password, function (errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ error: "utilisateur introuvable" });
        }
      },
      function (userFound, resBycrypt, done) {
        if (resBycrypt) {
          bcrypt.hash(newPassword, 5, function (err, bcryptePassword) {
            done(null, userFound, bcryptePassword);
          });
        } else {
          return res.status(404).json({ error: "utilisateur introuvable" });
        }
      },
      function (userFound, bcryptePassword, done) {
        if (userFound) {
          userFound
            .update({
              password: bcryptePassword,
            })
            .then(function (newUser) {
              return res.status(201).json(newUser);
            });
        } else {
        }
      },
    ]);
  },
  updateUserAdmin: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    let avatar1 = "/static/media/1.a2541ca9.jpg";
    let avatar2 = "/static/media/39.9c2365c2.jpg";
    asyncLib.waterfall(
      [
        function (done) {
          models.User.findByPk(req.params.id)
            .then(function (userfound) {
              done(null, userfound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },
        function (userfound, done) {
          models.User.findOne({
            where: { isAdmin: true, id: userId },
          })
            .then(function (userAdminFound) {
              done(null, userfound, userAdminFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        },

        function (userfound, userAdminFound, done) {
          if (userAdminFound.isAdmin === true && userAdminFound.id === userId) {
            if (userfound.isAdmin === false) {
              userfound
                .update({
                  isAdmin: true,
                  avatar: avatar2,
                })
                .then(function (newUserAdmin) {
                  return res.status(201).json(newUserAdmin);
                });
            } else if (userfound.isAdmin === true) {
              userfound
                .update({
                  isAdmin: false,
                  avatar: avatar1,
                })
                .then(function (newUserAdmin) {
                  return res.status(201).json(newUserAdmin);
                });
            }
          } else {
            return res.status(500).json({ error: "vous n'avez pas la permission" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "une erreur est survenu lors de la suppression du compte" });
        }
      }
    );
  },
};
