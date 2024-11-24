const CouponRepositories = require('../../repositories/CouponRepositories/coupon');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

const couponValidationMiddleware = async (req, res, next) => {
    try {
        const couponName = req.body.name;
        const existingCoupon = await CouponRepositories.getCouponByName(couponName);

        if (!existingCoupon) {
            throw new CustomError('Coupon not found.', statusCode.NotFound)
        }

        // Check if the coupon is active
        if (!existingCoupon.active) {
            if (!existingCoupon) {
                throw new CustomError('Coupon is not active.', statusCode.BadRequest)
            }
        }

        // Check if the expiration date is valid
        const currentDate = new Date();
        if (existingCoupon.ExpirationDate && existingCoupon.ExpirationDate < currentDate) {
            throw new CustomError('Coupon has expired.', statusCode.BadRequest)
        }

        // Check if usersNumber condition is met
        const usedNumber = parseInt(existingCoupon.usedNumber) + 1;
        if (existingCoupon.usersNumber && existingCoupon.usersNumber <= usedNumber) {
            throw new CustomError('Coupon is not available for more users.', statusCode.BadRequest)
        }
        next();
    } catch (error) {
        next(error)
    }
};

module.exports = couponValidationMiddleware;