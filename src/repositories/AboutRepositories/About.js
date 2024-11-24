const AboutUS = require('../../models/AboutUS/aboutUS');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class AboutUSRepository {
    async addAboutUs(data) {
        try {
            return await AboutUS.create(data);
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }

    async getAllAboutUs(offset) {
        try {
            const aboutUs = await AboutUS.find({}).skip(offset).limit(10);
            return aboutUs || [];
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }

    async deleteAboutUsById(id) {
        try {
            const aboutUs =  await AboutUS.findByIdAndDelete(id);
            if (!aboutUs) {
                throw new CustomError('AboutUs not found',statusCode.NotFound);
            }
            return aboutUs;
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }
    async updateAboutUs(id, data) {
        try {
            const aboutUs = await AboutUS.findByIdAndUpdate(id, data, { new: true });

            if (!aboutUs) {
                throw new CustomError('AboutUs not found',statusCode.NotFound);
            }

            return aboutUs;
        } catch (error) {
            throw new CustomError(error.message,error.statusCode);
        }
    }
}

module.exports = new AboutUSRepository();
