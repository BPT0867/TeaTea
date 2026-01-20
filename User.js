const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: Number, default: 2 }, // 1: Admin, 2: Customer
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);