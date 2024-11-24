const Category = require('../../models/category/category');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

const checkCategoryExistence = async (req, res, next) => {
    try {

        const { arabic, english } = req.body.name;

        const existingCategory = await Category.findOne({
            $or: [
                { 'name.arabic': arabic },
                { 'name.english': english }
            ]
        });

        if (existingCategory) {
            throw new CustomError('Category with the same name already exists', statusCode.BadRequest)
        }

        next();
    } catch (error) {
        next(error)
    }
};

module.exports = checkCategoryExistence;
