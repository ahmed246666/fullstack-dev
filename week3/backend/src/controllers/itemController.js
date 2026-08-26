const itemService = require('../services/itemService');

const getItems = (req, res, next) => {
  try {
    const { search, status } = req.query;
    const { items, counts } = itemService.getAllItems({ search, status });

    res.status(200).json({
      success: true,
      count: items.length,
      counts,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

const getItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const item = itemService.getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

const createItem = (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const newItem = itemService.createItem({ title, description, status });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

const updateItemStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'in-progress', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}.`
      });
    }

    const updatedItem = itemService.updateItemStatus(id, status);
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item status updated successfully',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

const deleteItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = itemService.deleteItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItemStatus,
  deleteItem
};
