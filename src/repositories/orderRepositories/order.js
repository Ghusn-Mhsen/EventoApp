const Order = require("../../models/Order/Order");
const InfluencerCoupon = require("../../models/influencerCoupon/influencerCoupon");
const Cart = require("../../models/cart/cart");
const Product = require("../../models/product/product");
const ProductRepositories = require("../../repositories/productRepository/product");
const DeleveryRepositories = require("../../repositories/DeleveryRepositories/delevery");
const cartRepositories = require("../../repositories/cartRepositories/cart");
const CouponRepositories = require("../../repositories/CouponRepositories/coupon");
const mongoose = require("mongoose");
const updatePrice = require("../../utils/product/updatePrice")
const sendEmail = require("../../utils/send_mail");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')


class OrderRepository {


    async addOrder({
        user,
        userInfo,
        shippingAddress,
        couponName
    }) {
        try {
            const items = await this.getCartItems(user);

            const { totalPrice, mainTotalPrice, initTotalPrice } = await this.calculateTotalPrice(items);


            const deleveryCost = await DeleveryRepositories.getCost(mainTotalPrice)

            const coupon = await this.handleCoupon(couponName, totalPrice, initTotalPrice, user);

            const newPrice = coupon ? coupon.priceAfterCoupon : totalPrice;

            const order = new Order({
                user,
                userInfo,
                items,
                totalPrice: newPrice,
                shippingAddress,
                deleveryCost
            });

            await order.save();

            await cartRepositories.deleteUserCart(user);

            if (coupon) {
                const {
                    _id
                } = order;
                const data = {
                    ...coupon,
                    order: _id
                };

                const influencerCoupon = new InfluencerCoupon(data);
                await influencerCoupon.save();
            }

            return order;
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }

    async getOrderById(orderID) {
        try {
            const order = await Order.findById({
                _id: orderID,
            }).populate("items.product").populate("user");

            if (!order) {
                throw new CustomError("Order Not Found", statusCode.NotFound)
            }
            return order;
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async handleCoupon(couponName, totalPrice, initTotalPrice, user) {
        try {
            if (couponName) {
                const validCoupon = await CouponRepositories.getCouponByName(couponName);

                if (!validCoupon) {
                    throw new CustomError('coupon Not found.', statusCode.NotFound)
                }

                
                const discount = (totalPrice * (validCoupon.CouponPercentage || 0)) / 100;

               
                validCoupon.usedNumber += 1;
                await validCoupon.save();

                const newTotalPrice = totalPrice - discount;
                const merchantMoney = newTotalPrice - initTotalPrice;

                const influencerMoney = validCoupon.fromTotalPrice ? (initTotalPrice * (validCoupon.influencerPercentage || 0)) / 100
                : (merchantMoney * (validCoupon.influencerPercentage || 0)) / 100;

                
                const {
                    _id,
                    influencer
                } = validCoupon;
                const data = {
                    couponName,
                    coupon: _id,
                    influencer,
                    user,
                    priceAfterCoupon: newTotalPrice,
                    priceBeforeCoupon: totalPrice,
                    initTotalPrice,
                    merchantMoney,
                    influencerMoney,
                };
                return data;
            }
            return null;
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getUserOrders(userID) {
        try {
            const orders = await Order.find({
                user: userID,
            }).select({
                items: 0,
            });

            return orders || [];
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getAllOrders() {
        try {
            let totalPrice = 0;
            const orders = await Order.find({}, {
                items: 0
            });

            totalPrice = orders.reduce((total, item) => total + item.totalPrice, 0);

            return {
                orders,
                totalPrice
            };
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async calculateTotalPrice(items) {
        try {
            if (!items || !Array.isArray(items)) {
                throw new CustomError('Invalid  items array', statusCode.BadRequest);
            }

            let totalPrice = 0;
            let mainTotalPrice = 0;
            let initTotalPrice = 0;

            for (const item of items) {
                const product = await Product.findById(item.product);
                const updatedProduct = updatePrice(product);


                // Calculate totalPrice with offers 
                const itemPrice = updatedProduct.priceAfterOffer ?? updatedProduct.price;
                totalPrice += item.quantity * itemPrice;


                // Calculate totalPrice without offers
                const itemMainPrice = updatedProduct.price;
                mainTotalPrice += item.quantity * itemMainPrice;


                // Calculate totalPrice for merchant Real Price
                const itemInitPrice = updatedProduct.initPrice;
                initTotalPrice += item.quantity * itemInitPrice;
            }

            return { totalPrice, mainTotalPrice, initTotalPrice };
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }

    async getBestSellingProduct() {

        try {
            const result = await Order.aggregate([{
                $unwind: "$items",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantitySold: {
                        $sum: "$items.quantity",
                    },
                },
            },
            {
                $sort: {
                    totalQuantitySold: -1,
                },
            },
            ]);

            const orders = Promise.all(
                result.map(async (item) => {
                    const product = await ProductRepositories.getProductByID(item._id);
                    const updatedProduct = updatePrice(product);
                    const {
                        priceAfterOffer
                    } = updatedProduct;
                    return {
                        product,
                        priceAfterOffer
                    }
                })
            );
            return orders || []
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getCartItems(userID) {
        try {
            const cart = await Cart.findOne({
                user: userID
            }).select("items");

            if (!cart) {
                return [];
            }

            const updatedItems = await Promise.all(
                cart.items.map(async (item) => {
                    const productID = item.product;
                    const price = await this.getProductPrice({
                        productId: productID
                    });
                    const {
                        product,
                        randomNumber,
                        quantity,
                        _id,
                        addableImage,
                        customizable,
                        writableOnBack,
                        writableOnFace,
                        note
                    } = item;

                    return {
                        product,
                        randomNumber,
                        quantity,
                        _id,
                        addableImage,
                        customizable,
                        writableOnBack,
                        writableOnFace,
                        note,
                        price
                    }
                })
            );

            return updatedItems || [];
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async ChangeOrderStatus({
        id,
        status
    }) {
        try {
            const order = await Order.findById(id);
            const currentTime = new Date();
            const formattedTime = currentTime.toISOString().substring(0, 10);
            const subject = "Order Status : ";
            const message = `Your Order is : ${status} at : ${formattedTime}`;
            const email = order.userInfo.email

            if (!order) {
                throw new CustomError("Order not found", statusCode.NotFound);
            }

            const setObj = await this.getStatus(id, status, email, subject, message);

            if (!setObj) {
                throw new CustomError("Cannot cancel this order", statusCode.BadRequest);
            }

            await Order.updateMany({
                _id: id
            }, {
                $set: setObj
            });

            return await this.getOrderById(id);
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getStatus(id, status, email, subject, message) {
        try {
            const obj = {};
            switch (status) {
                case "pending":
                    obj.status = "pending";
                    break;
                case "processing":
                    obj.status = "processing";
                    break;
                case "shipped":
                    obj.status = "shipped";
                    await this.updateShippingDate({
                        id
                    });
                    break;
                case "completed":
                    obj.status = "completed";
                    const respondEmail = await sendEmail(email, subject, message);
                    if (!respondEmail) {
                        throw new CustomError(`Invalid email address: ${email}`, statusCode.BadRequest)
                    }

                    break;
                case "cancelled":
                    const order = await this.getOrderById(id);
                    if (!order) {
                        throw new CustomError("Order not found", statusCode.NotFound);
                    }
                    if (order.status === "pending") {
                        obj.status = "cancelled";
                        break;
                    }
                    return null;
                default:
                    throw new CustomError(`Unsupported status: ${status}`, statusCode.NotFound);
            }
            return obj;
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async updateShippingDate({
        id
    }) {
        try {
            const now = new Date();
            await Order.updateMany({
                _id: id
            }, {
                $set: {
                    shippingDate: now,
                },
            });
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getProductPrice({
        productId
    }) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                throw CustomError("Product not Found", statusCode.NotFound)
            }

            return updatePrice(product).priceAfterOffer ?? product.price;
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    matchMerchant(owner_id) {
        try {
            return owner_id ? {
                "products.owner_id": new mongoose.Types.ObjectId(owner_id)
            } : {};
        } catch{
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    matchProductsOwner(owner_id) {
        try {
            return owner_id ? {
                owner_id: owner_id
            } : {};
        } catch (error) {

            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async advancedSearch({
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
    }) {
        try {
            // Build the base query
            let query = Order.find();

            // Define conditions object for filtering
            const conditions = {};

            // Add filters for userInfo
            if (firstName) conditions["userInfo.firstName"] = new RegExp(firstName, "i");
            if (lastName) conditions["userInfo.lastName"] = new RegExp(lastName, "i");
            if (email) conditions["userInfo.email"] = email;
            if (phone) conditions["userInfo.phone"] = phone;

            // Add filters for shippingAddress
            if (country) conditions["shippingAddress.country"] = new RegExp(country, "i");
            if (city) conditions["shippingAddress.city"] = new RegExp(city, "i");
            if (region) conditions["shippingAddress.region"] = new RegExp(region, "i");
            if (houseNumber) conditions["shippingAddress.houseNumber"] = houseNumber;
            if (streetNumber) conditions["shippingAddress.streetNumber"] = streetNumber;

            // Add filters for status, totalPrice, paymentMethod
            if (status) conditions["status"] = status;
            if (paymentMethod) conditions["paymentMethod"] = paymentMethod;
            if (totalPrice) conditions["totalPrice"] = {
                $gte: totalPrice
            };

            // Apply conditions to the query
            query.where(conditions);

            // Execute the query
            const results = await query.skip(offset).limit(10).exec();
            return results || [];
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getOrdersByStatus() {
        try {
            const result = await Order.aggregate([{
                $unwind: "$items",
            },
            {
                $group: {
                    _id: "$status",
                    orders: {
                        $addToSet: {
                            _id: "$_id",
                            userInfo: "$userInfo",
                            status: "$status",
                            totalPrice: "$totalPrice",
                            shippingAddress: "$shippingAddress",
                            paymentMethod: "$paymentMethod",
                            shippingDate: "$shippingDate",
                        },
                    },
                },
            },
            ]);

            return result || [];
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getTotalQuantitySold() {
        try {
            const orders = await Order.find({});

            const totalQuantitySold = orders.reduce((acc, order) => {
                const orderQuantity = order.items.reduce((acc2, product) => acc2 + product.quantity, 0);
                return acc + orderQuantity;
            }, 0);

            return totalQuantitySold || [];
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
    async getSalesByProductCategory() {
        try {
            const orders = await Order.find({});
            const salesByCategory = {};

            for (const order of orders) {
                for (const item of order.items) {
                    const product = await Product.findById(item.product);
                    const category = product.category;

                    if (!salesByCategory[category]) {
                        salesByCategory[category] = 0;
                    }

                    const itemSales = item.quantity * item.price;
                    salesByCategory[category] += itemSales;
                }
            }

            return salesByCategory || {};
        } catch (error) {
            throw new CustomError(error.message, error.ststatusCode);
        }
    }
}

module.exports = new OrderRepository();