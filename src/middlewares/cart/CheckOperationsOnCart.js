const Cart = require("../../models/cart/cart");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

module.exports = async (req, res, next) => {
    try {
        const userId = req._id;
        const {
            randomNumber,
            operation
        } = req.body;
        const allowedOperation = ['ADD', 'SUB'];
        if (!allowedOperation.includes(operation)) {
            throw new CustomError('Invalid operation type. Only ADD and SUB are allowed.', statusCode.BadRequest)
        }

        // Find the cart for the current user
        let cart = await Cart.findOne({
            user: userId
        });
        if (!cart) {
            throw new CustomError('User Do Not Have Cart!', statusCode.NotFound)
        }

        // Find the item to be deleted
        const productIndex = cart.items.findIndex(item => item.randomNumber === parseInt(randomNumber));

        if (productIndex === -1) {
            throw new CustomError('Product not found in the cart', statusCode.NotFound)
        }
        // Decrement the quantity of the item
        if (operation === "SUB" && cart.items[productIndex].quantity === 0) {
            throw new CustomError('Can Not Decrement Below 0', statusCode.NotFound)
        }

        next();
    } catch (error) {
       next(error)
    }
};