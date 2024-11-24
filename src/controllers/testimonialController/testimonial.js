const TestimonialRepository = require('../../repositories/testimonialRepositories/testimonial');
const response = require('../../utils/response');


class TestimonialController {
    async addTestimonial(req,res,next) {
        try {
            const {
                title,
                testimonial
            } = req.body;

         
            const testimonialData = {
                title,
                testimonial
            };

            const result = await TestimonialRepository.addTestimonial(testimonialData);

            return response(res, 200, {
                message: 'Testimonial added successfully',
                result
            });
        } catch (error) {
           next(error)
        }
    }

    async getAllTestimonials(req,res,next) {
        try {

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const result = await TestimonialRepository.getAllTestimonials(offset);
            return response(res, 200, {
                message: 'Testimonials retrieved successfully',
                result
            });
        } catch (error) {
            next(error)
         }
    }

    async deleteTestimonial(req,res,next) {
        try {
            const testimonialId = req.params.id;
            const result = await TestimonialRepository.deleteTestimonialById(testimonialId);
            return response(res, 200, {
                message: 'Testimonial deleted successfully',
                data: result
            });
        } catch (error) {
            next(error)
         }
    }
}

module.exports = new TestimonialController();