"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Borrowing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Borrowing.init(
    {
      book_id: DataTypes.INTEGER,
      borrower_id: DataTypes.INTEGER,
      status: DataTypes.ENUM("Bought", "Returned"),
      due_date: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Borrowing",
      paranoid: true,
    }
  );
  return Borrowing;
};
