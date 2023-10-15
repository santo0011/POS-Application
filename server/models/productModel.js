const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    adminId: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = model('product', productSchema);