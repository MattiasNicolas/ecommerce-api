const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, isAdmin, productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
