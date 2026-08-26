const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed'];

const validateCreateItem = (req, res, next) => {
  const { title, status } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must not be empty.');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long.');
  }

  if (status !== undefined && status !== null && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  next();
};

module.exports = {
  validateCreateItem,
  ALLOWED_STATUSES
};
