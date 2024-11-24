const Product = require('../../models/product/product');
const mongoose = require('mongoose');
const updatePrice = require("../../utils/product/updatePrice");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class ProductRepository {

    async addProduct(product) {
        try {
            return await Product.create(product);
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async addMainImageToProduct({ _id, mainImage }) {
        try {
            let product = await Product.findById(_id);


            if (!product) {
                throw new CustomError("Product not found", statusCode.NotFound);
            }

            product.mainImage = mainImage;

            return await product.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async addGalleriesToProduct({
        _id,
        galleryImages
    }) {
        try {
            let product = await Product.findById(_id);


            if (!product) {
                throw new CustomError("Product not found", statusCode.NotFound);
            }
            product.galleryImages = galleryImages;

            return await product.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async updateSingleGallery({
        _id,
        galleryImage,
        oldPath
    }) {
        try {
            let product = await Product.findById(_id);
            
            if (!product) {
                throw new CustomError("Product not found", statusCode.NotFound);
            }
            const gallaryIndex = product.galleryImages.findIndex(item => item === oldPath);

            if (gallaryIndex === -1) {
                throw new CustomError('Gallary Image not found', statusCode.NotFound)
            }
            product.galleryImages[gallaryIndex] = galleryImage;

            return await product.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async updateProduct(product) {
        try {
            const newProduct = await Product.findById(product._id);
            if (!newProduct) {
                throw new CustomError("Product not found", statusCode.NotFound);
            }
            newProduct.name = product.name;
            newProduct.description = product.description;
            newProduct.price = product.price;
            newProduct.metalType = product.metalType;
            newProduct.customizable = product.customizable;
            newProduct.writableOnFace = product.writableOnFace;
            newProduct.category = product.category;
            newProduct.writableOnBack = product.writableOnBack;
            newProduct.addableImage = product.addableImage;

            return await newProduct.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    extractDataFromProduct(product) {
        try {
            const productInfo = product._doc
            const priceAfterOffer = product.priceAfterOffer
            return {
                ...productInfo,
                priceAfterOffer
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async getProductByID(_id) {
        try {
            const validProductId = new mongoose.Types.ObjectId(_id);
            const product = await Product.findOne({
                _id: validProductId
            }).populate("owner_id");

            if (!product) {
                throw new CustomError("Product not found", statusCode.NotFound);
            }

            const updatedProduct = updatePrice(product);
            const newProduct = this.extractDataFromProduct({
                ...updatedProduct
            })
            return newProduct
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getProductGallery(_id) {
        try {
            const productGallery = Product.findById(_id).select("galleryImages");

            if (!productGallery) {
                throw new CustomError("product Gallery not found", statusCode.NotFound);
            }
            return productGallery;

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async getProductMainImage(_id) {
        try {
            const productMainImage = Product.findById(_id).select("mainImage");
            if (!productMainImage) {
                throw new CustomError("product Main Image not found", statusCode.NotFound);
            }
            return productMainImage;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async deleteProduct(_id) {
        const validProductId = new mongoose.Types.ObjectId(_id);
        try {
            const { deletedCount } = await Product.deleteOne({
                _id: validProductId
            });

            if (!deletedCount || deletedCount <= 0) {
                throw new CustomError("Product Not Found", statusCode.NotFound)
            }
            return deletedCount;

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    isOverlappingOffers(offer1, offer2) {
        try {
            return (
                offer1.startDateOfOffers <= offer2.endDateOfOffers &&
                offer1.endDateOfOffers >= offer2.startDateOfOffers
            );
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    isSameOffer(offer1, offer2) {
        try {
            return (
                offer1.startDateOfOffers.getTime() === offer2.startDateOfOffers.getTime() &&
                offer1.endDateOfOffers.getTime() === offer2.endDateOfOffers.getTime()
            );
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async addOffer({
        productsIds,
        endDateOfOffers,
        startDateOfOffers,
        valueOfOffer,
        typeOfOffer
    }) {
        try {
            const newOffer = {
                valueOfOffer: valueOfOffer,
                typeOfOffer: typeOfOffer,
                startDateOfOffers: new Date(startDateOfOffers),
                endDateOfOffers: new Date(endDateOfOffers),
            };
            const products = await Product.find({
                _id: {
                    $in: productsIds
                }
            });
            if (products.length === 0) {
                throw new CustomError("Products  Not Found", statusCode.NotFound)
            }

            const updatePromises = [];
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                updatePromises.push(this.handleProductAddOffer(product, newOffer));
            }

            const result = await Promise.all(updatePromises);

            if (!result || result.length === 0) {
                throw new CustomError("offer  Not Add", statusCode.BadRequest)
            }
            return result;

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async handleProductAddOffer(product, newOffer) {
        try {
            let existingOfferIndex = -1;
            let overlappingOffer = null;

            for (let i = 0; i < product.offers.length; i++) {
                const existingOffer = product.offers[i];

                if (this.isSameOffer(existingOffer, newOffer)) {
                    existingOfferIndex = i;
                    break;
                }

                if (this.isOverlappingOffers(existingOffer, newOffer)) {
                    overlappingOffer = existingOffer;
                    break;
                }
            }

            if (existingOfferIndex === -1 && !overlappingOffer) {
                // Offer not found and no overlapping offer found, add the new offer
                return Product.updateOne({
                    _id: product._id
                }, {
                    $push: {
                        offers: newOffer
                    }
                });
            } else {
                // Offer already exists or overlapping offer found, handle as needed
                if (existingOfferIndex !== -1) {
                    throw new CustomError(`Offer already exists for product { ${product._id} }`, statusCode.BadRequest);
                }
                if (overlappingOffer) {
                    throw new CustomError(`Overlapping offer found for product { ${product._id} }`, statusCode.BadRequest);
                }
                return null;
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async deleteOffer(productId, offerId) {
        try {
            const { modifiedCount } = await Product.updateOne({
                _id: new mongoose.Types.ObjectId(productId)
            }, {
                $pull: {
                    offers: {
                        _id: new mongoose.Types.ObjectId(offerId)
                    }
                }
            });
            if (!modifiedCount || modifiedCount <= 0) {
                throw new CustomError("Offer not found or already deleted", statusCode.NotFound)
            }

            return modifiedCount > 0;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async updateOffer(productId, offerId, updatedData) {
        try {
            const result = await Product.findOneAndUpdate({
                _id: new mongoose.Types.ObjectId(productId),
                'offers._id': new mongoose.Types.ObjectId(offerId)
            }, {
                $set: {
                    'offers.$': updatedData
                }
            }, {
                new: true
            });
            if (!result) {
                throw new CustomError("Offer not found or already updated", statusCode.NotFound)
            }
            return result;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async updateOfferActive(productId, offerId, newActiveValue) {
        try {
            const result = await Product.findOneAndUpdate({
                _id: new mongoose.Types.ObjectId(productId),
                'offers._id': new mongoose.Types.ObjectId(offerId)
            }, {
                $set: {
                    'offers.$.active': newActiveValue
                }
            }, {
                new: true
            });

            if (!result) {
                throw new CustomError("Offer not found or already updated", statusCode.NotFound)
            }
            return result;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getOffersInProduct(productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new CustomError("product not found", statusCode.NotFound)
            }
            return product.offers || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async addComment(productId, commentData) {
        try {
            const result = await Product.updateOne({
                _id: productId
            }, {
                $push: {
                    comments: commentData
                }
            });
            const { modifiedCount } = result;

            if (!modifiedCount || modifiedCount <= 0) {
                throw new CustomError("product not found", statusCode.NotFound)
            }
            return modifiedCount;

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async deleteComment(productId, commentId) {
        try {
            const result = await Product.updateOne({
                _id: productId
            }, {
                $pull: {
                    comments: {
                        _id: commentId
                    }
                }
            });
            const { modifiedCount } = result;

            if (!modifiedCount || modifiedCount <= 0) {
                throw new CustomError("comment not found", statusCode.NotFound)
            }
            return result;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getAllComments(productId) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                throw new CustomError("product not found", statusCode.NotFound)
            }

            return product.comments || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getCommentById(productId, commentId) {
        try {
            const product = await Product.findOne({
                _id: productId
            });

            if (!product) {
                throw new CustomError("product not found", statusCode.NotFound)
            }

            const comment = product.comments.find(comment => comment._id.equals(commentId));

            if (!comment || comment.length === 0) {
                throw new CustomError("Product not contain any comments", statusCode.NotFound)
            }


            await Product.populate(comment, {
                path: 'user'
            });
            return comment;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    extractProductData(products) {

        try {
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
            return result;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async getProductsByQuery(query, offset) {
        try {

            const products = await Product.find(query).populate('owner_id').skip(offset).limit(10);

            const newResult = this.extractProductData(products);

            return newResult || [];

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async Search({
        name,
        offset
    }) {
        try {
            const query = Product.find();


            if (name) {
                query.or([{
                    'name.arabic': {
                        $regex: new RegExp(name, 'i')
                    }
                },
                {
                    'name.english': {
                        $regex: new RegExp(name, 'i')
                    }
                }
                ]);
            }

            const products = await query.skip(offset).limit(10).exec();
            const newResult = this.extractProductData(products);


            return newResult || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async deleteProductsByCategory(category) {
        try {
            const { deletedCount } = await Product.deleteMany({
                category
            });


            if (!deletedCount || deletedCount <= 0) {
                throw new CustomError('products not found', statusCode.NotFound)
            }

            return deletedCount;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async updateProductsByCategory(category, newCategory) {
        try {
            const result = await Product.updateMany({
                category
            }, {
                $set: { category: newCategory }
            });

            if (!result) {
                throw new CustomError('Failed to update products.', statusCode.BadRequest);
            }

            return result;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }


    async advancedSearch({
        name,
        metalType,
        price,
        category,
        customizable,
        writableOnFace,
        writableOnBack,
        addableImage,
        offset,
    }) {
        try {
            const query = Product.find();
            if (name) {
                query.or([{
                    'name.arabic': {
                        $regex: new RegExp(name, 'i')
                    }
                },
                {
                    'name.english': {
                        $regex: new RegExp(name, 'i')
                    }
                }
                ]);
            }
            if (metalType) {
                query.where('metalType').equals(metalType);
            }
            if (category) {
                query.where('category').equals(category);
            }
            if (customizable) {
                query.where('customizable').equals(customizable);
            }
            if (writableOnFace) {
                query.where('customizable').equals(customizable);
            }
            if (writableOnBack) {
                query.where('customizable').equals(customizable);
            }
            if (addableImage) {
                query.where('customizable').equals(customizable);
            }

            if (price) {
                const priceFilter = {};
                priceFilter.$lte = price;
                query.where('price').equals(priceFilter);
            }



            const products = await query.skip(offset).limit(10).exec();

            const newResult = this.extractProductData(products);

            return newResult || [];

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }

    async getProductsByActiveOffers(offset) {
        try {
            const products = await Product.find({
                'offers.active': true,
                'offers.startDateOfOffers': {
                    $lte: new Date()
                },
                'offers.endDateOfOffers': {
                    $gte: new Date()
                },
            })
                .sort({
                    'offers.valueOfOffer': -1
                })
                .populate('owner_id')
                .skip(offset).limit(10);

            const newResult = this.extractProductData(products);


            return newResult || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
}
module.exports = new ProductRepository();