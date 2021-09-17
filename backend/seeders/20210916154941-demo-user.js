"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        id: "2",
        firstName: "Goku",
        lastName: "Son",
        email: "goku@groupomania.com",
        password: "$2b$05$drykj/zV.c3RJglxHqSYmO5Qzm9aNSgm8PVZ6aDRzLTvJPGUWnAcS",
        bio: null,
        avatar: "/static/media/27.edfbcdcc.jpg",
        isAdmin: "0",
        createdAt: "2021-09-17 09:55:45",
        updatedAt: "2021-09-17 09:57:39",
      },
      {
        id: "3",
        firstName: "Vegeta",
        lastName: "Prince",
        email: "vegeta@groupomania.com",
        password: "$2b$05$nbG.j.jXPrMAY8mzGtrMvuJowo/c55wJ6btpYSWpzZD0frCYt/yGe",
        bio: null,
        avatar: "/static/media/19.e2bc66d9.jpg",
        isAdmin: "0",
        createdAt: "2021-09-17 10:09:45",
        updatedAt: "2021-09-17 10:10:34",
      },
      {
        id: "4",
        firstName: "Sennin",
        lastName: "Kame",
        email: "mutten@groupomania.com",
        password: "$2b$05$yUgFPnXM9/Md.c.WQ0eOS.ld95vh8WSqtfsSxcD3orBJM.37Lv0Pu",
        bio: null,
        avatar: "/static/media/22.b0be2c42.jpg",
        isAdmin: "0",
        createdAt: "2021-09-17 10:12:32",
        updatedAt: "2021-09-17 10:12:57",
      },
      {
        id: "1",
        firstName: "Zenos",
        lastName: "Dieu",
        email: "admin@groupomania.com",
        password: "$2b$05$xZldHaJHk.Pp.gfbLLjEW.bsFiLqORNs3E51p2S8ep/1/K4E35iyi",
        bio: "Je suis votre de dieu a tous.",
        avatar: "/static/media/39.9c2365c2.jpg",
        isAdmin: "1",
        createdAt: "2021-09-17 09:46:13",
        updatedAt: "2021-09-17 09:49:47",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
