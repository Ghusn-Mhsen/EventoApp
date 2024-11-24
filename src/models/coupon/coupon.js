const mongoose = require('mongoose');
let timestampPlugin = require('../../utils/plugins/timestamp');

const couponSchema = new mongoose.Schema({
    couponName: {
        type: String,
        required: true,
        unique: true,
    },
    influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Influencer",
        required: true,
    },
    CouponPercentage: {
        type: Number,
        max: 100,
        min: 0,
        required: true,
    },
    influencerPercentage: {
        type: Number,
        max: 100,
        min: 0,
        required: true,
    },
    usersNumber: {
        type: Number,
        min: 1,
        required: true,
    },
    usedNumber: {
        type: Number,
        default: 0
    },
    ExpirationDate: {
        type: Date,
    },
    fromTotalPrice: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    }

});
couponSchema.plugin(timestampPlugin)
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;