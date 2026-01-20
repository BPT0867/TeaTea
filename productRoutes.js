const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth'); // Bảo mật

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Private (Chỉ Admin mới được thao tác)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('image'), productController.createProduct);

// THÊM 2 DÒNG NÀY:
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.deleteProduct);

module.exports = router;