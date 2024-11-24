const CartRepository = require("../../repositories/cartRepositories/cart");
const response = require("../../utils/response")
const generateRandomNumber = require("../../utils/generateRandomNumber");


class CartController {


    async addProductToCart(req, res, next) {
        try {
            const userId = req._id;
            const {
                productId
            } = req.body;

            // Generate a random number with 10 digits
            const randomNumber = generateRandomNumber();

            const cart = await CartRepository.addToCart({
                userId,
                productId,
                randomNumber
            });
            return response(res, 200, {
                message: "Add Product to Cart Successfully"
            })


        } catch (error) {
            next(error)
        }
    }
    async addInfoProductToCart(req, res, next) {
        try {
            const userId = req._id;
            const {
                data,
                randomNumber
            } = req.body;
            const {
                cartImage
            } = req.files;


            if (cartImage) {
                data.addableImage = `cart/${cartImage[0].filename}`;
            }

            const result = await CartRepository.addInfoProductToCart(userId, randomNumber, data);
            return response(res, 200, {
                message: "Product information added to cart successfully",
                result: result,
            });
        }
        catch (error) {
            next(error)
        }
    }
    async addNoteToProduct(req, res, next) {
        try {
            const userId = req._id;
            const {
                data,
                randomNumber
            } = req.body;

            const result = await CartRepository.addInfoProductToCart(userId, randomNumber, data);

            return response(res, 200, {
                message: "Product information added to cart successfully",
                result: result,
            });

        } catch (error) {
            next(error)
        }
    }
    async deleteProductFromCart(req, res, next) {
        try {
            const userId = req._id;
            const {
                randomNumber,
            } = req.query;

            const result = await CartRepository.deleteProductFromCart({
                userId,
                randomNumber
            });
            return response(res, 200, {
                message: "Delete Product from Cart Successfully",
                result: result,
            });

        } catch (error) {
            next(error)
        }
    }
    async operationOnItemByOne(req, res, next) {
        try {
            const userId = req._id;
            const {
                randomNumber,
                operation
            } = req.body;

            const product = await CartRepository.operationOnItemByOne({
                userId,
                randomNumber,
                operation

            });
            return response(res,200,{
                message: "Operation Done on Product Successfully",
                result: product

            })

        } catch (error) {
            next(error)
        }
    }
    async getUserCart(req, res, next) {
        try {
            const userId = req._id;
            const cart = await CartRepository.getUserCart(userId);
                return response(res, 200, {
                    message: "Get User Cart Successfully",
                    result: cart
                })
        } catch (error) {
            next(error)
        }
    }
    async getProductByRandomNumber(req, res, next) {
        try {
            const userId = req._id;
            const {randomNumber} = req.body
            const product = await CartRepository.getProductByRandomNumber(userId,randomNumber);
                return response(res, 200, {
                    message: "Get product by random number Successfully",
                    result: product
                })
        } catch (error) {
            next(error)
        }
    }
    async deleteUserCart(req, res, next) {
        try {
            const userId = req._id;
            const result = await CartRepository.deleteUserCart(userId);
            if (result)
                return response(res, 200, {
                    message: "Delete User Cart Successfully"
                })

        } catch (error) {
            next(error)
        }
    }
}
module.exports = new CartController();