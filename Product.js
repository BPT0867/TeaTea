const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageURL: { type: String },
    // Liên kết sang bảng Category
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    isActive: { type: Boolean, default: true }
}, { versionKey: false });

module.exports = mongoose.model('Product', productSchema);