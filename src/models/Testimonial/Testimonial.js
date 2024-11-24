const mongoose = require("mongoose");
let timestampPlugin = require("../../utils/plugins/timestamp");
const TestimonialSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    testimonial: {
        type: String,
        required: true,
    },
});

TestimonialSchema.plugin(timestampPlugin);
module.exports = mongoose.model("testimonial", TestimonialSchema);