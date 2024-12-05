"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    promises.push(queryInterface.addColumn("Users", "avatar", Sequelize.TEXT));
    promises.push(
      queryInterface.addColumn("Users", "website", Sequelize.STRING),
    );

    return Promise.all(promises);
  },

  down: (queryInterface, Sequelize) => {
    const promises = [];
    promises.push(queryInterface.removeColumn("Users", "avatar"));
    promises.push(queryInterface.removeColumn("Users", "website"));

    return Promise.all(promises);
  },
};
