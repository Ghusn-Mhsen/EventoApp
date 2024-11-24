const mongoose = require('mongoose');
let timestampPlugin = require('../../utils/plugins/timestamp')

const productSchema = new mongoose.Schema({
    name: {
        arabic: {
            type: String,
            required: true,
        },
        english: {
            type: String,
            required: true,
        },
    },
    description: {
        arabic: {
            type: String,
            required: true,
        },
        english: {
            type: String,
            required: true,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    initPrice:{
        type: Number,
        required: true,
    },
    metalType: {
        type: String,
        //enum: ['Silver', 'Gold Plated Silver', 'Brass', 'Stainless Steel'],
        required: true,
    },
    customizable: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        required: true,
    },
    writableOnFace: {
        type: Boolean,
        default: false,
    },
    writableOnBack: {
        type: Boolean,
        default: false,
    },
    addableImage: {
        type: Boolean,
        default: false,
    },
    offers: {
        type: [{
            valueOfOffer: {
                type: Number,
                required: true,
            },
            typeOfOffer: {
                type: String,
                enum: ['percentage'],
                required: true,
                default: "percentage"
            },
            startDateOfOffers: {
                type: Date,
                required: true,
            },
            endDateOfOffers: {
                type: Date,
                required: true,
            },
            active: {
                type: Boolean,
                default: true,
            },
        }, ],
        default: [],
    },
    comments: {
        type: [{
            comment: {
                type: String,
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
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
    mainImage: {
        type: String,
        default: ""
    },
    galleryImages: {
        type: [String],
        validate: {
            validator: (images) => images.length <= 4,
            message: 'Up to 4 sub-images are allowed.',
        },
        default: []
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

});
productSchema.plugin(timestampPlugin);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;