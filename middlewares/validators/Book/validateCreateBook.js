const { body, validationResult } = require("express-validator");
const { Book } = require("../../../models");
const { validationErrorResponse } = require("../../../apiResponse");

const validateCreateBook = [
  body("title")
    .isString()
    .withMessage("Title Must Be a word")
    .custom(async (value) => {
      if (value) {
        const bookExists = await Book.findOne({ where: { title: value } });
        if (bookExists) {
          throw new Error("Book Already Exists");
        }
        return true;
      }
    }),
  body("isbn")
    .isNumeric()
    .withMessage("ISBN Must Be a number")
    .custom(async (value) => {
      if (value) {
        const bookExists = await Book.findOne({ where: { isbn: value } });
        if (bookExists) {
          throw new Error("ISBN Already Exists");
        }
        return true;
      }
    }),
  body("author").isString().withMessage("Author Must Be a word"),
  body("quantity").isNumeric().withMessage("Quantity Must Be a number"),
  body("shelf_location")
    .isString()
    .withMessage("Shelf Location Must Be a word"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationErrorResponse(errors.array()));
    }
    next();
  },
];

module.exports = {
  validateCreateBook,
};
