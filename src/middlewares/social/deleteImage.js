const SocialRepositories = require("../../repositories/SocialRepositories/social")
const deleteFile = require("../../utils/deleteFile")
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

const deleteSocialImage = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const social = await SocialRepositories.getSocialByID(_id);
        if (!social) {
            throw new CustomError('Error In Deleting, social Icon not found', statusCode.NotFound)
        }

        if (social.socialIcon) {
            await deleteFile(social.socialIcon);
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    deleteSocialImage
};