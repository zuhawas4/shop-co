const express = require('express');
const cartController = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
