import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { generateToken } from '../utils/token.js';
import { validateRegister, validateLogin } from '../validations/authValidation.js';

const createTokenResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken({ id: user._id })
});

const register = asyncHandler(async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length > 0) {
    throw new ApiError(400, errors.join(', '));
  }

  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });

  const token = generateToken({ id: user._id });

  res.status(201).json({
    success: true,
    message: 'User registered',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    throw new ApiError(400, errors.join(', '));
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.status(200).json({
    success: true,
    message: 'Logged in',
    data: createTokenResponse(user)
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt
    }
  });
});

export { register, login, getProfile };
