const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const moment = require("moment"); // pour formater les dates et heures
moment.locale("fr");

module.exports = {
  createcomment: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Params

    var content = req.body.content;
    var messageId = parseInt(req.params.messageId);

    if (content === "") {
      return res.status(400).json({ error: "missing parameters" });
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
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Message.findOne({
              where: { id: messageId },
            })
              .then(function (messageFound) {
                done(null, messageFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify message" });
              });
          } else {
            return res.status(404).json({ error: "user not exist" });
          }
        },
        function (messageFound, userFound, done) {
          if (messageFound) {
            models.Comment.create({
              content: content,
              likes: 0,
              dislikes: 0,
              UserId: userFound.id,
              MessageId: messageFound.id,
            }),
              messageFound
                .update({
                  comments: messageFound.comments + 1,
                })
                .then(function (newComment) {
                  done(newComment);
                });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (newComment) {
        if (newComment) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;
          models.Comment.findAll({
            where: { messageId: messageId },
            order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
            attributes: fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["username", "avatar", "isAdmin"],
              },
            ],
          }).then(function (allCommentFound) {
            const allCommentFoundParsed = JSON.parse(JSON.stringify(allCommentFound));

            if (allCommentFound) {
              const commentsFormated = allCommentFoundParsed.map((element) => {
                const date = moment(element.createdAt).local().format("LL");
                const hour = moment(element.createdAt).local().format("LT");
                element.createdAt = `${date} à ${hour}`;
                const modifdate = moment(element.updatedAt).local().format("LL");
                const modifhour = moment(element.updatedAt).local().format("LT");
                element.updatedAt = `${modifdate} à ${modifhour}`;
                return element;
              });

              return res.status(201).json(commentsFormated);
            }
          });
        } else {
          return res.status(500).json({ error: "cannot post comment" });
        }
      }
    );
  },
  listComments: function (req, res) {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const ITEMS_LIMIT = 50;
    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Comment.findAll({
      order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["username", "avatar", "isAdmin"],
        },
        {
          model: models.Commentlike,
        },
      ],
    })
      .then(function (comment) {
        const allCommentFoundParsed = JSON.parse(JSON.stringify(comment));

        if (comment) {
          const commentsFormated = allCommentFoundParsed.map((element) => {
            const date = moment(element.createdAt).local().format("LL");
            const hour = moment(element.createdAt).local().format("LT");
            element.createdAt = `${date} à ${hour}`;
            const modifdate = moment(element.updatedAt).local().format("LL");
            const modifhour = moment(element.updatedAt).local().format("LT");
            element.updatedAt = `${modifdate} à ${modifhour}`;
            return element;
          });

          return res.status(201).json(commentsFormated);
        } else {
          res.status(404).json({ error: "no messages found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },
  listCommentsUser: function (req, res) {
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

    models.Comment.findAll({
      where: { UserId: userId },
      order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["username", "isAdmin"],
        },
        {
          model: models.Commentlike,
        },
      ],
    })
      .then(function (messages) {
        if (messages) {
          res.status(200).json(messages);
        } else {
          res.status(404).json({ error: "no messages found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },
  listCommentsMessage: function (req, res) {
    var messageId = parseInt(req.params.messageId);
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const ITEMS_LIMIT = 50;
    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }
    asyncLib.waterfall([
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then((messageFound) => {
            done(null, messageFound);
          })
          .catch((err) => {
            return res.status(404).json({ error: "no messages found" });
          });
      },
      function (messageFound, done) {
        models.Comment.findAll({
          where: { messageId: messageId },
          order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
          attributes: fields !== "*" && fields != null ? fields.split(",") : null,
          limit: !isNaN(limit) ? limit : null,
          offset: !isNaN(offset) ? offset : null,
          include: [
            {
              model: models.User,
              attributes: ["username", "avatar", "isAdmin"],
            },
            {
              model: models.Commentlike,
            },
          ],
        })
          .then(function (comment) {
            const allCommentFoundParsed = JSON.parse(JSON.stringify(comment));

            if (comment) {
              const commentsFormated = allCommentFoundParsed.map((element) => {
                const date = moment(element.createdAt).local().format("LL");
                const hour = moment(element.createdAt).local().format("LT");
                element.createdAt = `${date} à ${hour}`;
                const modifdate = moment(element.updatedAt).local().format("LL");
                const modifhour = moment(element.updatedAt).local().format("LT");
                element.updatedAt = `${modifdate} à ${modifhour}`;
                return element;
              });

              return res.status(201).json(commentsFormated);
            } else {
              res.status(404).json({ error: "no messages found" });
            }
          })
          .catch(function (err) {
            console.log(err);
            res.status(500).json({ error: "invalid fields" });
          });
      },
    ]);
  },
  getOneComment: function (req, res) {
    models.Comment.findByPk(req.params.id)
      .then(function (messages) {
        res.status(200).json(messages);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "this comment does not exist" });
      });
  },
  modifyComment: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let content = req.body.content;

    asyncLib.waterfall(
      [
        function (done) {
          models.Comment.findByPk(req.params.id)
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify comment" });
            });
        },
        function (messageFound, done) {
          models.Message.findOne({
            where: { id: messageFound.messageId },
          })
            .then((publicFound) => {
              done(null, messageFound, publicFound);
            })
            .catch((err) => {
              return res.status(404).json({ error: "no messages found" });
            });
        },
        function (messageFound, publicFound, done) {
          if (messageFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, messageFound, publicFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unableto verify user" });
              });
          } else {
            return res.status(500).json({ error: "this message does not exist" });
          }
        },
        function (messageFound, publicFound, userFound, done) {
          models.Comment.findOne({
            attributes: ["content"],
            where: {
              id: req.params.id,
              UserId: userId,
            },
          })
            .then(function () {
              done(null, messageFound, publicFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify this message" });
            });
        },
        function (messageFound, publicFound, userFound, done) {
          models.User.findOne({
            where: { isAdmin: true, id: userId },
          })
            .then(function (userAdminfound) {
              done(null, messageFound, publicFound, userFound, userAdminfound);
            })
            .catch(function (err) {
              res.status(500).json({ error: "admin not found" });
            });
        },
        function (messageFound, publicFound, userFound, userAdminfound, done) {
          if (messageFound) {
            if (messageFound.UserId === userFound.id || (userAdminfound.isAdmin && userAdminfound.id === userId)) {
              messageFound
                .update({
                  content: content ? content : messageFound.content,
                })
                .then(function (newMessage) {
                  done(publicFound, newMessage);
                })
                .catch(function (err) {
                  console.log("--------------err----------------------");
                  console.log(err);
                  console.log("------------------------------------");
                  res.status(500).json({ error: "unable to update" });
                });
            } else {
              res.status(500).json({ error: "this comment does not belong to you" });
            }
          } else {
            res.status(404).json({ error: "this comment not found" });
          }
        },
      ],
      function (publicFound, newMessage) {
        if (newMessage) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;

          models.Comment.findAll({
            where: { messageId: publicFound.id },
            order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
            attributes: fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["username", "avatar", "isAdmin"],
              },
            ],
          }).then(function (comment) {
            const allCommentFoundParsed = JSON.parse(JSON.stringify(comment));

            if (comment) {
              const commentsFormated = allCommentFoundParsed.map((element) => {
                const date = moment(element.createdAt).local().format("LL");
                const hour = moment(element.createdAt).local().format("LT");
                element.createdAt = `${date} à ${hour}`;
                const modifdate = moment(element.updatedAt).local().format("LL");
                const modifhour = moment(element.updatedAt).local().format("LT");
                element.updatedAt = `${modifdate} à ${modifhour}`;
                return element;
              });

              return res.status(201).json(commentsFormated);
            }
          });
        } else {
          return res.status(500).json({ error: "unable to update this comment" });
        }
      }
    );
  },
  deleteOneComment: function (req, res) {
    // var messageId = req.params.id
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Params

    let messageId = parseInt(req.params.messageId);
    let commentId = parseInt(req.params.id);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
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
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (messageFound, done) {
        models.Comment.findOne({
          where: { id: commentId },
        })
          .then(function (commentFound) {
            done(null, messageFound, commentFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify comment" });
          });
      },
      function (messageFound, commentFound, done) {
        models.User.findOne({
          where: { isAdmin: true, id: userId },
        })
          .then(function (userFound) {
            done(null, messageFound, commentFound, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      function (messageFound, commentFound, userFound, done) {
        if (commentFound) {
          models.Comment.findOne({
            where: {
              id: commentId,
              messageId: messageId,
            },
          })
            .then(function (commentFound) {
              done(null, messageFound, commentFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify comment and user" });
            });
        } else {
          return res.status(500).json({ error: "this comment does not exist" });
        }
      },
      function (messageFound, commentFound, userFound, done) {
        models.Commentlike.findAll({
          where: { commentId },
          attributes: ["id"],
        })
          .then(function (commentlikefound) {
            let commentLikeIds = [];

            commentlikefound.map(({ id }) => {
              commentLikeIds.push(id);
            });

            done(null, messageFound, commentFound, userFound, commentLikeIds);
          })
          .catch(function (err) {
            res.status(500).json({ error: "unable to delet comment likes" });
          });
      },
      function (messageFound, commentFound, userFound, commentLikeIds, done) {
        models.Commentlike.destroy({
          where: { id: commentLikeIds },
        })
          .then(function () {
            done(null, messageFound, commentFound, userFound);
          })
          .catch(function (err) {
            res.status(500).json({ error: "unable to delet comment likes" });
          });
      },
      function (messageFound, commentFound, userFound, done) {
        if (commentFound) {
          if (commentFound.userId === userId || (userFound.isAdmin && userFound.id === userId)) {
            models.Comment.destroy({
              where: { id: commentId },
            })
              .then((commentFound) => {
                messageFound.update({
                  comments: messageFound.comments - 1,
                });

                return res.status(201).json(commentFound);
              })
              .catch((err) => {
                return res.status(500).json({ error: "unable to delet this comment" });
              });
          } else {
            models.Comment.destroy({
              where: { id: commentId, userId: userId },
            })
              .then((commentFound) => {
                messageFound.update({
                  comments: messageFound.comments - 1,
                });

                return res.status(201).json(commentFound);
              })
              .catch((err) => {
                return res.status(500).json({ error: "unable to delet this comment" });
              });
          }
        } else {
          return res.status(500).json({ error: "comment not found" });
        }
      },
    ]);
  },
};
