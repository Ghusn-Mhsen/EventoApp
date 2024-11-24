const AboutRepositories = require('../../repositories/AboutRepositories/About');
const response = require('../../utils/response');

class AboutUsController {
    async addAboutUs(req,res,next) {
        try {
            const { textAr, textEn } = req.body;
            const data = { textAr, textEn }
            const result = await AboutRepositories.addAboutUs(data);

            return response(res, 200, {
                message: 'AboutUs added successfully',
                result
            });
        } catch (error) {
            next(error)
        }
    }

    async getAllAboutUs(req,res,next) {
        try {

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const result = await AboutRepositories.getAllAboutUs(offset);
            return response(res, 200, {
                message: 'AboutUs retrieved successfully',
                result
            });
        } catch (error) {
            next(error)
        }
    }

    async deleteAboutUs(req,res,next) {
        try {
            const id = req.params.id;
            const result = await AboutRepositories.deleteAboutUsById(id);

            return response(res, 200, {
                message: 'AboutUs deleted successfully',
                data: result
            });
        } catch (error) {
            next(error)
        }
    }
    async updateAboutUs(req,res,next) {
        try {
            const { id } = req.params;
            const { textAr, textEn } = req.body;
            const data = { textAr, textEn }
            const updatedAboutUs = await AboutRepositories.updateAboutUs(id, data);

            return response(res, 200, {
                message: 'AboutUs text updated successfully',
                data: updatedAboutUs,
            });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new AboutUsController();