const wishListRepository = require("../../repositories/wishListRepositories/wishList");
const response = require("../../utils/response")


class WishListController {


    async addProductToWishList(req, res, next) {
        try {
            const user_id = req._id;
            const {
                productId
            } = req.body;

            const result = await wishListRepository.addProductToWishList({
                user_id,
                product_id: productId
            });
            return response(res, 200, {
                message: "Add Product to Wishlist Successfully",
                result
            });
        } catch (error) {
            next(error)
        }
    }


    async removeProductFromWishList(req, res, next) {
        try {
            const user_id = req._id;
            const {
                productId
            } = req.body;

            const removedProduct = await wishListRepository.removeProductFromWishList({
                user_id,
                productId
            });

            return response(res, 200, {
                message: "Remove Product from WishList Successfully"
            })
        } catch (error) {
            next(error)
        }
    }



    async getUserWishList(req, res, next) {
        try {
            const user_id = req._id;

            const result = await wishListRepository.getWishListUser(user_id);
            return response(res, 200, {
                message: "Get User wishList Successfully",
                result
            })
        } catch (error) {
            next(error)
        }


    }

    async deleteWishListByUserID(req, res, next) {
        try {
            const userID = req._id;

            const result = await wishListRepository.deleteWishListByUserID(userID);

            return response(res, 200, {
                message: "Delete User wishlist Successfully"
            });
        } catch (error) {
            next(error)
        }
    }




}
module.exports = new WishListController();