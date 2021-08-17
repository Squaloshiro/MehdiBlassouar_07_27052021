//imports

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const asyncLib = require("async");
const fs = require("fs");

const email_regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_regex = /^(?=.*\d).{4,8}$/;

//Controller
module.exports = {
  register: function (req, res) {
    //Params
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let bio = req.body.bio;
    let avatar = "/static/media/1.28242b0c.jpg";

    if (email == null || username == null || password == null) {
      return res.status(400).json({ error: "missing params" });
    }

    if (username.length >= 13 || username.length <= 4) {
      return res.status(400).json({ error: "the nickname must be between 5 and 12 characters" });
    }

    if (!email_regex.test(email)) {
      return res.status(400).json({ error: "email invalid" });
    }
    const endOfEmail = email.split("@");

    if (endOfEmail[1] !== "groupomania.com") {
      return res.status(400).json({ error: "votre email doit terminer par @groupomania.com" });
    }

    if (!password_regex.test(password)) {
      return res.status(400).json({ error: "the password must be between 4 and 8 characters" });
    }

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
              return res.status(500).json({ error: "user add problem" });
            });
        },
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptePassword) {
              done(null, userFound, bcryptePassword);
            });
          } else {
            return res.status(409).json({ error: "email allready existing" });
          }
        },
        function (userFound, bcryptePassword, done) {
          models.User.findOne({
            attributes: ["username"],
            where: { username },
          })
            .then(function (userNameFound) {
              done(null, userFound, bcryptePassword, userNameFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "user add problem" });
            });
        },
        function (userFound, bcryptePassword, userNameFound, done) {
          if (!userNameFound) {
            done(null, userFound, bcryptePassword, userNameFound);
          } else {
            return res.status(409).json({ error: "user allready existing" });
          }
        },
        function (userFound, bcryptePassword, userNameFound, done) {
          let newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptePassword,
            bio: bio,
            avatar: avatar,
            isAdmin: false,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "user cannot be added" });
            });
        },
      ],
      function (newUser) {
        if (newUser) {
          return res.status(200).json({
            token: jwt.sign(
              {
                userId: newUser.id,
                isAdmin: newUser.isAdmin,
              },
              process.env.TOKEN,
              { expiresIn: "24h" }
            ),
          });
        } else {
          return res.status(500).json({ error: "user add problem" });
        }
      }
    );
  },
  login: function (req, res) {
    //params
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "missing parameter" });
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
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
              done(null, userFound, resBycrypt);
            });
          } else {
            return res.status(404).json({ error: "Email ou password incorect" });
          }
        },
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "Email ou password incorect" });
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
          return res.status(500).json({ error: "check your login information" });
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
      attributes: ["id", "email", "username", "bio", "avatar", "isAdmin"],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "unable to retrieve user" });
      });
  },
  getUserData: function (req, res) {
    models.User.findByPk(req.params.id, { attributes: ["username", "bio", "avatar"] })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "unable to retrieve user" });
      });
  },
  deleteUserProfile: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    // Params

    asyncLib.waterfall([
      function (done) {
        models.User.findByPk(req.params.id)
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      function (userFound, done) {
        models.User.findOne({
          where: { isAdmin: true },
        })
          .then(function (userAdminFound) {
            done(null, userFound, userAdminFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify user" });
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
            return res.status(500).json({ error: "unable to verify all messages" });
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
            return res.status(500).json({ error: "unable to verify all userDislike" });
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
            return res.status(500).json({ error: "unable to verify all userLike" });
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
            return res.status(500).json({ error: "unable to verify all comment" });
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
            return res.status(500).json({ error: "unable to verify all comment userLike" });
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
            return res.status(500).json({ error: "unable to verify all comment userDisike" });
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
                  return res.status(500).json({ error: "unable to delet  likes" });
                });
            });
        } else {
          return res.status(500).json({ error: "you do not have permission" });
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
                      return res.status(500).json({ error: "unable to delet comments" });
                    });
                });
            });
        } else {
          return res.status(500).json({ error: "you do not have permission" });
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
                    return res.status(500).json({ error: "unable to delet commentlikes" });
                  });
              } else {
                done(null, userFound);
              }
            });
        } else {
          return res.status(500).json({ error: "you do not have permission" });
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
                  console.log("all files removed");
                  models.Message.destroy({
                    where: { userId: userFound.id },
                  })
                    .then(() => {
                      done(null, userFound, userAdminFound);
                    })
                    .catch((err) => {
                      return res.status(500).json({ error: "unable to delet messages" });
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
                  return res.status(500).json({ error: "unable to delet messages" });
                });
            }
          });
        } else {
          return res.status(500).json({ error: "you do not have permission" });
        }
      },

      function (userFound, userAdminFound, done) {
        if (userFound.id === userId || (userAdminFound.isAdmin === true && userAdminFound.id === userId)) {
          userFound
            .destroy({
              where: { userId: userFound.id },
            })
            .then(() => {
              return res.status(201).json("delete your account successfully");
            });
        } else {
          return res.status(500).json({ error: "you do not have permission" });
        }
      },
    ]);
  },
  updateUserProfile: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    let password = req.body.password;

    let bio = req.body.bio;
    let avatar = req.body.avatar;

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
              return res.status(500).json({ error: "unable to verify user" });
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
                res.status(500).json({ error: "unable to modify" });
              });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "unable to modify users account" });
        }
      }
    );
  },
  updateUserAdmin: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findByPk(req.params.id)
            .then(function (userfound) {
              done(null, userfound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userfound, done) {
          models.User.findOne({
            where: { isAdmin: true },
          })
            .then(function (userAdminFound) {
              done(null, userfound, userAdminFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify admin" });
            });
        },

        function (userfound, userAdminFound, done) {
          if (userAdminFound.isAdmin === true && userAdminFound.id === userId) {
            if (userfound.isAdmin === false) {
              userfound
                .update({
                  isAdmin: true,
                })
                .then(function (newUserAdmin) {
                  return res.status(201).json(newUserAdmin.isAdmin);
                });
            } else if (userfound.isAdmin === true) {
              userfound
                .update({
                  isAdmin: false,
                })
                .then(function (newUserAdmin) {
                  return res.status(201).json(newUserAdmin.isAdmin);
                });
            }
          } else {
            return res.status(500).json({ error: "you have not permission" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "unable to modify users account" });
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

    asyncLib.waterfall([
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
          bcrypt.compare(oldPassword, userFound.password, function (errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ error: "user not found in data base" });
        }
      },
      function (userFound, resBycrypt, done) {
        if (resBycrypt) {
          bcrypt.hash(newPassword, 5, function (err, bcryptePassword) {
            done(null, userFound, bcryptePassword);
          });
        } else {
          return res.status(404).json({ error: "user not found in data base" });
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
};
