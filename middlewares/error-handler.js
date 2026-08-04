// middlewares/error-handler.js
const errorHandler = (err, req, res, next) => {
  // Log the error for the developer
  console.error(err);

  // If the error has a status code, use it; otherwise, default to 500
  const statusCode = err.statusCode || 500;

  // If the error is unforeseen (500), use a generic message
  const message = statusCode === 500
    ? 'An error occurred on the server'
    : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;