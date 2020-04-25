'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    slug: DataTypes.STRING
  });

  Board.associate = function (models) {
    models.Post.belongsTo(models.Board, {
      as: 'board',
      foreignKey: 'boardId'
    });
  };

  return Board;
};
