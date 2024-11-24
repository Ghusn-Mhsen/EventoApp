const mongoose = require("mongoose");
let timestampPlugin = require("../../utils/plugins/timestamp");
const SocialSchema = mongoose.Schema({
    socialName: {
        type: String,
        required: true,
    },
    socialUrl: {
        type: String,
        required: true,
    },
    socialIcon: {
        type: String,
        required: true,
    },
});

SocialSchema.plugin(timestampPlugin);
module.exports = mongoose.model("social", SocialSchema);