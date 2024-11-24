const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const DeleverySchema = mongoose.Schema({
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
});

DeleverySchema.plugin(timestampPlugin);
module.exports = mongoose.model("Delevery", DeleverySchema);