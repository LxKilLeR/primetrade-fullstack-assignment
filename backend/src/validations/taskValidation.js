const allowedStatuses = ['pending', 'completed'];

const validateTask = (body, isUpdate = false) => {
  const errors = [];
  const { title, status } = body;

  if (!isUpdate || title !== undefined) {
    if (!title || title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    errors.push('Status must be one of pending, completed');
  }

  return errors;
};

export { validateTask, allowedStatuses };
