const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return errorResponse(res, err.status || 500, err.message || 'Internal Server Error');
};

module.exports = errorHandler;
