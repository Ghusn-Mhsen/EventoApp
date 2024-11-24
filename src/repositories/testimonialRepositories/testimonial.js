const Testimonial = require('../../models/Testimonial/Testimonial');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class TestimonialRepository {
    async addTestimonial(testimonialData) {
        try {
            return await Testimonial.create(testimonialData);
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getAllTestimonials(offset) {
        try {
            const testimonials = await Testimonial.find({}).skip(offset).limit(10);
            return testimonials || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async deleteTestimonialById(testimonialId) {
        try {
            const testimonial = await Testimonial.findByIdAndDelete(testimonialId);
            if (!testimonial) {
                throw new CustomError('testimonial not found', statusCode.NotFound)
            }
            return testimonial;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}

module.exports = new TestimonialRepository();

