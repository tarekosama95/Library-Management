const { Book } = require("../models");
const { successResponse, errorResponse } = require("../apiResponse");
const { Op } = require("sequelize");

//List Books
const index = async (req, res) => {
  try {
    let books;
    books = await Book.findAll();
    const search = req.query.search;
    if (search) {
      books = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { author: { [Op.like]: `%${search}%` } },
            { isbn: { [Op.like]: `%${search}%` } },
          ],
        },
      });
    }

    res.status(200).json(successResponse(books));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

// Create Book
const create = async (req, res) => {
  try {
    const { title, isbn, quantity, shelf_location, author } = req.body;
    const book = await Book.create({
      title,
      isbn,
      quantity,
      shelf_location,
      author,
    });
    res.status(201).json(successResponse(book, "Book Added"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

// Find Book by id
const show = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json(errorResponse("Book Not Found"));
    } else {
      res.status(200).json(successResponse(book, "Book Data Retrieved"));
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

// Update Book
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isbn, quantity, shelf_location, author } = req.body;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json(errorResponse("Book Not Found"));
    } else {
      updated = await book.update({
        title,
        isbn,
        quantity,
        shelf_location,
        author,
      });
      res.status(200).json(successResponse(updated, "Book Updated"));
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
// Delete Book
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json(errorResponse("Book Not Found"));
    } else {
      const deleted = await book.destroy();
      if (deleted) {
        res.status(200).json(successResponse(null, "Book Deleted"));
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
module.exports = {
  index,
  create,
  show,
  update,
  remove,
};
