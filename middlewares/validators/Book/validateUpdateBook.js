const { body, validationResult } = require("express-validator");
const { Book } = require("../../../models");
const { validationErrorResponse } = require("../../../apiResponse");
const { Op } = require("sequelize");

const validateUpdateBook = [
  body("title").isString().withMessage("Title Must Be a word"),
  body("isbn")
    .isNumeric()
    .withMessage("ISBN Must Be a number")
    .custom(async (value, { req }) => {
      if (value != null) {
        const bookExists = await Book.findOne({
          where: { id: { [Op.ne]: req.params.id }, isbn: value },
        });
        if (bookExists) {
          throw new Error("ISBN Already Exists");
        }
        return true;
      }
    }),
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
  validateUpdateBook,
};
