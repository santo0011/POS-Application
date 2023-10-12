const multer = require('multer');

// storage config

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationFolder = `./uploads/temp`;
        cb(null, destinationFolder)
    },


    filename: (req, file, cb) => {
        const filename = `image-${Date.now()}.${file.originalname}`
        cb(null, filename)
    }

});



const upload = multer({
    storage: storage
});



module.exports = {
    upload
};