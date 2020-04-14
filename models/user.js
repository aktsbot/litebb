'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  });

  // User.associate = function (models) {
  //   models.User.hasMany(models.Task);
  // };

  return User;
};
