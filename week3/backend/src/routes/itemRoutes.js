const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateCreateItem } = require('../middleware/validateItem');

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItem);
router.post('/', validateCreateItem, itemController.createItem);
router.patch('/:id/status', itemController.updateItemStatus);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
