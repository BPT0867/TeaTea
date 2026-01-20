const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token is required");

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // Lưu info user vào request
        next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).send("Admin access required");
    next();
};

// Middleware kiểm tra quyền Admin
exports.isAdmin = (req, res, next) => {
    // req.user được tạo ra từ hàm verifyToken trước đó
    // Lưu ý: Lúc tạo token ở Ngày 3, mình đã lưu { role: user.RoleID } vào payload
    if (req.user && req.user.role === 1) { 
        next(); // Là Admin thì cho đi tiếp
    } else {
        return res.status(403).json({ message: "Truy cập bị từ chối! Bạn không phải Admin." });
    }
};