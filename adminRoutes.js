const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Tất cả các route dưới đây đều phải qua 2 ải:
// 1. verifyToken (Đã đăng nhập chưa?)
// 2. isAdmin (Có phải Admin không?)

// GET: Xem tất cả đơn hàng
router.get('/orders', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getAllOrders);

// PUT: Cập nhật trạng thái đơn hàng (Ví dụ: /api/admin/orders/5)
router.put('/orders/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.updateOrderStatus);

// GET: Xem thống kê doanh thu
router.get('/stats', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getRevenueStats);

module.exports = router;

router.get('/dashboard', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getDashboardStats);