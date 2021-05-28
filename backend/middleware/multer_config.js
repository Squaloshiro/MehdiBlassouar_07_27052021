const multer = require('multer');
const myNanoId = require('nanoid')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');

        const extension = MIME_TYPES[file.mimetype];
        const id = myNanoId.nanoid()

        callback(null, "image_" + id + '.' + extension);
    }
});