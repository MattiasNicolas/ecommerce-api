const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/mios', verifyToken, orderController.getAllMyOrders);
router.get('/', verifyToken, isAdmin, orderController.getAllOrders); // solo admin

module.exports = router;

