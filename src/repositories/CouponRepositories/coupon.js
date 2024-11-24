const Coupon = require('../../models/coupon/coupon');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class CouponRepository {
    async addCoupon(couponData) {
        try {
            const newCoupon = new Coupon(couponData);
            const savedCoupon = await newCoupon.save();
            return savedCoupon;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async updateCouponById(couponId, updatedData) {
        try {
            const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updatedData, {
                new: true
            });

            if (!updatedCoupon) {
                throw new CustomError(`Coupon not found.`, statusCode.NotFound);
            }

            return updatedCoupon;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getCouponById(couponId) {
        try {
            const coupon = await Coupon.findById(couponId).populate('influencer');

            if (!coupon) {
                throw new CustomError(`Coupon not found.`, statusCode.NotFound);
            }

            return coupon;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
    async getAllCoupon() {
        try {
            const coupons = await Coupon.find().populate('influencer');


            return coupons || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getCouponByName(couponName) {
        try {
            const coupon = await Coupon.findOne({
                couponName
            }).populate('influencer');

            if (!coupon) {
                throw new CustomError(`Coupon not found.`, statusCode.NotFound);
            }

            return coupon;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
    async activateCouponById(couponId) {
        try {
            const activatedCoupon = await Coupon.findByIdAndUpdate(couponId, { active: true }, { new: true });

            if (!activatedCoupon) {
                throw new CustomError(`Coupon not found.`, statusCode.NotFound);
            }

            return activatedCoupon;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async deactivateCouponById(couponId) {
        try {
            const deactivatedCoupon = await Coupon.findByIdAndUpdate(couponId, { active: false }, { new: true });

            if (!deactivatedCoupon) {
                throw new CustomError(`Coupon not found.`, statusCode.NotFound);
            }

            return deactivatedCoupon;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}

module.exports = new CouponRepository();