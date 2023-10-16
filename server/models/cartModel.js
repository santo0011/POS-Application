const { Schema, model } = require('mongoose')

const cardSchema = new Schema({
    productId: {
        type: Schema.ObjectId,
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true })


module.exports = model('cartProducts', cardSchema)