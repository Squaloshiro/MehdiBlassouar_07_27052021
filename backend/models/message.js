"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
      this.hasMany(models.Comment, {
        foreignKey: "messageId",
      });
      this.hasMany(models.Like, {
        foreignKey: "messageId",
      });
    }
  }
  Message.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      attachment: DataTypes.STRING,
      likes: DataTypes.TINYINT,
      dislikes: DataTypes.TINYINT,
      comments: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
