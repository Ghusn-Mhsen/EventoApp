const couponRepository = require('../../repositories/CouponRepositories/coupon');
const response = require('../../utils/response')

class CouponController {
    async addCoupon(req, res,next) {
        try {
            const {
                couponName,
                influencer,
                CouponPercentage,
                influencerPercentage,
                usersNumber,
                ExpirationDate,
                fromTotalPrice
            } = req.body;

            const couponData = {
                couponName,
                influencer,
                CouponPercentage,
                influencerPercentage,
                usersNumber,
                ExpirationDate,
                fromTotalPrice
            }

            const result = await couponRepository.addCoupon(couponData);
            return response(res, 200, {
                message: "Add Coupon Successfully",
                result
            })
        } catch (error) {
           next(error)
        }
    }
    async updateCoupon(req, res,next) {
        try {
            const couponId = req.params.id;

            const {
                couponName,
                influencer,
                CouponPercentage,
                influencerPercentage,
                usersNumber,
                ExpirationDate,
                fromTotalPrice
            } = req.body;
            
            const updatedData = {
                couponName,
                influencer,
                CouponPercentage,
                influencerPercentage,
                usersNumber,
                ExpirationDate,
                fromTotalPrice
            }
            const updatedCoupon = await couponRepository.updateCouponById(couponId, updatedData);
            return response(res, 200, {
                message: "updated Coupon Successfully",
                result: updatedCoupon
            })
        } catch (error) {
            next(error)
         }
    }

    async getCouponById(req, res,next) {
        try {
            const couponId = req.params.id;
            const result = await couponRepository.getCouponById(couponId);
            return response(res, 200, {
                message: "Get Coupon By Id Successfully",
                result
            })
        } catch (error) {
            next(error)
         }
    }

    async getCouponByName(req, res,next) {
        try {
            const couponName = req.body.name;
            const result = await couponRepository.getCouponByName(couponName);
            return response(res, 200, {
                message: "Get Coupon By Name Successfully",
                result
            })
        } catch (error) {
            next(error)
         }
    }
    async getAllCoupon(req, res,next) {
        try {

            const result = await couponRepository.getAllCoupon();
            return response(res, 200, {
                message: "Get All Coupon Successfully",
                result
            })
        } catch (error) {
            next(error)
         }
    }
    async activateCoupon(req, res,next) {
        try {
            const couponId = req.params.id;
            const activatedCoupon = await couponRepository.activateCouponById(couponId);
            return response(res, 200, {
                message: "Activate Coupon Successfully",
                result:activatedCoupon
            })
        } catch (error) {
            next(error)
         }
    }

    async deactivateCoupon(req, res,next) {
        try {
            const couponId = req.params.id;
            const deactivatedCoupon = await couponRepository.deactivateCouponById(couponId);
            return response(res, 200, {
                message: "Deactivate Coupon Successfully",
                result:deactivatedCoupon
            })
        } catch (error) {
            next(error)
         }
    }
}

module.exports = new CouponController();