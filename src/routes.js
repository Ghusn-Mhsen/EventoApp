//Package
const express = require("express");
const router = express.Router();


// Controller
const userController = require("./controllers/userController/user");
const productController = require("./controllers/productController/product")
const categoryControllers = require("./controllers/categoryController/category")
const OffersController = require("./controllers/OffersController/offers")
const WishListController = require("./controllers/wishListController/wishList");
const CartController = require("./controllers/cartController/cart");
const OrderController = require("./controllers/orderController/order")
const DisputeController = require("./controllers/DisputeController/dispute")
const BannerController = require("./controllers/bannersController/banners")
const testimonialController = require("./controllers/testimonialController/testimonial")
const AboutController = require("./controllers/AboutController/about")
const SocialController = require("./controllers/SocialController/social")
const NotificationController = require("./controllers/notificationController/notification")
const InfluencerController = require("./controllers/influencerController/influencer")
const CouponController = require("./controllers/CouponController/Coupon")
const InfluencerCoupon = require("./controllers/InfluencerCouponController/InfluencerCoupon")
const DeleveryController = require("./controllers/DeleveryController/delevery")

//MiddleWare
const authMiddleWare = require("./middlewares/auth/auth");
const checkRole = require("./middlewares/auth/checkRole");
const { uploadMainImage, uploadGalleries,uploadSingleGalleries,uploadCategoryImage, uploadCartImage, uploadDisputeImage, uploadBannerImage, uploadSocialImage } = require("./middlewares/uploadImages");
const { deleteMainImage, deleteGalleryImages,deleteSingleGalleryImage,deleteDisputeImage, deleteBannerImage } = require("./middlewares/product/deleteImage");
const { deleteCategoryImage } = require("./middlewares/category/category");
const { deleteSocialImage } = require("./middlewares/social/deleteImage");
const checkDateOffer = require("./middlewares/offers/checkDate");
const CheckOperationsOnCart = require("./middlewares/cart/CheckOperationsOnCart");
const CheckChangeStatus = require("./middlewares/order/CheckChangeStatus");
const checkDisputeStatus = require("./middlewares/Dispute/dispute")
const { downloadFile } = require("./utils/fileManagement")
const checkCategoryExistence = require("./middlewares/category/checkCategoryExistence");
const checkDeletedComment = require("./middlewares/product/checkDeletedComment");
const couponValidationMiddleware = require("./middlewares/coupon/coupon");

// Validations
const schemas = require('./validations/schemas');
const validation = require('./validations/validationMiddleware');





//User
router.post("/user/register", validation(schemas.validateUser, 'body'), userController.register);
router.post("/superAdmin/addAdminOrManufacturer", authMiddleWare, validation(schemas.validateAdmin_Manufacturer, 'body'), checkRole, userController.addAdminOrManufacturer);
router.delete("/superAdmin/deleteUser/:id", authMiddleWare, validation(schemas.validateId, 'params'), userController.deleteUser)
router.post("/user/resendOTP", validation(schemas.validateEmail, 'body'), userController.ResendOTP)
router.post("/user/verify", validation(schemas.validateVerifyEmail, 'body'), userController.VerifyEmail)
router.post("/user/login", validation(schemas.validateAdmin, 'body'), userController.login)
router.post("/user/ForgetPassword", validation(schemas.validateForgetPassword, 'body'), userController.ChangePassword)
router.post("/user/logout", authMiddleWare, userController.logout)
router.get("/user/getUserByID", authMiddleWare, userController.getUserByID)
router.put("/user/updateUser", authMiddleWare, validation(schemas.validateUpdateUser, 'body'), userController.updateUser)
router.get("/admin/getAllUser", authMiddleWare, validation(schemas.validatePage, 'query'), userController.getAllUser)
router.get("/superAdmin/getAllAdmin", authMiddleWare, validation(schemas.validatePage, 'query'), userController.getAllAdmin)
router.get("/admin/getAllManufacturer", authMiddleWare, validation(schemas.validatePage, 'query'), userController.getAllManufacturer)




