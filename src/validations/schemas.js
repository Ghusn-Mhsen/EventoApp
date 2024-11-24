const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const schemas = {

    // User Validate
    validateUser: Joi.object({
        username: Joi.string().required().min(3).max(15).alphanum(),
        password: Joi.string().min(6).max(20).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
    }),
    validateAdmin_Manufacturer: Joi.object({
        username: Joi.string().required().min(3).max(15).alphanum(),
        password: Joi.string().min(6).max(20).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        role: Joi.string().required().valid('manufacturer', 'admin')
    }),
    validateEmail: Joi.object({
        email: Joi.string().email().required()
    }),

    validateVerifyEmail: Joi.object({
        email: Joi.string().email().required(),
        otp_code: Joi.string().required().length(5)
    }),
    validateAdmin: Joi.object({
        password: Joi.string().min(6).max(20).required(),
        email: Joi.string().email().required(),
    }),
    validateForgetPassword: Joi.object({
        password: Joi.string().min(6).max(20).required(),
        email: Joi.string().email().required(),
        otp_code: Joi.string().required().length(5),
    }),
    validateUpdateUser: Joi.object({
        username: Joi.string().required().min(3).max(15).alphanum(),
        phone: Joi.string().required(),
    }),


    // Product Validate
    validateProduct: Joi.object({
        name: Joi.object({
            arabic: Joi.string().min(3).max(20).required(),
            english: Joi.string().min(3).max(20).required(),
        }).required(),
        description: Joi.object({
            arabic: Joi.string().min(3).max(20).required(),
            english: Joi.string().min(3).max(20).required(),
        }).required(),
        price: Joi.number().integer().greater(0).required(),
        initPrice:Joi.number().integer().greater(0).required(),
        metalType: Joi.string().min(3).max(20).required(),
        customizable: Joi.boolean().required(),
        category: Joi.string().min(3).max(20).required(),
        writableOnFace: Joi.boolean().required(),
        writableOnBack: Joi.boolean().required(),
        addableImage: Joi.boolean().required(),
    }),
    validateMetalType: Joi.object({
        MetalType: Joi.string().min(3).max(20).required(),
        page: Joi.number().integer().required().min(1),
    }),
    validatePath: Joi.object({
        oldPath: Joi.string().required()
       
    }),
    validateAdvancedSearch: Joi.object({
        name: Joi.string(),
        price: Joi.number(),
        metalType: Joi.string(),
        customizable: Joi.boolean(),
        category: Joi.string(),
        writableOnFace: Joi.boolean(),
        writableOnBack: Joi.boolean(),
        addableImage: Joi.boolean(),
    }),


    // Category Validate
    validateCategoryName: Joi.object({
        name: Joi.object({
            arabic: Joi.string().min(3).max(20).required(),
            english: Joi.string().min(3).max(20).required(),
        }).required(),
    }),
    validateId: Joi.object({
        id: Joi.objectId().required(),
    }),
    validateCategory: Joi.object({
        page: Joi.number().required().min(1),
        category: Joi.string().required(),
    }),
    validateSearch: Joi.object({
        page: Joi.number().integer().required().min(1),
        value: Joi.string().required(),
    }),


    // Offers 
    validateOffer: Joi.object({
        startDateOfOffers: Joi.date().min('1-1-2024').required(),
        endDateOfOffers: Joi.date().greater(Joi.ref('startDateOfOffers')).required(),
        valueOfOffer: Joi.number().integer().min(1).max(100).required(),
        typeOfOffer: Joi.string().valid('percentage').required(),
        productsIds: Joi.array().unique().items(Joi.objectId().required()).required(),
    }),
    validateDeleteOffer: Joi.object({
        productId: Joi.objectId().required(),
        offerId: Joi.objectId().required(),
    }),
    validateUpdateOffer: Joi.object({
        startDateOfOffers: Joi.date().min('1-1-2024').required(),
        endDateOfOffers: Joi.date().greater(Joi.ref('startDateOfOffers')).required(),
        valueOfOffer: Joi.number().integer().min(1).max(100).required(),
        typeOfOffer: Joi.string().valid('percentage').required(),
        productsIds: Joi.array().unique().items(Joi.objectId().required()),
        offerId: Joi.objectId().required(),
        active: Joi.boolean().required(),
    }),
    updateOfferActive: Joi.object({
        offerId: Joi.objectId().required(),
        newActiveValue: Joi.boolean().required(),
    }),


    // Comment Validate
    validateComment: Joi.object({
        userName: Joi.string().required().min(3).max(15).alphanum(),
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5),
    }),
    validatecommentId: Joi.object({
        commentId: Joi.objectId().required(),
    }),


    // WishList 
    validateproductId: Joi.object({
        productId: Joi.objectId().required(),
    }),


    // Cart
    validateCartInfo: Joi.object({
        data: Joi.object({
            customizable: Joi.string(),
            writableOnBack: Joi.string(),
            writableOnFace: Joi.string(),
        }),
        randomNumber: Joi.number().required(),
    }),

    validateProductNote: Joi.object({
        data: Joi.object({
            note: Joi.string().required(),
        }).required(),
        randomNumber: Joi.number().required(),
    }),
    validateCartOperation: Joi.object({
        randomNumber: Joi.number().required(),
        operation: Joi.string().valid('ADD', 'SUB').required()
    }),
    validateCartRandomNumber: Joi.object({
        randomNumber: Joi.number().required()
    }),


    // Order
    validateOrder: Joi.object({
        userInfo: Joi.object({
            firstName: Joi.string().min(3).max(20).alphanum().required(),
            lastName: Joi.string().min(3).max(20).alphanum().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
        }).required(),
        shippingAddress: Joi.object({
            country: Joi.string().alphanum().required(),
            city: Joi.string().alphanum().required(),
            region: Joi.string().alphanum().required(),
            streetNumber: Joi.number().integer().required(),
            houseNumber: Joi.number().integer().required(),
            description: Joi.string().required(),
        }).required(),
        couponName: Joi.any(),
    }),

    validateOrderAdvancedSearch: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
        country: Joi.string(),
        city: Joi.string().alphanum(),
        region: Joi.string(),
        streetNumber: Joi.number(),
        houseNumber: Joi.number(),
        status: Joi.string(),
        totalPrice: Joi.number(),
        paymentMethod: Joi.string(),
        page: Joi.number().integer().required().min(1),
    }),
    validateOrderStutas: Joi.object({
        id: Joi.objectId().required(),
        status: Joi.string().valid('processing', 'shipped', 'completed', 'cancelled').required()
    }),


    // Dispute
    validateDispute: Joi.object({
        firstName: Joi.string().required().min(3).max(15).alphanum(),
        lastName: Joi.string().required().min(3).max(15).alphanum(),
        email: Joi.string().email().required(),
        message: Joi.string().required(),
    }),
    validateDisputeMessage: Joi.object({
        message: Joi.string().required(),
    }),
    validateDisputeStutas: Joi.object({
        status: Joi.string().valid('rejected', 'resolved').required()
    }),
    validateEmail: Joi.object({
        email: Joi.string().email().required()
    }),


    // Testimonial
    validateTestimonial: Joi.object({
        title: Joi.string().required(),
        testimonial: Joi.string().required()
    }),


    // About Us
    validateAboutUs: Joi.object({
        textAr: Joi.string().required(),
        textEn: Joi.string().required()
    }),


    // Social
    validateSocial: Joi.object({
        socialName: Joi.string().required(),
        socialUrl: Joi.string().required()
    }),


    // Notificatio
    validateNotificatio: Joi.object({
        title: Joi.string().required(),
        subTitle: Joi.string().required()
    }),


    // Influencer
    validateInfluencer: Joi.object({
        name: Joi.string().required().min(3),
        phoneNumber: Joi.number().required(),
        email: Joi.string().email().required(),
        region: Joi.string().required(),
    }),
    validateInfluencerRating: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
    }),
    // Coupon
    validateAddCoupon: Joi.object({
        couponName: Joi.string().required(),
        influencer: Joi.objectId().required(),
        CouponPercentage: Joi.number().integer().min(1).max(100).required(),
        influencerPercentage: Joi.number().integer().min(1).max(100).required(),
        usersNumber: Joi.number().integer().min(1),
        fromTotalPrice:Joi.boolean().required(),
        ExpirationDate: Joi.date().min('1-1-2024').required()
    }),
    validateInCouponName: Joi.object({
        name: Joi.string().required(),
    }),
    validateCouponId: Joi.object({
        couponId: Joi.objectId().required()
    }),
    validateInfluncerId: Joi.object({
        influencerId: Joi.objectId().required()
    }),
    validateCoupon: Joi.object({
        couponName: Joi.string().required(),
    }),

    // Delevery Cost
    validateAddCost: Joi.object({
        from: Joi.number().integer().positive().required(),
        to: Joi.number().integer().positive().required(),
        cost: Joi.number().integer().positive().required(),
    }),

    validateCost: Joi.object({
        totalPrice: Joi.number().integer().positive().required()
        
       
    }),


    // Pagination Validate
    validatePage: Joi.object({
        page: Joi.number().integer().required().min(1),
    }),
    validateFileName: Joi.object({
        fileName: Joi.string().required(),
    }),

};
module.exports = schemas;
