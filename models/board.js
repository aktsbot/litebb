'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

  // Board.associate = function (models) {
  //   models.Board.hasMany(models.Post);
  // };

  return Board;
};
