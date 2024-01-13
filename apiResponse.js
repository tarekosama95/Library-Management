const successResponse = (data, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

const errorResponse = (message) => {
  return {
    success: false,
    message,
  };
};

const validationErrorResponse = (errors) => {
  return {
    success: false,
    message: "Validation Failure",
    errors: errors,
  };
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
};
