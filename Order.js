const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Ai đặt hàng?
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    shippingAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        default: 'Chờ xác nhận',
        enum: ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Hủy'] 
    },
    // Mảng chứa các món đã đặt (Thay thế cho bảng OrderDetails cũ)
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            productName: String, // Lưu tên cứng để lỡ xóa SP thì đơn vẫn còn tên
            quantity: Number,
            price: Number // Lưu giá tại thời điểm mua
        }
    ],
    orderDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Order', orderSchema);