// Products 
router.post("/admin/addProduct", authMiddleWare, validation(schemas.validateProduct, 'body'), productController.addProduct)
router.put("/admin/updateProduct/:id", authMiddleWare, validation(schemas.validateProduct, 'body'), productController.updateProduct)
router.delete("/admin/deleteProduct/:id", validation(schemas.validateId, 'params'), deleteMainImage, deleteGalleryImages, authMiddleWare, productController.deleteProduct)
router.get("/user/getProductByID/:id", validation(schemas.validateId, 'params'), productController.getProductByID)
router.get("/user/getGallery/:id", validation(schemas.validateId, 'params'), productController.getGalleryImagesProduct)
router.get("/user/getMainImage/:id", validation(schemas.validateId, 'params'), productController.getMainImagesProduct)
router.post("/admin/addMainImageToProduct/:id", validation(schemas.validateId, 'params'), deleteMainImage, uploadMainImage, authMiddleWare, productController.addMainImageToProduct)
router.put("/admin/updateMainImage/:id", validation(schemas.validateId, 'params'), deleteMainImage, uploadMainImage, authMiddleWare, productController.addMainImageToProduct)
router.delete("/admin/deleteMainImage/:id", validation(schemas.validateId, 'params'), deleteMainImage, authMiddleWare, productController.deleteMainImage)
router.post("/admin/addGalleryToProduct/:id", validation(schemas.validateId, 'params'), deleteGalleryImages, uploadGalleries, authMiddleWare, productController.addGalleryToProduct)
router.put("/admin/updateGallery/:id", validation(schemas.validateId, 'params'), deleteGalleryImages,uploadGalleries,authMiddleWare, productController.addGalleryToProduct)
router.put("/admin/updateSingleGallery/:id",uploadSingleGalleries,deleteSingleGalleryImage,authMiddleWare,validation(schemas.validateId, 'params'), validation(schemas.validatePath,'body'),productController.updateSingleGallery)
router.delete("/admin/deleteGallery/:id", validation(schemas.validateId, 'params'), deleteGalleryImages, authMiddleWare, productController.deleteGalleryImages)
router.get("/user/getProductByMetalType", validation(schemas.validateMetalType, 'query'), productController.getProductsByMetalType)
router.get("/user/getAllProduct", validation(schemas.validatePage, 'query'), productController.getAllProducts)
router.get("/user/productSearch", validation(schemas.validateSearch, 'query'), productController.search)
router.get("/user/advancedSearch", validation(schemas.validateAdvancedSearch, 'query'), productController.advancedSearch)
router.get("/user/getProductsByActiveOffers", validation(schemas.validatePage, 'query'), productController.getProductsByActiveOffers)



// Category

router.post("/admin/addCategory", uploadCategoryImage, checkCategoryExistence, authMiddleWare, validation(schemas.validateCategoryName, 'body'), categoryControllers.addCategory)
router.put("/admin/updateCategory/:id", deleteCategoryImage, uploadCategoryImage, authMiddleWare, validation(schemas.validateId, 'params'), validation(schemas.validateCategoryName, 'body'), categoryControllers.updateCategory)
router.delete("/admin/deleteCategory/:id", validation(schemas.validateId, 'params'), deleteCategoryImage, authMiddleWare, categoryControllers.deleteCategory)
router.get("/user/getCategoryByID/:id", validation(schemas.validateId, 'params'), categoryControllers.getCategoryByID)
router.get("/user/getProductByCategory", validation(schemas.validateCategory, 'query'), productController.getProductsByCategory)
router.get("/user/categorySearch", validation(schemas.validateSearch, 'query'), categoryControllers.search)
router.get("/user/getALlCategory", categoryControllers.getAllCategory)



// Offers

