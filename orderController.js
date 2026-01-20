const Order = require('../models/Order');
const Product = require('../models/Product');

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body; 
        const userId = req.user.id;
        
        let totalAmount = 0;
        const orderItems = [];

        // Duyệt qua từng món để lấy giá gốc từ DB (tránh hack giá từ frontend)
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Sản phẩm ID ${item.productId} không tồn tại`);
            
            totalAmount += product.price * item.quantity;
            
            // Đẩy vào mảng chi tiết
            orderItems.push({
                product: product._id,
                productName: product.productName,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Lưu đơn hàng (1 lệnh duy nhất)
        const newOrder = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        res.status(201).json({ message: "Đặt hàng thành công", orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy lịch sử đơn hàng của user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... (các hàm cũ giữ nguyên)

// Khách hàng tự hủy đơn
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id; // Lấy ID user từ token để bảo mật

        // Tìm đơn hàng của đúng user đó
        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        }

        // KIỂM TRA ĐIỀU KIỆN: Chỉ được hủy khi trạng thái là "Chờ xác nhận"
        if (order.status === 'Đang giao' || order.status === 'Hoàn thành' || order.status === 'Hủy') {
            return res.status(400).json({ message: "Không thể hủy đơn khi đang giao hoặc đã hoàn tất!" });
        }

        order.status = 'Hủy';
        await order.save();

        res.json({ message: "Đã hủy đơn hàng thành công!", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};