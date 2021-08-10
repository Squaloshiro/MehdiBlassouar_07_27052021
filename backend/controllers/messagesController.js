const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { userInfo } = require("os");

module.exports = {
  createMessageImage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    const TITLE_LIMIT = 2;
    const CONTENT_LIMIT = 4;
    const ITEMS_LIMIT = 50;

    // Params

    const formMessage = JSON.parse(req.body.message);
    const { title, content } = formMessage;

    if (title == null || (content == null && attachment == null)) {
      return res.status(400).json({ error: "missing parameters" });
    }

    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
      return res.status(400).json({ error: "invalid parameters" });
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
            res.status(404).json({ error: "user not found" });
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
                attributes: ["username", "avatar"],
              },
            ],
          }).then(function (allMessageFound) {
            return res.status(201).json(allMessageFound);
          });
        } else {
          return res.status(500).json({ error: "cannot post message" });
        }
      }
    );
  },
  createMessage: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    const TITLE_LIMIT = 2;
    const CONTENT_LIMIT = 4;
    const ITEMS_LIMIT = 50;

    // Params
    var title = req.body.title;
    var content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
      return res.status(400).json({ error: "invalid parameters" });
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
            res.status(404).json({ error: "user not found" });
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
                attributes: ["username", "avatar"],
              },
            ],
          }).then(function (allMessageFound) {
            return res.status(201).json(allMessageFound);
          });
        } else {
          return res.status(500).json({ error: "cannot post message" });
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
          attributes: ["username", "avatar"],
        } /*{
                model: models.Comment,
                attributes: ['content'],
                order: [['createdAt', 'DESC']],
                limit: 1,
                include: [{
                    model: models.User,

                    attributes: ['username']
                }],
            }*/,
        {
          model: models.Like,
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
  listMessagesUser: function (req, res) {
    /*const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN,);
        const userId = decodedToken.userId;*/
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
          attributes: ["username", "avatar"],
        },
        {
          model: models.Like,
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

  getOneMessage: function (req, res, next) {
    models.Message.findByPk(req.params.id)
      .then(function (messages) {
        res.status(200).json(messages);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "this message does not exist" });
      });
  },
  modifyMessage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    let content = req.body.content;
    let title = req.body.title;
    asyncLib.waterfall(
      [
        function (done) {
          models.Message.findByPk(req.params.id)
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify message" });
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
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            return res.status(500).json({ error: "message does not exist" });
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
              return res.status(500).json({ error: "unable to find message" });
            });
        },
        function (messageFound, userFound, done) {
          if (messageFound) {
            if (messageFound.UserId === userFound.id) {
              messageFound
                .update({
                  content: content ? content : messageFound.content,
                  title: title ? title : messageFound.title,
                })
                .then(function (newMessage) {
                  done(newMessage);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "unable to update message" });
                });
            } else {
              res.status(500).json({ error: "this publication does not belong to you" });
            }
          } else {
            res.status(404).json({ error: "message not found" });
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
                attributes: ["username", "avatar"],
              },
            ],
          }).then(function (allMessageFound) {
            return res.status(201).json(allMessageFound);
          });
        } else {
          return res.status(500).json({ error: "cannot post message" });
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
            res.status(500).json({ error: "unable to verify comment" });
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
            res.status(500).json({ error: "unable to delet comment likes" });
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
            return res.status(500).json({ error: "unable to delete comment or like" });
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
            console.log("-------------------err-----------------");
            console.log(err);
            console.log("------------------------------------");
            res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (messageFound, done) {
        models.User.findOne({
          where: { isAdmin: true },
        })
          .then(function (userAdminfound) {
            done(null, messageFound, userAdminfound);
          })
          .catch(function (err) {
            res.status(500).json({ error: "admin not found" });
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
                res.status(500).json({ error: "unable to delete message" });
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
                  res.status(500).json({ error: "unable to delete message" });
                });
            });
          }
        } else return res.status(500).json({ error: "this publication does not belong to you" });
      },
    ]);
  },
};
