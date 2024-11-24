const ProductRepository = require("../../repositories/productRepository/product");
const categoryRepositories = require("../../repositories/categoryRepositories/category");
const response = require("../../utils/response");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class CategoryController {



    async addCategory(req, res, next) {
        try {


            const {
                name
            } = req.body;
            const {
                categoryImage
            } = req.files;

            if (!categoryImage) {
                throw new CustomError("Your category Image isn't Uploads!", statusCode.BadRequest);
            }

            const image = `category/${categoryImage[0].filename}`;

            const queries = {
                name,
                image
            };

            const result = await categoryRepositories.addCategory(queries);
            return response(res, 200, {
                message: 'Creating Category Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async updateCategory(req, res, next) {
        try {
            const _id = req.params.id;
            const {
                name
            } = req.body;
            const {
                categoryImage
            } = req.files;

            if (!categoryImage) {
                throw new CustomError("Your category Image isn't uploaded!", statusCode.BadRequest);

            }

            const image = `category/${categoryImage[0].filename}`;

            const queries = {
                name,
                image,
                _id
            };
            const categoryDoc = await categoryRepositories.getCategoryByID(_id);
            const result = await categoryRepositories.updateCategory(queries);

            const updateCount = await ProductRepository.updateProductsByCategory(categoryDoc.name.english, name.english);

            return response(res, 200, {
                message: 'Category and their products updated successfully'
            });
        } catch (error) {
            next(error)
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const _id = req.params.id;
            const category = await categoryRepositories.deleteCategory(_id);
            const deletedCount = await ProductRepository.deleteProductsByCategory(category.name.english);

            return response(res, 200, {
                message: 'Category and their products deleted successfully',
            });
        } catch (error) {
            next(error)
        }
    }

    async deleteMainImage(req, res, next) {
        try {
            const productId = req.params.id;


            const mainImagePath = "";

            const product = await ProductRepository.addMainImageToProduct({
                _id: productId,
                mainImage: mainImagePath
            });

            return response(res, 200, {
                message: "Deleting Main Image successfully",
                result: product
            });
        }catch (error) {
            next(error)
        }
    }

    async getAllCategory(req, res, next) {
        try {
            const categories = await categoryRepositories.getAllCategory();
            return response(res, 200, {
                message: 'Get  All Categories Successfully',
                result: categories,
            });
        } catch (error) {
            next(error)
        }
    }
    async getCategoryByID(req, res, next) {
        try {
            const _id = req.params.id;
            const result = await categoryRepositories.getCategoryByID(_id);
          
            return response(res, 200, {
                message: 'Get Category Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async search(req, res, next) {
        try {
            const {
                value,
                page
            } = req.query;
            let limit = 10
            let offset = 0 + (page - 1) * limit
            const categories = await categoryRepositories.Search({
                name: value,
                offset
            });

            return response(res, 200, {
                message: "Get Data Successfully",
                result: categories
            })

        } catch (error) {
            next(error)
        }

    }
}
module.exports = new CategoryController();