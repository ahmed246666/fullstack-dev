/**
 * Item Controller
 * Handles request parsing, input validation, status codes, and JSON response formatting.
 */

const itemService = require('../services/itemService');

const VALID_STATUSES = ['planned', 'in-progress', 'completed'];

/**
 * GET /api/items
 * Retrieve all items with optional query filter
 */
function getItems(req, res, next) {
  try {
    const { category, status } = req.query;
    const items = itemService.getAllItems({ category, status });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      count: items.length,
      message: 'Items retrieved successfully',
      data: items
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/items/:id
 * Retrieve a single item by ID
 */
function getItemById(req, res, next) {
  try {
    const { id } = req.params;
    const item = itemService.getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Item with ID ${id} was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Item retrieved successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/items
 * Create a new item with payload validation
 */
function createItem(req, res, next) {
  try {
    const { title, category, description, status } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push({ field: 'title', message: 'Title is required and must be a non-empty string.' });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      errors.push({ field: 'category', message: 'Category is required and must be a non-empty string.' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed for item payload.',
        details: errors
      });
    }

    const newItem = itemService.createItem({ title, category, description, status });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Item created successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/items/:id
 * Update an existing item
 */
function updateItem(req, res, next) {
  try {
    const { id } = req.params;
    const { title, category, description, status } = req.body;

    const existingItem = itemService.getItemById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Cannot update. Item with ID ${id} was not found.`
      });
    }

    const errors = [];
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      errors.push({ field: 'title', message: 'Title must be a non-empty string if provided.' });
    }

    if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
      errors.push({ field: 'category', message: 'Category must be a non-empty string if provided.' });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed for update payload.',
        details: errors
      });
    }

    const updated = itemService.updateItem(id, { title, category, description, status });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Item updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/items/:id
 * Delete an item by ID
 */
function deleteItem(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = itemService.deleteItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Cannot delete. Item with ID ${id} was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Item with ID ${id} was deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
