const mongoose = require('mongoose');
let timestampPlugin = require('../../utils/plugins/timestamp')

const BannerSchema = mongoose.Schema({
    bannerImage: {
        type: String,
        required: true
    },
});


BannerSchema.plugin(timestampPlugin)
module.exports = mongoose.model('Banner', BannerSchema);