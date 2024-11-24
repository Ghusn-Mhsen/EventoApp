const mongoose = require('mongoose');
let timestampPlugin = require('../../utils/plugins/timestamp')

const categorySchema = new mongoose.Schema({
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
    image: {
        type: String, // Assuming the image is stored as a URL
        required: true,
    },
});
categorySchema.plugin(timestampPlugin)
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;