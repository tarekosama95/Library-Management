"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Borrower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Borrower.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Borrower",
      paranoid: true,
    }
  );
  return Borrower;
};
