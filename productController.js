const Product = require('../models/Product');
const Category = require('../models/Category');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        // .populate('category') giúp thay thế ID danh mục bằng thông tin chi tiết (tên danh mục)
        const products = await Product.find().populate('category', 'categoryName');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết 1 sản phẩm
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm (Admin)
exports.createProduct = async (req, res) => {
    try {
        const { productName, price, description, categoryId } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduct = await Product.create({
            productName, 
            price, 
            description, 
            category: categoryId, // Mongoose tự hiểu đây là ObjectId
            imageURL: image
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... (Giữ nguyên các hàm getAllProducts, getProductById, createProduct cũ)

// 4. Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { productName, price, description, categoryId } = req.body;
        const data = {
            productName,
            price,
            description,
            category: categoryId
        };
        
        // Nếu có upload ảnh mới thì cập nhật, không thì giữ nguyên
        if (req.file) {
            data.imageURL = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};