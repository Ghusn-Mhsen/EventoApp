const mongoose = require("mongoose");
let timestampPlugin = require("../../utils/plugins/timestamp");
const NotificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
});

NotificationSchema.plugin(timestampPlugin);
module.exports = mongoose.model("notification", NotificationSchema);