const Cart = require("../../models/cart/cart");
const Product = require("../../models/product/product");
const updatePrice = require("../../utils/product/updatePrice");
const mongoose = require('mongoose');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class cartRepository {
    async addToCart({
        userId,
        productId,
        randomNumber
    }) {
        try {


            const cart = await Cart.findOne({
                user: userId
            });

            // Get the product price
            const price = await this.getProductPrice({
                productId
            });
            // If the user's cart doesn't exist, create a new cart
            if (!cart) {

                const newItem = {
                    product: productId,
                    randomNumber
                };

                const newCart = await Cart.create({
                    user: userId,
                    items: [newItem],
                    totalCost: price,
                });

                return newCart;
            }

            // Add a new product to the existing cart
            const newProduct = {
                product: productId,
                randomNumber
            };
            cart.items.push(newProduct);

            // Recalculate the total price
            cart.totalCost = await this.RecalculateTotal(cart.items);

            // Save the updated cart
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getProductByRandomNumber(userId, randomNumber) {
        try {
            const cart = await Cart.findOne({
                user: userId,
            })
                .select({
                    items: {
                        $elemMatch: {
                            randomNumber: randomNumber
                        }
                    }
                })
                .exec();

            if (!cart) {
                throw new CustomError('Cart not found', statusCode.NotFound);
            }

            if (!cart.items || cart.items.length === 0) {
                throw new CustomError('no Products in the cart', statusCode.NotFound);
            }

            return cart.items[0];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async addInfoProductToCart(userId, randomNumber, data) {
        try {
            const cart = await this.getCartByUserId(userId);

            if (!cart) {
                throw new CustomError('Cart not found', statusCode.NotFound);
            }
            const productIndex = cart.items.findIndex(item => item.randomNumber === parseInt(randomNumber));

            if (productIndex === -1) {
                throw new CustomError('Product not found in the cart', statusCode.NotFound);
            }

            const item = cart.items[productIndex];
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key) && key in item) {
                    item[key] = data[key];
                }
            }

            await cart.save();

            return cart.items[productIndex];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getCartByUserId(userId) {
        try {
            const cart = await Cart.findOne({
                user: userId
            });
            if (!cart) {
                throw new CustomError('Cart not found', statusCode.NotFound);
            }
            return cart;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getProductPrice({
        productId,
    }) {
        try {
            if (!productId) {
                throw new CustomError('ProductId is required',statusCode.BadRequest);
            }
            const productObjectId = new mongoose.Types.ObjectId(productId);

            let product = await Product.findById(productObjectId);

            if (!product) {
                throw new CustomError('Product not found',statusCode.NotFound);
            }

            // Update the product price using the updatePrice function
            product = updatePrice(product);

            return product.priceAfterOffer ?? product.price;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async RecalculateTotal(items) {
        try {
            if (!items || !Array.isArray(items)) {
                throw new CustomError('Invalid  items array',statusCode.BadRequest);
            }

            let total = 0;

            for (const item of items) {
                const product = await Product.findById(item.product);
                const updatedProduct = updatePrice(product);

                const itemPrice = updatedProduct.priceAfterOffer ?? updatedProduct.price;
                total += item.quantity * itemPrice;
            }

            return total;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async operationOnItemByOne({
        userId,
        randomNumber,
        operation
    }) {
        try {

            let cart = await Cart.findOne({
                user: userId
            });
            if (!cart) {

                throw new CustomError('Cart not found', statusCode.NotFound);
            }

            const productIndex = cart.items.findIndex(item => item.randomNumber === parseInt(randomNumber));
            if (productIndex === -1) {
                throw new CustomError('Product not found in the cart', statusCode.NotFound);
            }
            // Increment or decrement the quantity based on the 'increment' flag
            if (operation === 'ADD') {
                cart.items[productIndex].quantity += 1;
            } else if (operation === 'SUB') {
                cart.items[productIndex].quantity -= 1;
            }

            // Remove the item from the cart if the quantity is less than or equal to 0
            if (cart.items[productIndex].quantity <= 0) {
                cart.items.splice(productIndex, 1);
            }


            // Recalculate Total price
            cart.totalCost = await this.RecalculateTotal(cart.items);

            return await cart.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async deleteProductFromCart({
        userId,
        randomNumber
    }) {
        try {
            const cart = await Cart.findOne({
                user: userId
            });


            if (!cart) {
                throw new CustomError('User Cart not found', statusCode.NotFound);
            }
            const productIndex = cart.items.findIndex(item => item.randomNumber === parseInt(randomNumber));

            if (productIndex === -1) {
                throw new CustomError('Product not found in the cart', statusCode.NotFound);
            }

            // Delete item from user Cart
            cart.items.splice(productIndex, 1);

            // Recalculate Total price
            cart.totalCost = await this.RecalculateTotal(cart.items);

            return await cart.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async deleteUserCart(userId) {
        try {
            const { deletedCount } = await Cart.deleteOne({
                user: userId,
            });

            if (!deletedCount || deletedCount <= 0) {

                throw new CustomError('No cart found for this user', statusCode.NotFound);
            }

            return deletedCount
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async getUserCart(userId) {
        try {
            // Find the cart for the current user
            let cart = await Cart.findOne({
                user: userId
            }).populate("items.product").populate("user");

            // Check if the user cart exists
            if (!cart) {
                throw new CustomError('User Cart not found', statusCode.NotFound);
            }
            const newResult = this.extractProductData(cart);
            // Calculate total price
            const totalPrice = await this.RecalculateTotal(cart.items);

            return {
                ...newResult,
                totalPrice
            };
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    extractProductData(cart) {
        try {
            const {
                user,
                _id,
                items
            } = cart
            const result = items.map(product => {
                const {
                    randomNumber,
                    quantity
                } = product
                const {
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
                    mainImage,
                    owner_id,
                    offers,
                    updatedAt,
                    createdAt,
                    galleryImages,
                    comments
                } = product.product;

                const {
                    priceAfterOffer
                } = updatePrice(product.product);

                return {
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
                    mainImage,
                    owner_id,
                    offers,
                    updatedAt,
                    createdAt,
                    galleryImages,
                    comments,
                    priceAfterOffer,
                    randomNumber,
                    quantity
                };
            });
            return {
                _id,
                user,
                result
            };
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }

}
module.exports = new cartRepository();