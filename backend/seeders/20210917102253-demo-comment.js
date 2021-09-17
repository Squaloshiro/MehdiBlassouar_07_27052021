"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Comments", [
      {
        id: "1",
        messageId: "1",
        userId: "2",
        content: "Peut-on vous faire changer d'avis maître Zenos ?",
        likes: "0",
        dislikes: "1",
        createdAt: "2021-09-17 10:06:25",
        updatedAt: "2021-09-17 10:07:27",
      },
      {
        id: "2",
        messageId: "1",
        userId: "1",
        content: "Non je m'ennuie ^^",
        likes: "0",
        dislikes: "0",
        createdAt: "2021-09-17 10:07:43",
        updatedAt: "2021-09-17 10:07:43",
      },
      {
        id: "3",
        messageId: "2",
        userId: "1",
        content: "Rassemble ton équipe cela peut être intéressant",
        likes: "1",
        dislikes: "2",
        createdAt: "2021-09-17 10:08:32",
        updatedAt: "2021-09-17 10:13:24",
      },
      {
        id: "4",
        messageId: "2",
        userId: "3",
        content: "Présent Kakarot",
        likes: "2",
        dislikes: "0",
        createdAt: "2021-09-17 10:10:10",
        updatedAt: "2021-09-17 10:13:22",
      },
      {
        id: "5",
        messageId: "2",
        userId: "4",
        content: "Présent aussi !!!",
        likes: "1",
        dislikes: "0",
        createdAt: "2021-09-17 10:13:17",
        updatedAt: "2021-09-17 10:13:25",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
