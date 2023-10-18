const { Schema, model } = require('mongoose');


const invoiceSchema = new Schema({
    adminId: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    totilePrice: {
        type: Number,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    mobileNum: {
        type: String,
    },
    totalProduct: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = model('invoice', invoiceSchema);