﻿const successResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = { successResponse, errorResponse };
