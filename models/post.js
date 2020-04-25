'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    slug: DataTypes.STRING,
    boardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Boards',
        key: 'id'
      }
    },
    createdByUser: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  return Post;
};
