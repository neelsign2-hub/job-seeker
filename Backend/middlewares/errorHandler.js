class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}.`;
    err = new AppError(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Invalid JWT, try again.`;
    err = new AppError(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Token expired, login again.`;
    err = new AppError(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
    err = new AppError(message, 400); // Adding this line to handle duplicate key error
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  AppError,
  errorHandler
};
