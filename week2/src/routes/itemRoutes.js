/**
 * Item Routes - Week 2
 * Resource route declarations for /api/items
 */

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { apiKeyAuth } = require('../middleware/authMiddleware');

// Apply auth middleware for write mutations
router.use(apiKeyAuth);

// Define CRUD routes
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.patch('/:id', itemController.patchItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
