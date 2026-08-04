/**
 * Item Controller - Week 2
 * Input Validation, Query Parameter Handling, HTTP Status Codes & Responses
 */

const itemService = require('../services/itemService');

const VALID_STATUSES = ['active', 'draft', 'archived'];

/**
 * GET /api/items
 * List items with pagination, filtering, searching & sorting
 */
function getItems(req, res, next) {
  try {
    const { search, category, status, sortBy, order, page, limit } = req.query;

    const result = itemService.getAllItems({
      search,
      category,
      status,
      sortBy,
      order,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Items retrieved successfully',
      meta: result.pagination,
      data: result.items
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
 * Create a new item
 */
function createItem(req, res, next) {
  try {
    const { title, category, description, price, stock, status } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push({ field: 'title', message: 'Title is required and must be a non-empty string.' });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      errors.push({ field: 'category', message: 'Category is required and must be a non-empty string.' });
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      errors.push({ field: 'price', message: 'Price must be a non-negative number.' });
    }

    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0)) {
      errors.push({ field: 'stock', message: 'Stock must be a non-negative integer.' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed for creation payload.',
        details: errors
      });
    }

    const newItem = itemService.createItem({ title, category, description, price, stock, status });

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
 * Full replace update
 */
function updateItem(req, res, next) {
  try {
    const { id } = req.params;
    const { title, category, description, price, stock, status } = req.body;

    const existing = itemService.getItemById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Cannot update. Item with ID ${id} was not found.`
      });
    }

    const errors = [];
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push({ field: 'title', message: 'Title is required for full PUT update.' });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      errors.push({ field: 'category', message: 'Category is required for full PUT update.' });
    }

    if (price === undefined || isNaN(price) || Number(price) < 0) {
      errors.push({ field: 'price', message: 'Price is required and must be non-negative.' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed for full update payload.',
        details: errors
      });
    }

    const updated = itemService.updateItem(id, { title, category, description, price, stock, status });

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
 * PATCH /api/items/:id
 * Partial update
 */
function patchItem(req, res, next) {
  try {
    const { id } = req.params;
    const existing = itemService.getItemById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Cannot patch. Item with ID ${id} was not found.`
      });
    }

    const { title, category, price, stock, status } = req.body;
    const errors = [];

    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      errors.push({ field: 'title', message: 'Title must be a non-empty string if provided.' });
    }

    if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
      errors.push({ field: 'category', message: 'Category must be a non-empty string if provided.' });
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      errors.push({ field: 'price', message: 'Price must be non-negative if provided.' });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed for partial update payload.',
        details: errors
      });
    }

    const patched = itemService.patchItem(id, req.body);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Item patched successfully',
      data: patched
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/items/:id
 * Delete item
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
  patchItem,
  deleteItem
};
