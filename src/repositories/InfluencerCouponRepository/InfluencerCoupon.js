const InfluencerCoupon = require('../../models/influencerCoupon/influencerCoupon');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class InfluencerCouponRepository {
    async getAllInfluencerCouponsByQuery(offset, query) {
        try {
            const influencerCoupons = await InfluencerCoupon.find(query)
                .populate('coupon')
                .populate('influencer')
                .populate('user')
                .populate('order')
                .skip(offset)
                .limit(10)
                .sort({
                    createdAt: -1
                });

            return influencerCoupons || [];
        } catch (error) {
            throw new CustomError(error.message , error.statusCode);
        }
    }

    async searchByCouponName(offset, couponName) {
        try {
            const influencerCoupons = await InfluencerCoupon.find({
                    'couponName': {
                        $regex: new RegExp(couponName, 'i')
                    }
                })
                .populate('coupon')
                .populate('influencer')
                .populate('user')
                .populate('order')
                .skip(offset)
                .limit(10)
                .sort({
                    createdAt: -1
                });

            return influencerCoupons || [];
        } catch (error) {
            throw new CustomError(error.message , error.statusCode);
        }
    }
    async deleteByInfluencerId(influencerId) {
        try {
            const { deletedCount } = await InfluencerCoupon.deleteMany({
                influencer:influencerId
            });


            if (!deletedCount || deletedCount <= 0) {
                throw new CustomError('influencer not found', statusCode.NotFound)
            }

            return deletedCount;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
}
module.exports = new InfluencerCouponRepository();