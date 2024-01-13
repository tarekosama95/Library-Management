const { Borrower } = require("../models");
const { successResponse, errorResponse } = require("../apiResponse");
const { Op } = require("sequelize");

// Create Borrower
const create = async (req, res) => {
  try {
    const { name, email } = req.body;
    const borrower = await Borrower.create({
      name,
      email,
    });
    res.status(201).json(successResponse(borrower, "Borrower Added"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

// List Borrowers
const index = async (req, res) => {
  try {
    const borrowers = await Borrower.findAll();
    res.status(200).json(successResponse(borrowers, "Borrowers"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
// Update Borrower
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const borrower = await Borrower.findByPk(id);
    if (!borrower) {
      res.status(404).json(errorResponse("Borrower Not Found"));
    } else {
      updated = await borrower.update({
        name,
        email,
      });
      res.status(200).json(successResponse(updated, "Borrower Updated"));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

//Delete Borrower
const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const borrower = await Borrower.findByPk(id);
    if (!borrower) {
      res.status(404).json(errorResponse("Borrower Not Found"));
    } else {
      const deleted = await borrower.destroy();
      if (deleted) {
        res.status(200).json(successResponse(null, "Borrower Deleted"));
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

module.exports = {
  index,
  create,
  remove,
  update,
};
