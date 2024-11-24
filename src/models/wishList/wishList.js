const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const WishListSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        _id: false,
    }],
});

WishListSchema.plugin(timestampPlugin);
module.exports = mongoose.model("WishList", WishListSchema);