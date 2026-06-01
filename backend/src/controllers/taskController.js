import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { validateTask } from '../validations/taskValidation.js';

const canAccessTask = (task, user) => {
  return user.role === 'admin' || task.createdBy.toString() === user.id.toString();
};

const createTask = asyncHandler(async (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length > 0) {
    throw new ApiError(400, errors.join(', '));
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description || '',
    status: req.body.status || 'pending',
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Task created',
    data: task
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
  const status = req.query.status;
  const filter = {};

  if (status) {
    const errors = validateTask({ status }, true);
    if (errors.length > 0) {
      throw new ApiError(400, errors.join(', '));
    }
    filter.status = status;
  }

  if (req.user.role !== 'admin') {
    filter.createdBy = req.user.id;
  }

  const totalTasks = await Task.countDocuments(filter);
  const tasks = await Task.find(filter)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: 'Tasks fetched',
    data: tasks,
    meta: {
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit)
    }
  });
});

const getSingleTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('createdBy', 'name email role');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canAccessTask(task, req.user)) {
    throw new ApiError(403, 'You cannot access this task');
  }

  res.status(200).json({
    success: true,
    message: 'Task fetched',
    data: task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const errors = validateTask(req.body, true);
  if (errors.length > 0) {
    throw new ApiError(400, errors.join(', '));
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canAccessTask(task, req.user)) {
    throw new ApiError(403, 'You cannot update this task');
  }

  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.status = req.body.status ?? task.status;

  const taskData = await task.save();

  res.status(200).json({
    success: true,
    message: 'Task updated',
    data: taskData
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canAccessTask(task, req.user)) {
    throw new ApiError(403, 'You cannot delete this task');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted'
  });
});

export { createTask, getTasks, getSingleTask, updateTask, deleteTask };
