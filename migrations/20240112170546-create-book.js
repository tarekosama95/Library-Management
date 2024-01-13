"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Books",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        author: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        isbn: {
          unique: true,
          type: Sequelize.STRING,
        },
        quantity: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        shelf_location: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
      {
        paranoid: true,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Books");
  },
};