router.post("/admin/addOffer", validation(schemas.validateOffer, 'body'), checkDateOffer, OffersController.addOffer);
router.delete("/admin/deleteOffer", validation(schemas.validateDeleteOffer, 'body'), OffersController.deleteOffer);
router.put("/admin/updateOffer/:id", validation(schemas.validateUpdateOffer, 'body'), validation(schemas.validateId, 'params'), checkDateOffer, authMiddleWare, OffersController.updateOffer);
router.put("/admin/updateOfferActive/:id", validation(schemas.updateOfferActive, 'body'), validation(schemas.validateId, 'params'), authMiddleWare, OffersController.updateOfferActive);
router.get("/user/getOffers/:id", validation(schemas.validateId, 'params'), OffersController.getOffers);


// Comments

router.post("/user/addComment/:id", validation(schemas.validateComment, 'body'), validation(schemas.validateId, 'params'), authMiddleWare, productController.addComment);
router.delete("/user/deleteComment/:id", validation(schemas.validateId, 'params'), validation(schemas.validatecommentId, 'body'), authMiddleWare, checkDeletedComment, productController.deleteComment);
router.get("/user/getComments/:id", validation(schemas.validateId, 'params'), productController.getAllComments);
router.get("/user/getCommentById/:id", validation(schemas.validateId, 'params'), validation(schemas.validatecommentId, 'body'), productController.getCommentById);



// wishList
router.post("/user/addToWishList", validation(schemas.validateproductId, 'body'), authMiddleWare, WishListController.addProductToWishList);
router.delete("/user/removeWishList", validation(schemas.validateproductId, 'body'), authMiddleWare, WishListController.removeProductFromWishList);
router.get("/user/getWishList", authMiddleWare, WishListController.getUserWishList);
router.delete("/user/deleteUserWishList", authMiddleWare, WishListController.deleteWishListByUserID);


// Cart
router.post('/user/addToCart', validation(schemas.validateproductId, 'body'), authMiddleWare, CartController.addProductToCart)
router.post('/user/addInfoProductToCart', uploadCartImage, authMiddleWare, validation(schemas.validateCartInfo, 'body'), CartController.addInfoProductToCart)
router.post('/user/addNoteToProduct', validation(schemas.validateProductNote, 'body'), authMiddleWare, CartController.addNoteToProduct)
router.put('/user/operationOnItem', validation(schemas.validateCartOperation, 'body'), authMiddleWare, CheckOperationsOnCart, CartController.operationOnItemByOne)
router.delete('/user/deleteProductFromCart', validation(schemas.validateCartRandomNumber, 'query'), authMiddleWare, CartController.deleteProductFromCart)
router.delete('/user/deleteUserCart', authMiddleWare, CartController.deleteUserCart)
router.get('/user/getUserCart', authMiddleWare, CartController.getUserCart)
router.get('/user/getCartproductByRandomNumber', authMiddleWare, validation(schemas.validateCartRandomNumber, 'body'), CartController.getProductByRandomNumber)




// Order

router.post('/user/addOrder', authMiddleWare, validation(schemas.validateOrder, 'body'), OrderController.addOrder)
router.get('/user/getOrderById/:id', authMiddleWare, validation(schemas.validateId, 'params'), OrderController.getOrderById)
router.get('/user/getUserOrders', authMiddleWare, OrderController.getUserOrders)
router.get('/admin/getAllOrders', authMiddleWare, OrderController.getAllOrders)
router.get('/user/advancedSearchOrder', authMiddleWare, validation(schemas.validateOrderAdvancedSearch, 'query'), OrderController.advancedSearch)
router.put('/customer/ChangeOrderStatus', authMiddleWare, validation(schemas.validateOrderStutas, 'body'), CheckChangeStatus, OrderController.ChangeOrderStatus)
router.put('/admin/ChangeOrderStatus', authMiddleWare, validation(schemas.validateOrderStutas, 'body'), CheckChangeStatus, OrderController.ChangeOrderStatus)
router.put('/manufacturer/ChangeOrderStatus', authMiddleWare, validation(schemas.validateOrderStutas, 'body'), CheckChangeStatus, OrderController.ChangeOrderStatus)
router.get('/admin/getOrdersByStatus', authMiddleWare, OrderController.getOrdersByStatus)
router.get('/admin/getBestSellingProduct', authMiddleWare, OrderController.getBestSellingProduct)
router.get('/admin/getTotalQuantitySold', authMiddleWare, OrderController.getTotalQuantitySold)
router.get('/admin/getSalesByProductCategory', authMiddleWare, OrderController.getSalesByProductCategory)





