const Banner = require('../../models/banners/banners');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class BannerRepository {
    async createBanner(image) {
        try {
            const banners = await Banner.create({bannerImage:image});

            return banners;
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }

    async getBanners() {
        try {
            const banners = await Banner.find();
            
            return banners || []
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }

    async delete(_id) {
        try {
            const deletedBanner = await Banner.findByIdAndDelete(_id);
            if (!deletedBanner) {
                throw new CustomError('Banner not found',statusCode.NotFound);
            }
            return deletedBanner;
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }
    async getBannerByID(bannerId) {
        try {
            const foundBanner = await Banner.findOne({
                _id: bannerId
            });

            if (!foundBanner) {
                throw new CustomError('Banner not found',statusCode.NotFound);
            }

            return foundBanner;
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }
}

module.exports = new BannerRepository();