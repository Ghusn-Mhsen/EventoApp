const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            randomNumber: {
                type: Number,
            },
            customizable: {
                type: Number,
            },
            writableOnFace:{
                type: String,
            },
            writableOnBack:{
                type: String,
            },
            addableImage:{
                type:String
            },
            quantity: {
                type: Number,
                default: 1
            },
            note:{
                type:String
            },
        }

    ],
    totalCost: {
        type: Number,
        default: 0,
    },
});

CartSchema.plugin(timestampPlugin);
module.exports = mongoose.model("Cart", CartSchema);