// Dispute

router.post('/user/addDispute', uploadDisputeImage, validation(schemas.validateDispute, 'body'), DisputeController.addDispute)
router.get('/user/getDispute/:id', authMiddleWare, validation(schemas.validateId, 'params'), DisputeController.getDispute)
router.delete('/admin/deleteDispute/:id', validation(schemas.validateId, 'params'), deleteDisputeImage, authMiddleWare, DisputeController.deleteDispute)
router.get('/user/searchDispute/', authMiddleWare, validation(schemas.validateDisputeMessage, 'query'), DisputeController.searchForDispute)
router.put('/admin/ChangeDisputeStatus/:id', checkDisputeStatus, authMiddleWare, validation(schemas.validateDisputeStutas, 'body'), DisputeController.ChangeDisputeStatus)
router.get('/admin/getAllDispute', authMiddleWare, validation(schemas.validatePage, 'query'), DisputeController.getAllDispute)
router.get('/user/getDisputesByEmail', authMiddleWare, validation(schemas.validateEmail, 'body'), DisputeController.getDisputesByEmail)



//Banners
router.post('/admin/addToBanner', uploadBannerImage, authMiddleWare, BannerController.createBanner)
router.get('/user/getBanners', BannerController.getBanners)
router.delete('/admin/deleteFromBanner/:id', deleteBannerImage, authMiddleWare, validation(schemas.validateId, 'params'), BannerController.deleteBanner)



// Testimonial
router.post('/admin/addTestimonial', validation(schemas.validateTestimonial, 'body'), testimonialController.addTestimonial)
router.get('/user/getAllTestimonials', validation(schemas.validatePage, 'query'), testimonialController.getAllTestimonials)
router.delete('/admin/deleteTestimonial/:id', authMiddleWare, validation(schemas.validateId, 'params'), testimonialController.deleteTestimonial)


// About Us
router.post('/admin/addAboutUs', authMiddleWare, validation(schemas.validateAboutUs, 'body'), AboutController.addAboutUs)
router.get('/user/getAboutUs', authMiddleWare, validation(schemas.validatePage, 'query'), AboutController.getAllAboutUs)
router.delete('/admin/deleteAboutUs/:id', authMiddleWare, validation(schemas.validateId, 'params'), AboutController.deleteAboutUs)
router.put('/admin/updateAboutUs/:id', authMiddleWare, validation(schemas.validateId, 'params'), validation(schemas.validateAboutUs, 'body'), AboutController.updateAboutUs)


// Social
router.post("/admin/addSocial", uploadSocialImage, authMiddleWare, validation(schemas.validateSocial, 'body'), SocialController.addSocial)
router.put("/admin/updateSocial/:id", validation(schemas.validateId, 'params'), deleteSocialImage, uploadSocialImage, authMiddleWare, validation(schemas.validateSocial, 'body'), SocialController.updateSocial)
router.delete("/admin/deleteSocial/:id", validation(schemas.validateId, 'params'), deleteSocialImage, authMiddleWare, SocialController.deleteSocial)
router.get("/user/getALlSocial", SocialController.getAllSocial)


// Notification
router.post('/admin/addNotification', validation(schemas.validateNotificatio, 'body'), NotificationController.addNotification)
router.get('/user/getAllNotifications', validation(schemas.validatePage, 'query'), NotificationController.getAllNotifications)
router.delete('/admin/deleteNotification/:id', authMiddleWare, validation(schemas.validateId, 'params'), NotificationController.deleteNotification)



