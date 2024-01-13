"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      isbn: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      author: DataTypes.STRING,
      shelf_location: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Book",
      paranoid: true,
    }
  );
  return Book;
};
