const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;
        
        // Kiểm tra email trùng
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email đã tồn tại!" });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const newUser = await User.create({
            fullName, 
            email, 
            passwordHash: hashedPassword, 
            phone, 
            address,
            role: 2 // Mặc định là khách hàng
        });

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email không đúng!" });

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

        // Tạo Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // MongoDB dùng _id
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: { id: user._id, name: user.fullName, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};