/**
 * Item Routes
 * Endpoint mapping for /api/items resource
 */

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { apiKeyAuth } = require('../middleware/authMiddleware');

// Apply auth middleware for demonstration
router.use(apiKeyAuth);

// Define CRUD routes
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
