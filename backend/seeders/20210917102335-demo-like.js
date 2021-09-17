"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Likes", [
      {
        id: "1",
        messageId: "1",
        userId: "1",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 09:53:11",
        updatedAt: "2021-09-17 09:53:11",
      },
      {
        id: "2",
        messageId: "1",
        userId: "2",
        userLike: "0",
        userDislike: "1",
        createdAt: "2021-09-17 09:57:49",
        updatedAt: "2021-09-17 09:57:49",
      },
      {
        id: "3",
        messageId: "2",
        userId: "2",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:02:16",
        updatedAt: "2021-09-17 10:02:16",
      },
      {
        id: "4",
        messageId: "2",
        userId: "1",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:08:36",
        updatedAt: "2021-09-17 10:08:36",
      },
      {
        id: "5",
        messageId: "2",
        userId: "3",
        userLike: "1",
        userDislike: "0",
        createdAt: "2021-09-17 10:10:11",
        updatedAt: "2021-09-17 10:10:11",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Likes", null, {});
  },
};
