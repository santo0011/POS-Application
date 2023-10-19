const { model, Schema } = require('mongoose')


const profileSchema = new Schema({
    adminId: {
        type: Schema.ObjectId,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
}, { timestamps: true })



module.exports = model('profile', profileSchema);