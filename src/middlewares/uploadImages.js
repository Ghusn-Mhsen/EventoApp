const multer = require('multer');
const path = require('path');
const util = require('util');
const createFolder = require("../utils/createFolder")
const {generateFileName,fileFilter} = require("../utils/fileManagement")

const dir = path.join(__dirname, '../..');
const maxSize = 10 * 1024 * 1024;






const createUploadMiddleware = (destination) => {

  const pathFolder = path.resolve(dir, 'public', destination);
  createFolder(pathFolder);

  const storage = multer.diskStorage({
    destination: pathFolder,
    filename: (req, file, cb) => {
      try {
        const generatedFilename = generateFileName(file);
        cb(null, generatedFilename);
      } catch (error) {
        console.error('Error generating filename:', error);
        cb(error);
      }
    }
  });

  return multer({
    storage,
    fileFilter: async(req, file, cb) => await fileFilter(req, file, cb, destination),
    limits: {
      fileSize: maxSize,
    },
  });
};
const uploadMainImage = createUploadMiddleware('mainImage').fields([{
  name: 'mainImage',
  maxCount: 1
}]);
const uploadGalleries = createUploadMiddleware("gallery").fields([{
  name: 'gallery',
  maxCount: 4,
}]);
const uploadSingleGalleries = createUploadMiddleware("gallery").fields([{
  name: 'gallery',
  maxCount: 1,
}]);
const uploadCategoryImage = createUploadMiddleware('category').fields([{
  name: 'categoryImage',
  maxCount: 1
}]);
const uploadCartImage = createUploadMiddleware('cart').fields([{
  name: 'cartImage',
  maxCount: 1
}]);
const uploadDisputeImage = createUploadMiddleware('dispute').fields([{
  name: 'disputeImage',
  maxCount: 1
}]);
const uploadBannerImage = createUploadMiddleware('banners').fields([{
  name: 'bannerImage',
  maxCount: 1
}]);
const uploadSocialImage = createUploadMiddleware('social').fields([{
  name: 'socialIcon',
  maxCount: 1
}]);
module.exports = {
  uploadMainImage: util.promisify(uploadMainImage),
  uploadGalleries: util.promisify(uploadGalleries),
  uploadSingleGalleries: util.promisify(uploadSingleGalleries),
  uploadCategoryImage: util.promisify(uploadCategoryImage),
  uploadCartImage: util.promisify(uploadCartImage),
  uploadDisputeImage: util.promisify(uploadDisputeImage),
  uploadBannerImage: util.promisify(uploadBannerImage),
  uploadSocialImage: util.promisify(uploadSocialImage),
  
};