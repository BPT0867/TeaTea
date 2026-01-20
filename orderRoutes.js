const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth'); // Bắt buộc phải đăng nhập mới đặt hàng được

router.get('/my-orders', authMiddleware.verifyToken, orderController.getUserOrders);
// POST: Tạo đơn hàng
// http://localhost:3000/api/orders
router.post('/', authMiddleware.verifyToken, orderController.createOrder);

// GET: Xem lịch sử đơn hàng
// http://localhost:3000/api/orders
router.get('/', authMiddleware.verifyToken, orderController.getUserOrders);

module.exports = router;

router.put('/:id/cancel', authMiddleware.verifyToken, orderController.cancelOrder);

module.exports = router;