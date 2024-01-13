const { body, validationResult } = require("express-validator");
const { validationErrorResponse } = require("../../../apiResponse");
const { Borrower } = require("../../../models");

const name = body("name");
const email = body("email");
if (!name && !email) {
  throw new Error("Here");
}
const validateCreateBorrower = [
  body("name").isString("Name Must Be a Word ").withMessage("Name is Required"),
  body("email")
    .isString("Email Incorrect Format")
    .withMessage("Email Incorrect Format")
    .isEmail()
    .withMessage("Email is Required")
    .custom(async (value) => {
      const emailExists = await Borrower.findOne({ where: { email: value } });
      if (emailExists) {
        throw new Error("Email Already Exists");
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
  validateCreateBorrower,
};