// Delevery
router.post('/admin/addDelevery', authMiddleWare, validation(schemas.validateAddCost, 'body'), DeleveryController.addDeleverycost)
router.get('/admin/getDelevery', authMiddleWare, validation(schemas.validatePage, 'query'), DeleveryController.getAllDeleveryCost)
router.get('/admin/getDelevery/:id', authMiddleWare, validation(schemas.validateId, 'params'), DeleveryController.getDeleveryCostById)
router.get('/admin/getCost', authMiddleWare, validation(schemas.validateCost, 'body'), DeleveryController.getCost)
router.delete('/admin/deleteDelevery/:id', authMiddleWare, validation(schemas.validateId, 'params'), DeleveryController.deleteDeleveryCost)
router.put('/admin/updateDelevery/:id', authMiddleWare, validation(schemas.validateId, 'params'), validation(schemas.validateAddCost, 'body'), DeleveryController.updateDeleveryCost)



// Influencer

router.post("/admin/addInfluencer", authMiddleWare, validation(schemas.validateInfluencer, 'body'), InfluencerController.addInfluencer)
router.put("/admin/updateInfluencer/:id", authMiddleWare, validation(schemas.validateInfluencer, 'body'), InfluencerController.updateInfluencer)
router.delete("/admin/deleteInfluencer/:id", authMiddleWare, validation(schemas.validateId, 'params'), InfluencerController.deleteInfluencer)
router.get("/user/getInfluencerByID/:id", validation(schemas.validateId, 'params'), InfluencerController.getInfluencerById)
router.get("/user/getALlInfluencer", InfluencerController.getAllInfluencesSortedByRating)
router.post("/user/addRating/:id", authMiddleWare, validation(schemas.validateId, 'params'), validation(schemas.validateInfluencerRating, 'body'), InfluencerController.addRating);




// Coupon

router.post("/admin/addCoupon", authMiddleWare, validation(schemas.validateAddCoupon, 'body'), CouponController.addCoupon)
router.put("/admin/updateCoupon/:id", authMiddleWare, validation(schemas.validateId, 'params'), validation(schemas.validateAddCoupon, 'body'), CouponController.updateCoupon)
router.get("/admin/getCouponById/:id", authMiddleWare, validation(schemas.validateId, 'params'), CouponController.getCouponById)
router.get("/admin/getAllCoupon", authMiddleWare, CouponController.getAllCoupon)
router.get("/admin/getCouponByName", authMiddleWare, validation(schemas.validateInCouponName, 'body'), CouponController.getCouponByName)
router.get("/user/applyCoupon", authMiddleWare, validation(schemas.validateInCouponName, 'body'), couponValidationMiddleware, CouponController.getCouponByName)
router.put("/admin/activateCoupon/:id", authMiddleWare, validation(schemas.validateId, 'params'), CouponController.activateCoupon)
router.put("/admin/deactivateCoupon/:id", authMiddleWare, validation(schemas.validateId, 'params'), CouponController.deactivateCoupon)



// InfluencerCoupon

router.get("/admin/getAllInfluencerCoupons", authMiddleWare, validation(schemas.validatePage, 'query'), InfluencerCoupon.getAllInfluencerCoupons)
router.get("/admin/getInfluencerCouponsByCoupon", authMiddleWare, validation(schemas.validatePage, 'query'), validation(schemas.validateCouponId, 'body'), InfluencerCoupon.getInfluencerCouponsByCoupon)
router.get("/admin/getInfluencerCouponsByInfluencer", authMiddleWare, validation(schemas.validatePage, 'query'), validation(schemas.validateInfluncerId, 'body'), InfluencerCoupon.getInfluencerCouponsByInfluencer)
router.delete("/admin/deleteByInfluencerId", authMiddleWare,validation(schemas.validateInfluncerId, 'body'),InfluencerCoupon.deleteByInfluencerId)
router.get("/admin/searchByCouponName", validation(schemas.validatePage, 'query'), validation(schemas.validateCoupon, 'query'), InfluencerCoupon.searchByCouponName)




// Download File 

router.get("/user/download", validation(schemas.validateFileName, 'query'), downloadFile);


module.exports = router;
