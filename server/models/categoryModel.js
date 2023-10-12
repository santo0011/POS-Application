const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    adminId: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    categorySlug: {
        type: String,
    },
    categoryImage: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = model('category', categorySchema);