const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true }
}, { versionKey: false }); // versionKey: false để bỏ cái trường __v dư thừa

module.exports = mongoose.model('Category', categorySchema);