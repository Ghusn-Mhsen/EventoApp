const Category = require('../../models/category/category');
const mongoose = require('mongoose');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')



class CategoryRepository {

    async addCategory(category) {
        try {
            const newCategory = await Category.create(category);
            return newCategory;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async updateCategory(category) {
        try {
            const newCategory = await Category.findById(category._id);
            if (!newCategory) {
                throw new CustomError("category not found", statusCode.NotFound);
            }
            newCategory.name = category.name;
            newCategory.image = category.image;

            return await newCategory.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
    async getCategoryByID(_id) {
        try {
            const validCategoryId = new mongoose.Types.ObjectId(_id);
            const category = await Category.findOne({
                _id: validCategoryId
            });
            if (!category) {
                throw new CustomError("category not Found", statusCode.NotFound);
            }

            return category;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }



    async deleteCategory(_id) {
        const validCategoryId = new mongoose.Types.ObjectId(_id);

        try {
            const deletedCategory = await Category.findOneAndDelete({
                _id: validCategoryId
            });

            if (!deletedCategory) {
                throw new CustomError("category not found", statusCode.NotFound);

            }

            return deletedCategory;
        } catch (error) {

            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getAllCategory() {
        try {
            let categories = await Category.find();
            return categories || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async Search({
        name,
        offset
    }) {
        try {
            const query = Category.find();

            if (name) {
                query.or([{
                    'name.arabic': {
                        $regex: new RegExp(name, 'i')
                    }
                },
                {
                    'name.english': {
                        $regex: new RegExp(name, 'i')
                    }
                }
                ]);
            }

            const results = await query.skip(offset).limit(10).exec();

            return results || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}


module.exports = new CategoryRepository();