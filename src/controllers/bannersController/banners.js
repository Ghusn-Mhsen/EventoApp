const bannerRepositories = require('../../repositories/bannerRepositories/banners');
const response = require("../../utils/response")
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')
class BannerController {

    async createBanner(req,res,next) {
        try {

            const {
                bannerImage
            } = req.files;

            if (!bannerImage) {
                throw new CustomError('Incomplete data provided',statusCode.BadRequest)
            }
            const image = `banners/${bannerImage[0].filename}`;
            const result = await bannerRepositories.createBanner(image);

            return response(res, 200, {
                message: "Banner added successfully",
                result
            });
        } catch (error) {
           next(error)
        }
    }

    async getBanners(req,res,next) {
        try {
            const result = await bannerRepositories.getBanners();
            return response(res, 200, {
                message: "Get Banners successfully",
                result
            });
        } catch (error) {
            next(error)
         }
    }

    async deleteBanner(req,res,next) {
        try {
            const _id = req.params.id;
            const result = await bannerRepositories.delete(_id);
            
            return response(res, 200, {
                message: "Banner deleted successfully",
                result
            });
        } catch (error) {
            next(error)
         }
    }
}

module.exports = new BannerController();