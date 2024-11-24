const categoryRepositories = require("../../repositories/categoryRepositories/category")
const deleteFile = require("../../utils/deleteFile")
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


const deleteCategoryImage = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const category = await categoryRepositories.getCategoryByID(_id);
        if (!category) {
            throw new CustomError('Error In Deleting Category Image Product not found', statusCode.NotFound)
        }

        if (category.image) {
            await deleteFile(category.image);
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    deleteCategoryImage,
};