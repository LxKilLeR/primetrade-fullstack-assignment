import express from 'express';
import {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(createTask).get(getTasks);
router.route('/:id').get(getSingleTask).put(updateTask).delete(deleteTask);

export default router;
