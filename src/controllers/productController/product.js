const ProductRepository = require("../../repositories/productRepository/product");
const response = require("../../utils/response");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class ProductController {

    async addProduct(req, res, next) {
        try {
            const owner_id = req._id;
            const {
                name,
                description,
                price,
                initPrice,
                metalType,
                customizable,
                category,
                writableOnFace,
                writableOnBack,
                addableImage,
            } = req.body;

            const queries = {
                name,
                description,
                price,
                initPrice,
                metalType,
                customizable,
                category,
                writableOnFace,
                writableOnBack,
                addableImage,
                owner_id,
            };

            const result = await ProductRepository.addProduct(queries);

            return response(res, 200, {
                message: 'Creating Product Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async addMainImageToProduct(req, res, next) {
        try {
            const productId = req.params.id;
            const {
                mainImage
            } = req.files;

            if (!mainImage) {
                throw new CustomError("Your Main Image isn't Uploads!", statusCode.BadRequest);
            }

            const mainImagePath = `mainImage/${mainImage[0].filename}`;

            const product = await ProductRepository.addMainImageToProduct({
                _id: productId,
                mainImage: mainImagePath
            });

            return response(res, 200, {
                message: "Adding Main Image successfully",
                result: product
            });
        } catch (error) {
            next(error)
        }
    }
    async addGalleryToProduct(req, res, next) {
        try {
            const productId = req.params.id;
            const {
                gallery
            } = req.files;

            if (!gallery) {
                throw new CustomError("Your Gallery Image isn't Uploads!", statusCode.BadRequest);
            }
            const galleryImagesPath = gallery.map(file => `gallery/${file.filename}`);


            const product = await ProductRepository.addGalleriesToProduct({
                _id: productId,
                galleryImages: galleryImagesPath
            });

            return response(res, 200, {
                message: "Adding Gallery Images successfully",
                result: product
            });
        } catch (error) {
            next(error)
        }
    }
    async updateSingleGallery(req, res, next) {
        try {
            const productId = req.params.id;
            const {oldPath} = req.body;
            const {
                gallery
            } = req.files;

            if (!gallery) {
                throw new CustomError("Your Gallery Image isn't Uploads!", statusCode.BadRequest);
            }
            const galleryImagesPath = `gallery/${gallery[0].filename}`;
            const product = await ProductRepository.updateSingleGallery({
                _id: productId,
                galleryImage: galleryImagesPath,
                oldPath:oldPath
            });

            return response(res, 200, {
                message: "Update Single Gallery Image successfully",
                result: product
            });
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const _id = req.params.id;
            const {
                name,
                description,
                price,
                metalType,
                customizable,
                category,
                writableOnFace,
                writableOnBack,
                addableImage,
            } = req.body;

            const queries = {
                _id,
                name,
                description,
                price,
                metalType,
                customizable,
                category,
                writableOnFace,
                writableOnBack,
                addableImage,
            };

            const result = await ProductRepository.updateProduct(queries);

            return response(res, 200, {
                message: 'Updating Product Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async deleteProduct(req, res, next) {
        try {
            const _id = req.params.id;
            const deletedCount = await ProductRepository.deleteProduct(_id);

            return response(res, 200, {
                message: 'Product deleted successfully',
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
        } catch (error) {
            next(error)
        }
    }
    async deleteGalleryImages(req, res, next) {
        try {
            const productId = req.params.id;

            const galleryImagesPath = [];


            const product = await ProductRepository.addGalleriesToProduct({
                _id: productId,
                galleryImages: galleryImagesPath
            });

            return response(res, 200, {
                message: "Deleting Gallery Images successfully",
                result: product
            });
        } catch (error) {
            next(error)
        }
    }
    async getProductByID(req, res, next) {
        try {
            const _id = req.params.id;

            const result = await ProductRepository.getProductByID(_id);

            return response(res, 200, {
                message: 'Get Product Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async getGalleryImagesProduct(req, res, next) {
        try {
            const _id = req.params.id;
            const result = await ProductRepository.getProductGallery(_id);

            return response(res, 200, {
                message: 'Get Product Gallery Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async getMainImagesProduct(req, res, next) {
        try {
            const _id = req.params.id;
            const result = await ProductRepository.getProductMainImage(_id);

            return response(res, 200, {
                message: 'Get Product Main Image Successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }


    async addComment(req, res, next) {
        try {
            const productId = req.params.id;
            const user = req._id;
            const {
                comment,
                userName,
                rating
            } = req.body;



            const commentData = {
                comment,
                userName,
                rating,
                user
            };

            const result = await ProductRepository.addComment(productId, commentData);


            return response(res, 200, {
                message: 'Comment added successfully'
            });
        } catch (error) {
            next(error)
        }
    }
    async deleteComment(req, res, next) {
        try {
            const productId = req.params.id;
            const {
                commentId,
            } = req.body;


            const result = await ProductRepository.deleteComment(productId, commentId);
            return response(res, 200, {
                message: 'Comment deleted successfully'
            });
        } catch (error) {
            next(error)
        }
    }
    async getAllComments(req, res, next) {
        try {
            const productId = req.params.id;
            const comments = await ProductRepository.getAllComments(productId);

            return response(res, 200, {
                message: "Get All Comment Successfully",
                result: comments
            });

        } catch (error) {
            next(error)
        }
    }
    async getCommentById(req, res, next) {
        try {
            const productId = req.params.id
            const {
                commentId
            } = req.body;

            const comment = await ProductRepository.getCommentById(productId, commentId);

            return response(res, 200, {
                message: 'Get Comment Successfully',
                result: comment,
            });
        } catch (error) {
            next(error)
        }
    }
    async getProductsByActiveOffers(req, res, next) {
        try {

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;
            const products = await ProductRepository.getProductsByActiveOffers(parseInt(offset));

            return response(res, 200, {
                message: 'Products with Active Offers retrieved successfully',
                result: products,
            });
        } catch (error) {
            next(error)
        }
    }
    async getAllProducts(req, res, next) {
        try {
            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;
            const result = await ProductRepository.getProductsByQuery({}, offset);

            return response(res, 200, {
                message: 'Products retrieved successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async getProductsByCategory(req, res, next) {
        try {

            const query = {
                category: req.query.category,
            };
            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const result = await ProductRepository.getProductsByQuery(query, offset);

            return response(res, 200, {
                message: 'Products retrieved successfully',
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }

    async getProductsByMetalType(req, res, next) {
        try {

            const query = {
                metalType: req.query.MetalType,
            };
            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;


            const result = await ProductRepository.getProductsByQuery(query, offset);

            return response(res, 200, {
                message: 'Products retrieved successfully',
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
            const products = await ProductRepository.Search({
                name: value,
                offset
            });
            return response(res, 200, {
                message: "Get Data Successfully",
                result: products
            })
        } catch (error) {
            next(error)
        }
    }
    async advancedSearch(req, res, next) {
        try {
            const {
                name,
                metalType,
                price,
                category,
                customizable,
                writableOnFace,
                writableOnBack,
                addableImage,
            } = req.query;

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const products = await ProductRepository.advancedSearch({
                name,
                metalType,
                price,
                category,
                customizable,
                writableOnFace,
                writableOnBack,
                addableImage,
                offset,
            });
            return response(res, 200, {
                message: "Get Data Successfully",
                result: products
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new ProductController();