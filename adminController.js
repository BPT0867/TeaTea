const Order = require('../models/Order');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'fullName phone email') // Lấy thông tin người đặt
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật trạng thái đơn
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status },
            { new: true } // Trả về dữ liệu mới sau khi update
        );
        res.json({ message: "Cập nhật thành công", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thống kê doanh thu (Aggregation)
exports.getRevenueStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $match: { status: 'Hoàn thành' } }, // Chỉ lấy đơn hoàn thành
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, // Gom nhóm theo ngày
                    TotalOrders: { $sum: 1 },
                    Revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: -1 } } // Sắp xếp ngày mới nhất lên đầu
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... (Giữ nguyên code cũ)

// THÊM HÀM NÀY: Thống kê tổng quan cho Dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const Order = require('../models/Order');
        const Product = require('../models/Product');
        const User = require('../models/User');

        // Đếm số lượng
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Tính tổng doanh thu (Chỉ tính đơn Hoàn thành)
        const revenueAgg = await Order.aggregate([
            { $match: { status: 'Hoàn thành' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};