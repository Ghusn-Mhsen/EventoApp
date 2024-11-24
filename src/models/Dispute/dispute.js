const mongoose = require("mongoose");
let validator = require("validator");
let timestampPlugin = require("../../utils/plugins/timestamp");
const DisputeSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    message: {
        type: String,
        required: true,
    },
    disputeImage: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "resolved", "rejected"],
        default: "pending",
    }
});

DisputeSchema.plugin(timestampPlugin);
module.exports = mongoose.model("dispute", DisputeSchema);