'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Message, {
        foreignKey: 'messageId'
      }),
        this.belongsTo(models.User, {
          foreignKey: 'userId'
        })

    }
  };
  Like.init({
    messageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    userLike: DataTypes.BOOLEAN,
    userDislike: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};