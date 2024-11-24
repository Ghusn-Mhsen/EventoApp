const mongoose = require('mongoose');
let timestampPlugin = require('../../utils/plugins/timestamp')

const influencerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true
    },
    rating: {
        type: [{
            rating: {
                type: Number,
                min: 1,
                max: 5,
                default: 1
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }, ],
        default: [],
    },
});
influencerSchema.plugin(timestampPlugin)
const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;