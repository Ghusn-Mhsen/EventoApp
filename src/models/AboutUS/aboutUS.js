const mongoose = require("mongoose");
let timestampPlugin = require("../../utils/plugins/timestamp");
const AboutUsSchema = mongoose.Schema({
    textAr: {
        type: String,
        required: true,
    },
    textEn: {
        type: String,
        required: true,
    },
});

AboutUsSchema.plugin(timestampPlugin);
module.exports = mongoose.model("aboutUs", AboutUsSchema);