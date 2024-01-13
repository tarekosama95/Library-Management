"use strict";
const faker = require("faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const books = Array.from({ length: 10 }, () => ({
      title: faker.lorem.words(),
      isbn: faker.random.number({ min: 1000000000, max: 9999999999 }),
      quantity: faker.random.number({ min: 1, max: 100 }),
      shelf_location: faker.random.alphaNumeric(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Books", null, {});
  },
};
