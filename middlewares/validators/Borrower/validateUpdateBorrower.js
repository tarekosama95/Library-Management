const { body, validationResult } = require("express-validator");
const { validationErrorResponse } = require("../../../apiResponse");
const { Borrower } = require("../../../models");
const { Op } = require("sequelize");

const validateUpdateBorrower = [
  body("name").isString("Name Must Be a Word").withMessage("Name is Required"),
  body("email")
    .isString("Email Incorrect Format")
    .isEmail()
    .withMessage("Email is Required")
    .custom(async (value, { req }) => {
      if (value) {
        const emailExists = await Borrower.findOne({
          where: { id: { [Op.ne]: req.params.id }, email: value },
        });
        if (emailExists) {
          throw new Error("Email Already Exists");
        }
        return true;
      }
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
  validateUpdateBorrower,
};
