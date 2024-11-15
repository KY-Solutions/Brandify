const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callBackFunc) => {
        callBackFunc(null, 'uploads/'); //! folder to save images
    },
    filename: (req, file, callBackFunc) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callBackFunc(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, callBackFunc) => {
    if (file.mimetype.startsWith('image')) {
        callBackFunc(null, true);
    } else {
        callBackFunc(new Error('Only image files are allowed'), false);

    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //! Limit file size to 5 MB
});

module.exports = upload;