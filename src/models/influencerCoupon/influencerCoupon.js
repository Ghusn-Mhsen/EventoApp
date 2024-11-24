const mongoose = require('mongoose');
let timestampPlugin = require('../../utils/plugins/timestamp');

const influencerCouponSchema = new mongoose.Schema({
    couponName: {
        type: String,
        required: true
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        required: true,
    },
    influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Influencer",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    priceAfterCoupon: {
        type: Number,
        required: true,
    },
    priceBeforeCoupon: {
        type: Number,
        required: true,
    },
    influencerMoney: {
        type: Number,
        required: true,
    },
    initTotalPrice:{
        type: Number,
        required: true,
    },
    merchantMoney:{
        type: Number,
        required: true,
    },
});
influencerCouponSchema.plugin(timestampPlugin)
const InfluencerCoupon = mongoose.model('influencerCoupon', influencerCouponSchema);

module.exports = InfluencerCoupon;