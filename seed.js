const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import các Models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seedDB = async () => {
    try {
        // 1. Kết nối MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Đã kết nối MongoDB...');

        // 2. Xóa sạch dữ liệu cũ
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('🧹 Đã dọn dẹp dữ liệu cũ.');

        // 3. Tạo Danh Mục (Thêm danh mục Đá Xay cho phong phú)
        const createdCategories = await Category.insertMany([
            { categoryName: 'Trà Sữa' },      // index 0
            { categoryName: 'Trà Trái Cây' }, // index 1
            { categoryName: 'Topping' },      // index 2
            { categoryName: 'Đá Xay' }        // index 3
        ]);
        console.log('✅ Đã tạo 4 Danh mục.');

        // 4. Tạo Tài khoản Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        await User.create({
            fullName: 'Quản Trị Viên',
            email: 'admin@teatea.com',
            passwordHash: hashedPassword,
            phone: '0909000111',
            address: 'Trụ sở chính Tea&Tea',
            role: 1 // Admin
        });
        console.log('✅ Đã tạo Admin (admin@teatea.com / 123456).');

        // 5. Tạo danh sách hơn 40 Sản Phẩm
        // Lưu ý: imageURL để rỗng "" để Frontend tự lấy ảnh đẹp từ Unsplash
        const productsList = [
            // --- DANH MỤC: TRÀ SỮA (index 0) ---
            { name: "Trà Sữa Truyền Thống", price: 25000, desc: "Hương vị trà đen đậm đà kết hợp sữa béo ngậy", cat: 0 },
            { name: "Trà Sữa Trân Châu Đường Đen", price: 35000, desc: "Sữa tươi thanh trùng, đường đen Hàn Quốc, trân châu dẻo", cat: 0 },
            { name: "Trà Sữa Matcha Nhật Bản", price: 32000, desc: "Bột Matcha Uji nhập khẩu, thơm lừng", cat: 0 },
            { name: "Trà Sữa Khoai Môn", price: 30000, desc: "Vị khoai môn bùi bùi, màu tím bắt mắt", cat: 0 },
            { name: "Trà Sữa Chocolate", price: 32000, desc: "Đậm vị cacao, hơi đắng nhẹ quyến rũ", cat: 0 },
            { name: "Trà Sữa Thái Xanh", price: 25000, desc: "Trà Thái đậm vị, thơm mùi thảo mộc", cat: 0 },
            { name: "Trà Sữa Thái Đỏ", price: 25000, desc: "Màu cam đặc trưng, vị trà chát nhẹ", cat: 0 },
            { name: "Trà Sữa Oolong Nướng", price: 38000, desc: "Hương khói nhẹ đặc trưng của Oolong nướng", cat: 0 },
            { name: "Trà Sữa Hạt Dẻ", price: 40000, desc: "Thơm mùi hạt dẻ nướng, béo ngậy", cat: 0 },
            { name: "Trà Sữa Bạc Hà", price: 28000, desc: "The mát sảng khoái, giải nhiệt cực đã", cat: 0 },
            { name: "Trà Sữa Sương Sáo", price: 27000, desc: "Topping sương sáo dai giòn, thanh mát", cat: 0 },
            { name: "Hồng Trà Macchiato", price: 35000, desc: "Lớp kem cheese mặn béo bên trên hồng trà", cat: 0 },

            // --- DANH MỤC: TRÀ TRÁI CÂY (index 1) ---
            { name: "Trà Đào Cam Sả", price: 35000, desc: "Best seller với miếng đào giòn tan", cat: 1 },
            { name: "Trà Vải Hoa Hồng", price: 38000, desc: "Thơm ngát hương hoa hồng và vải thiều", cat: 1 },
            { name: "Lục Trà Kim Quất", price: 28000, desc: "Chua chua ngọt ngọt, vitamin C dồi dào", cat: 1 },
            { name: "Trà Ổi Hồng Muối Tôm", price: 35000, desc: "Sự kết hợp độc đáo giữa ổi hồng và muối tôm", cat: 1 },
            { name: "Trà Dâu Tằm Pha Lê", price: 32000, desc: "Màu đỏ quyến rũ, vị chua dịu", cat: 1 },
            { name: "Trà Bưởi Đỏ Mật Ong", price: 38000, desc: "Tép bưởi tươi mọng nước, tốt cho sức khỏe", cat: 1 },
            { name: "Trà Mãng Cầu Xiêm", price: 40000, desc: "Thịt mãng cầu tươi, chua ngọt tự nhiên", cat: 1 },
            { name: "Trà Xoài Chanh Dây", price: 35000, desc: "Vị nhiệt đới bùng nổ", cat: 1 },
            { name: "Trà Dưa Lưới Nha Đam", price: 32000, desc: "Thơm mát hương dưa lưới, nha đam giòn", cat: 1 },
            { name: "Trà Nho Đen", price: 36000, desc: "Vị nho đậm đà, màu sắc sang trọng", cat: 1 },
            { name: "Trà Kiwi Hạt Chia", price: 38000, desc: "Kiwi tươi xay, bổ sung hạt chia dinh dưỡng", cat: 1 },
            { name: "Trà Táo Xanh Bạc Hà", price: 30000, desc: "Táo xanh giòn tan kết hợp bạc hà the mát", cat: 1 },

            // --- DANH MỤC: TOPPING (index 2) ---
            { name: "Trân Châu Đen (Thêm)", price: 5000, desc: "Dai dai dẻo dẻo, nấu mới mỗi ngày", cat: 2 },
            { name: "Trân Châu Trắng (Thêm)", price: 5000, desc: "Giòn sần sật, vị rong biển", cat: 2 },
            { name: "Thạch Dừa (Thêm)", price: 5000, desc: "Thạch dừa thô dai ngon", cat: 2 },
            { name: "Pudding Trứng (Thêm)", price: 7000, desc: "Mềm mịn, tan trong miệng", cat: 2 },
            { name: "Kem Cheese (Thêm)", price: 10000, desc: "Lớp kem phô mai mặn béo thần thánh", cat: 2 },
            { name: "Thạch Củ Năng (Thêm)", price: 8000, desc: "Bên trong giòn, bên ngoài dẻo", cat: 2 },
            { name: "Khúc Bạch (Thêm)", price: 8000, desc: "Thơm mùi hạnh nhân, béo ngậy", cat: 2 },
            { name: "Trân Châu Hoàng Kim (Thêm)", price: 6000, desc: "Màu vàng óng ánh, vị mật ong", cat: 2 },

            // --- DANH MỤC: ĐÁ XAY (index 3) ---
            { name: "Matcha Đá Xay", price: 45000, desc: "Matcha xay nhuyễn cùng đá và sữa", cat: 3 },
            { name: "Cookie Đá Xay", price: 45000, desc: "Bánh Oreo xay nhuyễn, lớp kem tươi bên trên", cat: 3 },
            { name: "Chocolate Đá Xay", price: 45000, desc: "Đậm vị chocolate, mát lạnh", cat: 3 },
            { name: "Cà Phê Cốt Dừa Đá Xay", price: 42000, desc: "Vị cà phê đắng nhẹ và cốt dừa béo", cat: 3 },
            { name: "Sinh Tố Bơ", price: 40000, desc: "Bơ sáp dẻo quánh, béo ngậy", cat: 3 },
            { name: "Sinh Tố Dâu", price: 40000, desc: "Dâu tây tươi Đà Lạt", cat: 3 },
            { name: "Sữa Chua Đánh Đá", price: 25000, desc: "Sữa chua nhà làm, chua ngọt dịu", cat: 3 },
        ];

        // Map dữ liệu vào đúng format của Mongoose
        const finalProducts = productsList.map(p => ({
            productName: p.name,
            price: p.price,
            description: p.desc,
            category: createdCategories[p.cat]._id, // Lấy ID từ danh mục vừa tạo
            imageURL: "", // Để rỗng để Frontend tự random ảnh
            isActive: true
        }));

        await Product.insertMany(finalProducts);
        console.log(`✅ Đã tạo thành công ${finalProducts.length} Sản phẩm.`);

        console.log('🎉 KHỞI TẠO DATABASE THÀNH CÔNG RỰC RỠ!');
        process.exit();
    } catch (err) {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    }
};

seedDB();