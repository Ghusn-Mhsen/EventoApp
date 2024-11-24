const wishList = require("../../models/wishList/wishList");
const mongoose = require("mongoose")
const updatePrice = require("../../utils/product/updatePrice");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class WishListRepository {
    async addProductToWishList({
        user_id,
        product_id
    }) {
        try {
            const productId = new mongoose.Types.ObjectId(product_id);

            // Check if the user has a wishlist
            const existingWishList = await wishList.findOne({
                user_id
            });

            if (!existingWishList) {
                // If user doesn't have a wishlist, create a new one
                return await wishList.create({
                    user_id,
                    products: [productId],
                });
            } else {
                // Check if the product is already in the wishlist
                const productExists = await wishList.findOne({
                    user_id,
                    products: productId,
                });
                if (productExists) {
                    throw new CustomError("Failed to add product to wishlist, the product is already in the wishlist", statusCode.BadRequest)
                }
                // If the product is not in the wishlist, add it
                return await wishList.updateOne({
                    user_id,
                }, {
                    $push: {
                        products: productId
                    }
                })

            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async removeProductFromWishList({
        user_id,
        productId
    }) {
        try {
            "Failed to add product to wishlist, Product not found in the wishlist"
            const userWishList = await wishList.findOne({
                user_id
            });

            if (!userWishList) {
                throw new CustomError("User does not have a wishlist", statusCode.NotFound)
            }

            const { modifiedCount } = await wishList.updateOne({
                user_id,
            }, {
                $pull: {
                    products: productId
                }
            })
            if (!modifiedCount || modifiedCount <= 0) {
                throw new CustomError("Product not found in the wishlist", statusCode.NotFound)
            }

            return modifiedCount;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    extractProductData(wishListData) {
        try {
            const { user_id, _id, products } = wishListData
            const result = products.map(product => {
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
                } = product;

                const {
                    priceAfterOffer
                } = updatePrice(product);

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
                };
            });
            return { _id, user_id, result };
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }

    async getWishListUser(user_id) {
        try {
            const wishListData = await wishList.findOne({
                user_id
            }).populate('user_id').populate('products');
            if (!wishListData) {
                throw new CustomError("User wishlist not found", statusCode.NotFound)
            }
            const newResult = this.extractProductData(wishListData);

            return newResult || null;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }


    async deleteWishListByUserID(userId) {
        try {

            const user_id = new mongoose.Types.ObjectId(userId);

            const { deletedCount } = await wishList.deleteOne({ user_id });

            if (!deletedCount || deletedCount <= 0) {

                throw new CustomError("User wishlist not found", statusCode.NotFound)
            }
            return deletedCount;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

}

module.exports = new WishListRepository();