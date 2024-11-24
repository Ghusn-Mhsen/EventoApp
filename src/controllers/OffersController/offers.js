const ProductRepository = require("../../repositories/productRepository/product");
const response = require("../../utils/response");
const CustomError = require('../../ErrorHandler/customError');
const statusCode = require('../../ErrorHandler/statusCode');

class OffersController {


    async addOffer(req, res, next) {
        try {
            const {
                endDateOfOffers,
                startDateOfOffers,
                valueOfOffer,
                typeOfOffer,
                productsIds
            } = req.body;



            const results = await ProductRepository.addOffer({
                productsIds,
                endDateOfOffers,
                startDateOfOffers,
                valueOfOffer,
                typeOfOffer
            });
            return response(res, 200, {
                message: "Add Offer Successfully"
            });

        } catch (error) {
            next(error)
        }
    };

    async deleteOffer(req, res, next) {
        try {
            const {
                productId,
                offerId
            } = req.body;

            const result = await ProductRepository.deleteOffer(productId, offerId);
            return response(res, 200, {
                message: 'Offer deleted successfully'
            });

        } catch (error) {
            next(error)
        }
    }
    async updateOffer(req, res, next) {
        try {
            const productId = req.params.id
            const {
                offerId,
                endDateOfOffers,
                startDateOfOffers,
                valueOfOffer,
                typeOfOffer,
                active
            } = req.body;

            const updatedData = {
                valueOfOffer,
                typeOfOffer,
                startDateOfOffers,
                endDateOfOffers,
                active
            };

            const result = await ProductRepository.updateOffer(productId, offerId, updatedData);
            return response(res, 200, {
                message: 'Offer updated successfully'
            });
        } catch (error) {
            next(error)
        }
    }


    async updateOfferActive(req, res, next) {
        try {

            const productId = req.params.id
            const {
                offerId,
                newActiveValue
            } = req.body;


            const updatedProduct = await ProductRepository.updateOfferActive(productId, offerId, newActiveValue);
            return response(res, 200, {
                message: 'Offer active status updated successfully',
                result: updatedProduct
            });
        } catch (error) {
            next(error)
        }
    }


    async getOffers(req, res, next) {
        try {
            const productId = req.params.id;


            const offersArray = await ProductRepository.getOffersInProduct(productId);
                return response(res, 200, {
                    message: 'get Offer successfully',
                    result: offersArray
                });
            
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new OffersController();