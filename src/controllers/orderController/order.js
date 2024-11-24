const OrderRepository = require("../../repositories/orderRepositories/order");
const response = require("../../utils/response")

class OrderController {


    async addOrder(req, res,next) {
        try {
            const {
                _id: user
            } = req;
            const {
                userInfo,
                shippingAddress,
                couponName
            } = req.body;

            const result = await OrderRepository.addOrder({
                user,
                userInfo,
                shippingAddress,
                couponName
            });
           
                return response(res, 200, {
                    message: "Add Order Successfully",
                    result
                });
        } catch (error) {
           next(error)
        }
    }
    async getOrderById(req, res,next) {
        try {
            const {
                id
            } = req.params;
            const result = await OrderRepository.getOrderById(id);
          
                return response(res, 200, {
                    message: "Get User Order Successfully",
                    result
                })
        } catch (error) {
            next(error)
         }
    }
    async getUserOrders(req, res,next) {
        try {
            const userID = req._id
            let result = await OrderRepository.getUserOrders(userID);
            return response(res, 200, {
                message: "Get User Orders Successfully",
                result
            });
        } catch (error) {
            next(error)
         }
    }

    async getBestSellingProduct(req, res,next) {
        try {

            let result = await OrderRepository.getBestSellingProduct();
            return response(res, 200, {
                message:  "Get Best Selling Product Successfully",
                result
            });

        } catch (error) {
            next(error)
         }


    }
    async getOrdersByStatus(req, res,next) {
        try {
            const result = await OrderRepository.getOrdersByStatus();
            return response(res, 200, {
                message: "Get Orders By Status Successfully",
                result
            });
        } catch (error) {
            next(error)
         }
    }
    
    async getAllOrders(req, res,next) {
        try {
            let result = await OrderRepository.getAllOrders();

            return response(res, 200, {
                message: "Get All Orders Successfully",
                result
            });
        } catch (error) {
            next(error)
         }
    }
    async getTotalQuantitySold(req, res,next) {
        try {

            let result = await OrderRepository.getTotalQuantitySold();
            return response(res,200,{message:"Get Total Quantity Sold Successfully",result})

        } catch (error) {
            next(error)
         }
    }
    async getSalesByProductCategory(req, res,next) {
        try {
            let result = await OrderRepository.getSalesByProductCategory();
            return response(res,200,{message:"Get Sales By Product Category Successfully",result})

        } catch (error) {
            next(error)
         }
    }
    async ChangeOrderStatus(req, res,next) {
        try {
            const {
                id,
                status
            } = req.body;
            const result = await OrderRepository.ChangeOrderStatus({
                id,
                status
            });
            return response(res, 200, {
                message: "Change Order Status Successfully",
                result
            })
        } catch (error) {
            next(error)
         }
    }

    async advancedSearch(req, res,next) {
        try {
            let limit = 10;

            let offset = 0 + (req.query.page - 1) * limit; 

            const {
                firstName,
                lastName,
                email,
                phone,
                status,
                totalPrice,
                country,
                city,
                region,
                streetNumber,
                houseNumber,
                paymentMethod,
            } = req.query;
            const orders = await OrderRepository.advancedSearch({
                offset,
                firstName,
                lastName,
                email,
                phone,
                status,
                totalPrice,
                country,
                city,
                region,
                streetNumber,
                houseNumber,
                paymentMethod,
            });
            return response(res, 200, {
                message: "Get Data Successfully",
                result: orders
            })
        } catch (error) {
            next(error)
         }
    }
}
module.exports = new OrderController();