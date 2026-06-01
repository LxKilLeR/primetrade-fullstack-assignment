import ApiError from '../utils/ApiError.js';

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return next(new ApiError(403, 'You must be an admin'));
};

export { admin };