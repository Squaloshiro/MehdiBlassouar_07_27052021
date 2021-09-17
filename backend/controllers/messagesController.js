const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { userInfo } = require("os");
const moment = require("moment"); // pour formater les dates et heures
moment.locale("fr");

module.exports = {
  createMessageImage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    const TITLE_LIMIT = 0;

    // Params

    const formMessage = JSON.parse(req.body.message);
    const { title, content } = formMessage;

    if (title === "") {
      return res.status(400).json({ error: "paramaitre manquant" });
    }

    if (title.length < TITLE_LIMIT) {
      return res.status(400).json({ error: "invalid paramaitre" });
    }
    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Message.create({
              title: title,
              content: content,
              comments: 0,
              likes: 0,
              dislikes: 0,
              UserId: userFound.id,
              attachment: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;
          models.Message.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes: fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["lastName", "firstName", "avatar", "isAdmin"],
              },
            ],
          }).then(function (allMessageFound) {
            const allMessageFoundParsed = JSON.parse(JSON.stringify(allMessageFound));

            if (allMessageFound) {
              const messagesFormated = allMessageFoundParsed.map((element) => {
                const date = moment(element.createdAt).local().format("MMMM Do YYYY, h:mm:ss a");

                element.createdAt = date;
                const modifdate = moment(element.updatedAt).local().format("MMMM Do YYYY, h:mm:ss a");

                element.updatedAt = modifdate;
                return element;
              });

              return res.status(201).json(messagesFormated);
            }
          });
        } else {
          return res.status(500).json({ error: "impossible de poster ce message" });
        }
      }
    );
  },
  createMessage: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    const TITLE_LIMIT = 0;
    const CONTENT_LIMIT = 0;
    const ITEMS_LIMIT = 50;

    // Params
    var title = req.body.title;
    var content = req.body.content;

    if (title === "" || content === "") {
      return res.status(400).json({ error: "paramaitre manquant" });
    }

    if (title.length < TITLE_LIMIT || content.length < CONTENT_LIMIT) {
      return res.status(400).json({ error: "invalide paramaitre" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème utilisateur" });
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
              UserId: userFound.id,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;
          models.Message.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes: fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["lastName", "firstName", "avatar", "isAdmin"],
              },
            ],
          }).then(function (allMessageFound) {
            const allMessageFoundParsed = JSON.parse(JSON.stringify(allMessageFound));

            if (allMessageFound) {
              const messagesFormated = allMessageFoundParsed.map((element) => {
                const date = moment(element.createdAt).local().format("MMMM Do YYYY, h:mm:ss a");

                element.createdAt = date;
                const modifdate = moment(element.updatedAt).local().format("MMMM Do YYYY, h:mm:ss a");

                element.updatedAt = modifdate;
                return element;
              });

              return res.status(201).json(messagesFormated);
            }
          });
        } else {
          return res.status(500).json({ error: "impossible de poster ce message" });
        }
      }
    );
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
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["lastName", "firstName", "avatar", "isAdmin"],
        },
        {
          model: models.Like,
        },
      ],
    })
      .then(function (messages) {
        const messagesParsed = JSON.parse(JSON.stringify(messages));
        if (messages) {
          const messagesFormated = messagesParsed.map((element) => {
            const date = moment(element.createdAt).local().format("MMMM Do YYYY, h:mm:ss a");

            element.createdAt = date;
            const modifdate = moment(element.updatedAt).local().format("MMMM Do YYYY, h:mm:ss a");

            element.updatedAt = modifdate;
            return element;
          });

          res.status(200).json(messagesFormated);
        } else {
          res.status(404).json({ error: "message introuvable" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "une erreur est survenu" });
      });
  },
  listMessagesUser: function (req, res) {
    var userId = req.params.userId;
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
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["lastName", "firstName", "avatar", "isAdmin"],
        },
        {
          model: models.Like,
        },
      ],
    })
      .then(function (messages) {
        if (messages) {
          const allMessageFoundParsed = JSON.parse(JSON.stringify(messages));

          if (messages) {
            const messagesFormated = allMessageFoundParsed.map((element) => {
              const date = moment(element.createdAt).local().format("MMMM Do YYYY, h:mm:ss a");

              element.createdAt = date;
              const modifdate = moment(element.updatedAt).local().format("MMMM Do YYYY, h:mm:ss a");

              element.updatedAt = modifdate;
              return element;
            });

            return res.status(201).json(messagesFormated);
          }
        } else {
          res.status(404).json({ error: "message introuvable" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "une erreur est survenu" });
      });
  },

  getOneMessage: function (req, res, next) {
    models.Message.findByPk(req.params.id)
      .then(function (messages) {
        res.status(200).json(messages);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "ce message éxiste pas" });
      });
  },
  modifyMessage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let content = req.body.content;
    let title = req.body.title;

    let file = req.body.file;
    if (file === null && (title === "" || content === "")) {
      return res.status(500).json({ error: "Modification impossible" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.Message.findByPk(req.params.id)
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "vérification du message impossible" });
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
                return res.status(500).json({ error: "vérification utilisateur impossible" });
              });
          } else {
            return res.status(500).json({ error: "message introuvable" });
          }
        },
        function (messageFound, userFound, done) {
          models.Message.findOne({
            attributes: ["title", "content"],
            where: {
              id: req.params.id,
              UserId: userId,
            },
          })
            .then(function (message) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "message introuvable" });
            });
        },
        function (messageFound, userFound, done) {
          models.User.findOne({
            where: { isAdmin: true, id: userId },
          })
            .then(function (userAdminfound) {
              done(null, messageFound, userFound, userAdminfound);
            })
            .catch(function (err) {
              res.status(500).json({ error: "admin introuvable" });
            });
        },
        function (messageFound, userFound, userAdminfound, done) {
          if (messageFound) {
            if (messageFound.UserId === userFound.id || (userAdminfound.isAdmin && userAdminfound.id === userId)) {
              messageFound
                .update({
                  content: content,
                  title: title ? title : messageFound.title,
                })
                .then(function (newMessage) {
                  done(newMessage);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "mofification impossible" });
                });
            } else {
              res.status(500).json({ error: "une erreur et survenu" });
            }
          } else {
            res.status(404).json({ error: "message introuvable" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;
          models.Message.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes: fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["lastName", "firstName", "avatar", "isAdmin"],
              },
            ],
          }).then(function (allMessageFound) {
            const allMessageFoundParsed = JSON.parse(JSON.stringify(allMessageFound));

            if (allMessageFound) {
              const messagesFormated = allMessageFoundParsed.map((element) => {
                const date = moment(element.createdAt).local().format("MMMM Do YYYY, h:mm:ss a");

                element.createdAt = date;
                const modifdate = moment(element.updatedAt).local().format("MMMM Do YYYY, h:mm:ss a");

                element.updatedAt = modifdate;
                return element;
              });

              return res.status(201).json(messagesFormated);
            }
          });
        } else {
          return res.status(500).json({ error: "publication impossible" });
        }
      }
    );
  },
  deleteOneMessage: function (req, res) {
    //Params
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    var messageId = req.params.id;

    asyncLib.waterfall([
      function (done) {
        models.Comment.findAll({
          where: { messageId },
          attributes: ["id"],
        })
          .then(function (commentsFound) {
            let commentIds = [];

            commentsFound.map(({ id }) => {
              commentIds.push(id);
            });
            done(null, commentIds);
          })
          .catch(function (err) {
            res.status(500).json({ error: "vérification impossible" });
          });
      },
      function (commentIds, done) {
        models.Commentlike.destroy({
          where: { commentId: commentIds },
        })
          .then(function () {
            done(null);
          })
          .catch(function (err) {
            res.status(500).json({ error: "supréssion impossible" });
          });
      },
      function (done) {
        models.Comment.destroy({
          where: { messageId: messageId },
        })
          .then(() => {
            models.Like.destroy({
              where: { messageId: messageId },
            });
            done(null);
          })
          .catch((err) => {
            return res.status(500).json({ error: "une erreur est survenu" });
          });
      },
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            res.status(500).json({ error: "vérification impossible" });
          });
      },
      function (messageFound, done) {
        models.User.findOne({
          where: { isAdmin: true, id: userId },
        })
          .then(function (userAdminfound) {
            done(null, messageFound, userAdminfound);
          })
          .catch(function (err) {
            res.status(500).json({ error: "admin non trouvé" });
          });
      },
      function (messageFound, userAdminfound, done) {
        if (messageFound.UserId === userId || (userAdminfound.isAdmin === true && userAdminfound.id === userId)) {
          if (messageFound.attachment === null) {
            messageFound
              .destroy({
                where: { id: messageId },
              })
              .then(function (destroyMessageFound) {
                return res.status(201).json(destroyMessageFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "suppression impossible" });
              });
          } else {
            const filename = messageFound.attachment.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              models.Message.destroy({
                where: { id: messageId },
              })
                .then(function (destroyMessageFoundImg) {
                  return res.status(201).json(destroyMessageFoundImg);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "suppression impossible" });
                });
            });
          }
        } else return res.status(500).json({ error: "une erreur est survenu" });
      },
    ]);
  },
};
