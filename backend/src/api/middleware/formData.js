const path = require('path');
const multer = require('multer')

const formData = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, callback) {
        const filetypes = /jpeg|jpg|png|gif|pdf/;

        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return callback(null, true);
        } else {
            callback(new Error('Filetype not allowed'));
        }
    }
}).single('file');

module.exports = formData;