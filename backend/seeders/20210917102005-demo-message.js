"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Messages", [
      {
        id: "1",
        userId: "1",
        title: "Quelle univers vais-je détruire ?",
        content: "Peut-être le 7 ",
        attachment: null,
        likes: "1",
        dislikes: "1",
        comments: "2",
        createdAt: "2021-09-17 09:53:03",
        updatedAt: "2021-09-17 10:07:43",
      },
      {
        id: "2",
        userId: "2",
        title: "Zenos veut détruire notre univers",
        content: "J'ai besoin de ma team pour empêcher le désastre",
        attachment: null,
        likes: "3",
        dislikes: "0",
        comments: "3",
        createdAt: "2021-09-17 09:57:15",
        updatedAt: "2021-09-17 10:13:17",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Messages", null, {});
  },
};
