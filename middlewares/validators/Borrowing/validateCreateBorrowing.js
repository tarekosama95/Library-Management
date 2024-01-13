const { body, validationResult } = require("express-validator");
const { validationErrorResponse } = require("../../../apiResponse");
const { Borrowing } = require("../../../models");
const { Op } = require("sequelize");

const validateCreateBorrowing = [
  body("due_date")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Due Date must be in the format of  YY-MM-DD")
    .custom(async (value, { req }) => {
      const now = new Date();
      const due_date = new Date(value);
      if (due_date < now) {
        throw new Error("Due Date Cannot Be a Day Before Today");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationErrorResponse(errors.array()));
    }
    next();
  },
];

module.exports = {
  validateCreateBorrowing,
};
