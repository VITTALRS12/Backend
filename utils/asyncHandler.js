// utils/asyncHandler.js

/**
 * Wraps async route handlers and passes errors to Express error middleware.
 * This prevents repetitive try-catch blocks.
 *
 * @param {Function} fn - An async function (req, res, next) => {}
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise
      .resolve(fn(req, res, next))
      .catch(next); // Automatically passes any thrown error to Express
  };
};

module.exports = asyncHandler;
