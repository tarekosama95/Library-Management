const { apiResponse, errorResponse } = require("../../../apiResponse");
const isValidDate = (date) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  return date && date.match(regEx) !== null;
};

const validateDate = (req, res, next) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json(errorResponse("Please enter the dates"));
  }
  if (!isValidDate(from) || !isValidDate(to)) {
    return res
      .status(400)
      .json(
        errorResponse(
          'Use the format "YY-MM-DD" as the format for the start and end dates'
        )
      );
  }
  next();
};
module.exports = {
  isValidDate,
  validateDate,
};
