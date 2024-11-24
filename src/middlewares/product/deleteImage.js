const ProductRepository = require("../../repositories/productRepository/product")
const DisputeRepositories = require("../../repositories/DisputeRepositories/dispute")
const bannerRepositories = require("../../repositories/bannerRepositories/banners")
const deleteFile = require("../../utils/deleteFile")
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


const deleteMainImage = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const product = await ProductRepository.getProductByID(_id);
        if (!product) {
            throw new CustomError('Error In Deleting Main Image Product not found', statusCode.NotFound)
        }

        // Delete main image
        if (product.mainImage != "") {

            await deleteFile(product.mainImage);
        }
        next()
    } catch (error) {
        next(error)
    }
}
const deleteGalleryImages = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const product = await ProductRepository.getProductByID(_id);

        if (!product) {
            throw new CustomError('Error In Deleting gallery images Product not found', statusCode.NotFound)

        }
        // Delete gallery images
        for (const image of product.galleryImages) {
            await deleteFile(image);
        }

        next()
    } catch (error) {
        next(error)
    }
}
const deleteSingleGalleryImage = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const { oldPath } = req.body;
        
        const product = await ProductRepository.getProductByID(_id);

        if (!product) {
            throw new CustomError('Error In Deleting gallery images Product not found', statusCode.NotFound)
        }


        const gallaryIndex = product.galleryImages.findIndex(item => item === oldPath);
    
        if (gallaryIndex === -1) {
            throw new CustomError('Gallary Image not found', statusCode.NotFound)
        }      
            await deleteFile(oldPath);


        next()
    } catch (error) {
        next(error)
    }
}
const deleteDisputeImage = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const dispute = await DisputeRepositories.getDisputeByID(_id);
        if (!dispute) {
            throw new CustomError('Error In Deleting Dispute Image not found', statusCode.NotFound)
        }

        if (dispute.disputeImage != "") {

            await deleteFile(dispute.disputeImage);
        }
        next()
    } catch (error) {
        next(error)
    }
}
const deleteBannerImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const Banner = await bannerRepositories.getBannerByID(id);
        if (!Banner) {
            throw new CustomError('Error In Deleting Banner Image not found', statusCode.NotFound)
        }

        if (Banner.bannerImage != "") {
            await deleteFile(Banner.bannerImage);
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    deleteMainImage,
    deleteGalleryImages,
    deleteDisputeImage,
    deleteBannerImage,
    deleteSingleGalleryImage
};