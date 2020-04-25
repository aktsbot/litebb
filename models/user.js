'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'regular')
  });

  // User.associate = function (models) {
  //   models.User.hasMany(models.Task);
  // };

  User.associate = function (models) {
    models.Post.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'createdByUser'
    });
  };

  return User;
};
