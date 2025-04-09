const errorHandlerMiddleware = (err, req, res, next) => {
  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ msg: err.message });
  }

  // Handle mongoose cast errors (invalid IDs)
  if (err.name === "CastError") {
    return res.status(400).json({ msg: `Invalid ${err.path}: ${err.value}` });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ msg: `Duplicate value for ${Object.keys(err.keyValue)}` });
  }

  // Default error
  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again" });
};

module.exports = errorHandlerMiddleware;
