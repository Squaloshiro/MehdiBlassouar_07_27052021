// Imports
var models = require("../models");

const jwt = require("jsonwebtoken");
var asyncLib = require("async");

// Constants

// Routes
module.exports = {
  likePost: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "Paramètre invalide" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "vérification impossible" });
          });
      },
      function (messageFound, done) {
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
            });
        } else {
          return res.status(404).json({ error: "message introuvable" });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, messageFound, userFound, userAlreadyLikedFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "vérification impossible" });
            });
        } else {
          return res.status(404).json({ error: "cet utilisateur éxiste pas" });
        }
      },
      function (messageFound, userFound, userAlreadyLikedFound, done) {
        /*if (!userAlreadyLikedFound) {
                    messageFound.addUser(userFound, { userLike: true })*/
        if (!userAlreadyLikedFound) {
          models.Like.create({ userLike: true, userDislike: false, messageId, userId }),
            messageFound
              .update({
                likes: messageFound.likes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, messageFound, userFound);
                return res.status(201).json("like ajoutée" /*messageFound*/);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "une erreur est survenu" });
              });
        } else {
          if (!userAlreadyLikedFound.userLike && !userAlreadyLikedFound.userDislike) {
            userAlreadyLikedFound.update({
              userLike: true,
            }),
              messageFound
                .update({
                  likes: messageFound.likes + 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("like ajoutée" /*messageFound*/);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "une erreur est survenu" });
                });
          } else if (userAlreadyLikedFound.userLike === false && userAlreadyLikedFound.userDislike === true) {
            userAlreadyLikedFound.update({
              userDislike: false,
              userLike: true,
            }),
              messageFound
                .update({
                  likes: messageFound.likes + 1,
                  dislikes: messageFound.dislikes - 1, // = messageFound.dislikes -1
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("like ajoutée, dislike retirée" /*messageFound*/);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "une erreur est survenu" });
                });
          } else if (userAlreadyLikedFound.userLike === true && userAlreadyLikedFound.userDislike === false) {
            userAlreadyLikedFound.update({
              userLike: false,
            }),
              messageFound
                .update({
                  likes: messageFound.likes - 1, //=  messageFound.likes - 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("like retirée" /*messageFound*/);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: "une erreur est survenu" });
                });
          } else {
            return res.status(409).json({ error: "une erreur est survenu" });
          }
        }
      },
    ]);
  },
  dislikePost: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "paramètre invalid" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "vérification impossible" });
          });
      },
      function (messageFound, done) {
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
            });
        } else {
          res.status(404).json({ error: "message introuvable" });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, messageFound, userFound, userAlreadyLikedFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "une erreur est survenu" });
            });
        } else {
          res.status(404).json({ error: "utilisateur inéxistant" });
        }
      },
      function (messageFound, userFound, userAlreadyLikedFound, done) {
        if (!userAlreadyLikedFound) {
          models.Like.create({ userLike: false, userDislike: true, messageId, userId }),
            messageFound
              .update({
                dislikes: messageFound.dislikes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, messageFound, userFound);
                res.status(201).json("dislike ajoutée" /*messageFound*/);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "une erreur est survenu" });
              });
        } else {
          if (userAlreadyLikedFound.userLike === false && userAlreadyLikedFound.userDislike === false) {
            userAlreadyLikedFound.update({
              userDislike: true,
            }),
              messageFound
                .update({
                  dislikes: messageFound.dislikes + 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  res.status(201).json("dislike ajoutée" /*messageFound*/);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "une erreur est survenu" });
                });
          } else if (userAlreadyLikedFound.userLike === true && userAlreadyLikedFound.userDislike === false) {
            userAlreadyLikedFound.update({
              userDislike: true,
              userLike: false,
            }),
              messageFound
                .update({
                  dislikes: messageFound.dislikes + 1,
                  likes: messageFound.likes - 1, // = messageFound.likes -1
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  res.status(201).json("dislike ajoutée, like retirée" /*messageFound*/);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "une erreur est survenu" });
                });
          } else if (userAlreadyLikedFound.userLike === false && userAlreadyLikedFound.userDislike === true) {
            userAlreadyLikedFound.update({
              userDislike: false,
            }),
              messageFound
                .update({
                  dislikes: messageFound.dislikes - 1, // =  messageFound.dislikes - 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  res.status(201).json("dislike retirée" /*messageFound*/);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "une erreur est survenu" });
                });
          } else {
            res.status(409).json({ error: "une erreur est survenu" });
          }
        }
      },
    ]);
  },
};
