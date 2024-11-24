const {
    v4: uuidv4
} = require('uuid');
const path = require('path');
const allowedImageTypes = ['jpeg', 'png','jpg','svg'];
const maxGalleryImageSize = 3 * 1024 * 1024;
const dir = path.join(__dirname, '../..');
const CustomError = require('../ErrorHandler/customError')
const statusCode = require('../ErrorHandler/statusCode')



const generateFileName = (file) => {
    const extension = file.originalname.split('.')[1];
    const filename = `${Date.now()}-${uuidv4()}.${extension}`;
    return filename;
};
const fileFilter = (req, file, cb, destination) => {
    // Check file type
    const extension = file.originalname.split('.')[1];
    if (!allowedImageTypes.includes(extension)) {
        return cb(new Error('Invalid file type. Only JPEG and PNG and JPG are allowed.'));

    }

    // Check file size for gallery images
    if (destination === 'gallery' && file.size > maxGalleryImageSize) {
        return cb(new Error('Gallery image exceeds the maximum size of 3 MB.'));
    }

    cb(null, true);
};
const downloadFile = async (req, res,next) => {
    try {
        const fileName = req.query.fileName;
        const filePath = path.resolve(dir, 'public', fileName);

        // Logging the file path
        console.log(filePath);

        // Downloading the file
        await res.download(filePath, fileName, (err) => {
            if (err) {
                throw new CustomError(`File Not Found . ${err}`, statusCode.NotFound)
            }
        });
    } catch (error) {
       next(error)
    }
};


module.exports = {
    generateFileName,
    fileFilter,
    downloadFile
};