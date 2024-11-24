const influencerCouponRepository = require('../../repositories/InfluencerCouponRepository/InfluencerCoupon');
const response = require('../../utils/response')
class InfluencerCouponController {
    async getAllInfluencerCoupons(req, res,next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            let offset = (page - 1) * limit;
            const query = {};


            const result = await influencerCouponRepository.getAllInfluencerCouponsByQuery(offset,query);

            return response(res, 200, {
                message: 'influencerCoupons retrieved successfully',
                result: result,
            });
        } catch (error) {
           next(error)
        }
    }

    async getInfluencerCouponsByCoupon(req, res,next) {
        try {
            const {couponId} = req.body
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            let offset = (page - 1) * limit;
            const query = { coupon: couponId };

            const result = await influencerCouponRepository.getAllInfluencerCouponsByQuery(offset,query);

            return response(res, 200, {
                message: 'influencerCoupons retrieved successfully',
                result: result,
            });
        }  catch (error) {
            next(error)
         }
    }

    async getInfluencerCouponsByInfluencer(req, res,next) {
        try {
            const {influencerId} = req.body
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            let offset = (page - 1) * limit;
            const query = { influencer: influencerId };

            const result = await influencerCouponRepository.getAllInfluencerCouponsByQuery(offset,query);

            return response(res, 200, {
                message: 'influencerCoupons retrieved successfully',
                result: result,
            });
        }  catch (error) {
            next(error)
         }
    }
    async deleteByInfluencerId(req, res,next) {
        try {
            const {influencerId} = req.body
            const result = await influencerCouponRepository.deleteByInfluencerId(influencerId);
            return response(res, 200, {
                message: 'influencerCoupons delete successfully',
            });
        }  catch (error) {
            next(error)
         }
    }
    async searchByCouponName(req, res,next) {
        try {
            const {
                couponName,
            } = req.query;

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const result = await influencerCouponRepository.searchByCouponName(
                offset,
                couponName
            );
            
            return response(res, 200, {
                message: "Get Data Successfully",
                result
            })
        }  catch (error) {
            next(error)
         }
    }
}

module.exports = new InfluencerCouponController();
