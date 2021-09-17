"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Commentlikes", [
      {
        id: "7",
        commentId: "5",
        userId: "4",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:13:25",
        updatedAt: "2021-09-17 10:13:25",
      },
      {
        id: "4",
        commentId: "4",
        userId: "3",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:10:49",
        updatedAt: "2021-09-17 10:10:49",
      },
      {
        id: "5",
        commentId: "4",
        userId: "4",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:13:22",
        updatedAt: "2021-09-17 10:13:22",
      },
      {
        id: "2",
        commentId: "3",
        userId: "1",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:08:38",
        updatedAt: "2021-09-17 10:08:38",
      },
      {
        id: "3",
        commentId: "3",
        userId: "3",
        userLike: "0",
        userDislike: "1",
        createdAt: "2021-09-17 10:10:47",
        updatedAt: "2021-09-17 10:10:47",
      },
      {
        id: "6",
        commentId: "3",
        userId: "4",
        userLike: "0",
        userDislike: "1",
        createdAt: "2021-09-17 10:13:24",
        updatedAt: "2021-09-17 10:13:24",
      },
      {
        id: "1",
        commentId: "1",
        userId: "1",
        userLike: "0",
        userDislike: "1",
        createdAt: "2021-09-17 10:07:27",
        updatedAt: "2021-09-17 10:07:27",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Commentlikes", null, {});
  },
};
