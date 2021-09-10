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
    var commentId = parseInt(req.params.commentId);

    if (commentId <= 0) {
      return res.status(400).json({ error: "Paramètre invalide" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Comment.findOne({
          where: { id: commentId },
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
          return res.status(404).json({ error: "commantaire introuvable" });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Commentlike.findOne({
            where: {
              userId: userId,
              commentId: commentId,
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
        if (!userAlreadyLikedFound) {
          models.Commentlike.create({ userLike: true, userDislike: false, commentId, userId }),
            messageFound
              .update({
                likes: messageFound.likes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, messageFound, userFound);
                return res.status(201).json("like ajoutée");
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
                  return res.status(201).json("like ajoutée");
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
                  dislikes: messageFound.dislikes - 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("dislike retirée, like ajouté");
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
                  likes: messageFound.likes - 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("like retirée");
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
    var commentId = parseInt(req.params.commentId);

    if (commentId <= 0) {
      return res.status(400).json({ error: "paramètre invalid" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Comment.findOne({
          where: { id: commentId },
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
          res.status(404).json({ error: "commentaire introuvable" });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Commentlike.findOne({
            where: {
              userId: userId,
              commentId: commentId,
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
          models.Commentlike.create({ userLike: false, userDislike: true, commentId, userId }),
            messageFound
              .update({
                dislikes: messageFound.dislikes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, messageFound, userFound);
                res.status(201).json("dislike ajoutée");
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
                  res.status(201).json("dislike ajoutée");
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
                  res.status(201).json("like retiré ,dislike ajouté");
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
                  res.status(201).json("dislike retirée");
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
