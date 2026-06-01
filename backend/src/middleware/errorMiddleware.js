import ApiError from '../utils/ApiError.js';

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  if (err.name === 'CastError') {
    response.message = 'Resource not found';
    return res.status(404).json(response);
  }

  if (err.code === 11000) {
    response.message = 'Duplicate field value entered';
    return res.status(400).json(response);
  }

  if (err.name === 'ValidationError') {
    response.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    return res.status(400).json(response);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    response.message = 'Token is not valid';
    return res.status(401).json(response);
  }

  return res.status(statusCode).json(response);
};

export { notFound, errorHandler };
