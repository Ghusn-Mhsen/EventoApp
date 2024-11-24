const SocialRepositories = require("../../repositories/SocialRepositories/social");
const response = require("../../utils/response");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class SocialController {



    async addSocial(req,res,next) {
        try {
            const {
                socialName,
                socialUrl
            } = req.body;
            const {
                socialIcon
            } = req.files;

            if (!socialIcon) {
                throw new CustomError(`Your Social Icon isn't Uploads!`,statusCode.BadRequest)
            }

            const image = `social/${socialIcon[0].filename}`;

            const queries = {
                socialName,
                socialIcon:image,
                socialUrl
            };

            const result = await SocialRepositories.addSocial(queries);

            return response(res, 200, {
                message: 'Creating Social  Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
         }
    }
    async updateSocial(req,res,next) {
        try {
            const _id = req.params.id
            const {
                socialName,
                socialUrl
            } = req.body;
            const {
                socialIcon
            } = req.files;

            if (!socialIcon) {
                throw new CustomError(`Your Social Icon isn't Uploads!`,statusCode.BadRequest)
            }

            const image = `social/${socialIcon[0].filename}`;

            const queries = {
                socialName,
                socialUrl,
                socialIcon:image,
                _id
            };

            const result = await SocialRepositories.updateSocial(queries);

            return response(res, 200, {
                message: 'Update Social Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
         }
    }
    async deleteSocial(req,res,next) {
        try {
            const _id = req.params.id;
            const result = await SocialRepositories.deleteSocial(_id);

            return response(res, 200, {
                message: 'Delete Social Successfully',
                result,
            });
        } catch (error) {
            next(error)
         }
    }
    async getAllSocial(req,res,next) {
        try {
            const social = await SocialRepositories.getAllSocial();
            return response(res, 200, {
                message: 'Get  All social Successfully',
                result: social,
            });
        } catch (error) {
           next(error)
        }
    }
}
module.exports = new SocialController();