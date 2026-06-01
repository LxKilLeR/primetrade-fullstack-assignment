const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const validateRegister = (body) => {
  const errors = [];
  const { name, email, password } = body;

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (!email || !validateEmail(email)) {
    errors.push('A valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  if (!email || !validateEmail(email)) {
    errors.push('A valid email is required');
  }
  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

export { validateRegister, validateLogin };
