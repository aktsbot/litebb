'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    content: DataTypes.TEXT,
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
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

  Reply.associate = function (models) {
    models.Post.hasMany(models.Reply, {
      sourceKey: 'id'
    });
  };

  return Reply;
};
